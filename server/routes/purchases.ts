import express from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateRequired, validatePositiveNumber, validateDate } from '../middleware/validation';

const router = express.Router();

// POST /api/purchases
router.post('/',
  authenticateToken,
  validateRequired(['weekId', 'ingredientId', 'purchaseDate', 'quantity', 'unitPrice']),
  validatePositiveNumber(['quantity', 'unitPrice']),
  validateDate('purchaseDate'),
  async (req: AuthRequest, res, next) => {
    try {
      const { weekId, ingredientId, purchaseDate, quantity, unitPrice } = req.body;
      const totalPrice = quantity * unitPrice;

      const purchase = await prisma.purchase.create({
        data: {
          weekId,
          ingredientId,
          purchaseDate: new Date(purchaseDate),
          quantity,
          unitPrice,
          totalPrice,
          createdBy: req.user!.id
        },
        include: {
          ingredient: true,
          week: true
        }
      });

      // Update week's ingredient cost
      await updateWeekCosts(weekId);

      res.status(201).json({
        message: 'Purchase recorded successfully',
        purchase
      });
    } catch (error) {
      next(error);
    }
  }
);

// POST /api/purchases/bulk
router.post('/bulk',
  authenticateToken,
  async (req: AuthRequest, res, next) => {
    try {
      const { purchases } = req.body;

      if (!Array.isArray(purchases) || purchases.length === 0) {
        return res.status(400).json({ error: 'Purchases array required' });
      }

      const createdPurchases = await Promise.all(
        purchases.map(async (purchase: any) => {
          const totalPrice = purchase.quantity * purchase.unitPrice;
          return prisma.purchase.create({
            data: {
              weekId: purchase.weekId,
              ingredientId: purchase.ingredientId,
              purchaseDate: new Date(purchase.purchaseDate),
              quantity: purchase.quantity,
              unitPrice: purchase.unitPrice,
              totalPrice,
              createdBy: req.user!.id
            },
            include: {
              ingredient: true
            }
          });
        })
      );

      // Update week costs for all affected weeks
      const weekIds = [...new Set(purchases.map((p: any) => p.weekId))];
      await Promise.all(weekIds.map(weekId => updateWeekCosts(weekId)));

      res.status(201).json({
        message: `${createdPurchases.length} purchases recorded successfully`,
        purchases: createdPurchases
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/purchases/week/:weekId
router.get('/week/:weekId', authenticateToken, async (req, res, next) => {
  try {
    const { weekId } = req.params;

    const purchases = await prisma.purchase.findMany({
      where: { weekId },
      include: {
        ingredient: true,
        user: {
          select: { email: true }
        }
      },
      orderBy: { purchaseDate: 'desc' }
    });

    const summary = await prisma.purchase.aggregate({
      where: { weekId },
      _sum: {
        totalPrice: true,
        quantity: true
      },
      _count: true
    });

    res.json({
      purchases,
      summary: {
        totalCost: summary._sum.totalPrice || 0,
        totalQuantity: summary._sum.quantity || 0,
        totalPurchases: summary._count
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/purchases/:id
router.put('/:id',
  authenticateToken,
  validatePositiveNumber(['quantity', 'unitPrice']),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const { quantity, unitPrice, purchaseDate } = req.body;

      const existingPurchase = await prisma.purchase.findUnique({
        where: { id }
      });

      if (!existingPurchase) {
        return res.status(404).json({ error: 'Purchase not found' });
      }

      const updateData: any = {};
      if (quantity !== undefined) updateData.quantity = quantity;
      if (unitPrice !== undefined) updateData.unitPrice = unitPrice;
      if (purchaseDate) updateData.purchaseDate = new Date(purchaseDate);
      
      if (quantity !== undefined || unitPrice !== undefined) {
        updateData.totalPrice = (quantity || existingPurchase.quantity) * (unitPrice || existingPurchase.unitPrice);
      }

      const purchase = await prisma.purchase.update({
        where: { id },
        data: updateData,
        include: {
          ingredient: true
        }
      });

      // Update week costs
      await updateWeekCosts(existingPurchase.weekId);

      res.json({
        message: 'Purchase updated successfully',
        purchase
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/purchases/:id
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const purchase = await prisma.purchase.findUnique({
      where: { id }
    });

    if (!purchase) {
      return res.status(404).json({ error: 'Purchase not found' });
    }

    await prisma.purchase.delete({
      where: { id }
    });

    // Update week costs
    await updateWeekCosts(purchase.weekId);

    res.json({ message: 'Purchase deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Helper function to update week costs
async function updateWeekCosts(weekId: string) {
  const purchases = await prisma.purchase.aggregate({
    where: { weekId },
    _sum: { totalPrice: true }
  });

  const productions = await prisma.production.aggregate({
    where: { weekId },
    _sum: { beneficiaries: true }
  });

  const ingredientCost = purchases._sum.totalPrice || 0;
  const mealsServed = productions._sum.beneficiaries || 0;
  const costPerMeal = mealsServed > 0 ? ingredientCost / mealsServed : 0;

  await prisma.week.update({
    where: { id: weekId },
    data: {
      ingredientCost,
      mealsServed,
      costPerMeal
    }
  });
}

export { router as purchaseRoutes };