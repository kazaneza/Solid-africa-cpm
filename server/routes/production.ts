import express from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { validateRequired, validatePositiveNumber, validateDate } from '../middleware/validation';

const router = express.Router();

// POST /api/production
router.post('/',
  authenticateToken,
  validateRequired(['weekId', 'schoolId', 'productionDate', 'starchKg', 'vegetablesKg', 'beneficiaries']),
  validatePositiveNumber(['starchKg', 'vegetablesKg', 'starchPortionPerKg', 'vegPortionPerKg', 'beneficiaries']),
  validateDate('productionDate'),
  async (req: AuthRequest, res, next) => {
    try {
      const {
        weekId,
        schoolId,
        productionDate,
        starchKg,
        vegetablesKg,
        starchPortionPerKg = 30,
        vegPortionPerKg = 56,
        beneficiaries
      } = req.body;

      const totalKg = starchKg + vegetablesKg;

      const production = await prisma.production.create({
        data: {
          weekId,
          schoolId,
          productionDate: new Date(productionDate),
          starchKg,
          vegetablesKg,
          totalKg,
          starchPortionPerKg,
          vegPortionPerKg,
          beneficiaries,
          createdBy: req.user!.id
        },
        include: {
          school: true,
          week: true
        }
      });

      // Update week's meal count
      await updateWeekMealCount(weekId);

      res.status(201).json({
        message: 'Production recorded successfully',
        production
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/production/week/:weekId
router.get('/week/:weekId', authenticateToken, async (req, res, next) => {
  try {
    const { weekId } = req.params;

    const productions = await prisma.production.findMany({
      where: { weekId },
      include: {
        school: true,
        user: {
          select: { email: true }
        }
      },
      orderBy: { productionDate: 'desc' }
    });

    const summary = await prisma.production.aggregate({
      where: { weekId },
      _sum: {
        starchKg: true,
        vegetablesKg: true,
        totalKg: true,
        beneficiaries: true
      },
      _count: true
    });

    res.json({
      productions,
      summary: {
        totalStarchKg: summary._sum.starchKg || 0,
        totalVegetablesKg: summary._sum.vegetablesKg || 0,
        totalKg: summary._sum.totalKg || 0,
        totalBeneficiaries: summary._sum.beneficiaries || 0,
        totalProductions: summary._count
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/production/day/:date
router.get('/day/:date', authenticateToken, async (req, res, next) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    
    // Get start and end of day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const productions = await prisma.production.findMany({
      where: {
        productionDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        school: true,
        user: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const summary = await prisma.production.aggregate({
      where: {
        productionDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      _sum: {
        starchKg: true,
        vegetablesKg: true,
        totalKg: true,
        beneficiaries: true
      },
      _count: true
    });

    res.json({
      date: targetDate.toISOString().split('T')[0],
      productions,
      summary: {
        totalStarchKg: summary._sum.starchKg || 0,
        totalVegetablesKg: summary._sum.vegetablesKg || 0,
        totalKg: summary._sum.totalKg || 0,
        totalBeneficiaries: summary._sum.beneficiaries || 0,
        totalProductions: summary._count
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/production/:id
router.put('/:id',
  authenticateToken,
  validatePositiveNumber(['starchKg', 'vegetablesKg', 'starchPortionPerKg', 'vegPortionPerKg', 'beneficiaries']),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const {
        starchKg,
        vegetablesKg,
        starchPortionPerKg,
        vegPortionPerKg,
        beneficiaries,
        productionDate
      } = req.body;

      const existingProduction = await prisma.production.findUnique({
        where: { id }
      });

      if (!existingProduction) {
        return res.status(404).json({ error: 'Production record not found' });
      }

      const updateData: any = {};
      if (starchKg !== undefined) updateData.starchKg = starchKg;
      if (vegetablesKg !== undefined) updateData.vegetablesKg = vegetablesKg;
      if (starchPortionPerKg !== undefined) updateData.starchPortionPerKg = starchPortionPerKg;
      if (vegPortionPerKg !== undefined) updateData.vegPortionPerKg = vegPortionPerKg;
      if (beneficiaries !== undefined) updateData.beneficiaries = beneficiaries;
      if (productionDate) updateData.productionDate = new Date(productionDate);

      if (starchKg !== undefined || vegetablesKg !== undefined) {
        updateData.totalKg = (starchKg || existingProduction.starchKg) + (vegetablesKg || existingProduction.vegetablesKg);
      }

      const production = await prisma.production.update({
        where: { id },
        data: updateData,
        include: {
          school: true
        }
      });

      // Update week meal count
      await updateWeekMealCount(existingProduction.weekId);

      res.json({
        message: 'Production updated successfully',
        production
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/production/:id
router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const production = await prisma.production.findUnique({
      where: { id }
    });

    if (!production) {
      return res.status(404).json({ error: 'Production record not found' });
    }

    await prisma.production.delete({
      where: { id }
    });

    // Update week meal count
    await updateWeekMealCount(production.weekId);

    res.json({ message: 'Production record deleted successfully' });
  } catch (error) {
    next(error);
  }
});

// Helper function to update week meal count
async function updateWeekMealCount(weekId: string) {
  const productions = await prisma.production.aggregate({
    where: { weekId },
    _sum: { beneficiaries: true }
  });

  const purchases = await prisma.purchase.aggregate({
    where: { weekId },
    _sum: { totalPrice: true }
  });

  const mealsServed = productions._sum.beneficiaries || 0;
  const ingredientCost = purchases._sum.totalPrice || 0;
  const costPerMeal = mealsServed > 0 ? ingredientCost / mealsServed : 0;

  await prisma.week.update({
    where: { id: weekId },
    data: {
      mealsServed,
      costPerMeal
    }
  });
}

export { router as productionRoutes };