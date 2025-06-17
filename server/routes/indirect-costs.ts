import express from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken, AuthRequest, requireRole } from '../middleware/auth';
import { validateRequired, validatePositiveNumber } from '../middleware/validation';

const router = express.Router();

// POST /api/indirect-costs
router.post('/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  validateRequired(['month', 'year', 'category', 'description', 'amount']),
  validatePositiveNumber(['amount']),
  async (req: AuthRequest, res, next) => {
    try {
      const { month, year, category, description, amount } = req.body;

      const indirectCost = await prisma.indirectCost.create({
        data: {
          month,
          year,
          category: category.toUpperCase(),
          description,
          amount,
          createdBy: req.user!.id
        }
      });

      // Update monthly summary
      await updateMonthlySummary(month, year);

      res.status(201).json({
        message: 'Indirect cost added successfully',
        indirectCost
      });
    } catch (error) {
      next(error);
    }
  }
);

// GET /api/indirect-costs/month/:month/:year
router.get('/month/:month/:year', authenticateToken, async (req, res, next) => {
  try {
    const month = parseInt(req.params.month);
    const year = parseInt(req.params.year);

    if (month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid month' });
    }

    const indirectCosts = await prisma.indirectCost.findMany({
      where: { month, year },
      include: {
        user: {
          select: { email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const summary = await prisma.indirectCost.aggregate({
      where: { month, year },
      _sum: { amount: true },
      _count: true
    });

    const categoryBreakdown = await prisma.indirectCost.groupBy({
      by: ['category'],
      where: { month, year },
      _sum: { amount: true }
    });

    res.json({
      indirectCosts,
      summary: {
        totalAmount: summary._sum.amount || 0,
        totalEntries: summary._count,
        categoryBreakdown: categoryBreakdown.map(item => ({
          category: item.category,
          amount: item._sum.amount || 0
        }))
      }
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/indirect-costs/:id
router.put('/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  validatePositiveNumber(['amount']),
  async (req: AuthRequest, res, next) => {
    try {
      const { id } = req.params;
      const { category, description, amount } = req.body;

      const existingCost = await prisma.indirectCost.findUnique({
        where: { id }
      });

      if (!existingCost) {
        return res.status(404).json({ error: 'Indirect cost not found' });
      }

      const indirectCost = await prisma.indirectCost.update({
        where: { id },
        data: {
          ...(category && { category: category.toUpperCase() }),
          ...(description && { description }),
          ...(amount !== undefined && { amount })
        }
      });

      // Update monthly summary
      await updateMonthlySummary(existingCost.month, existingCost.year);

      res.json({
        message: 'Indirect cost updated successfully',
        indirectCost
      });
    } catch (error) {
      next(error);
    }
  }
);

// DELETE /api/indirect-costs/:id
router.delete('/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const indirectCost = await prisma.indirectCost.findUnique({
        where: { id }
      });

      if (!indirectCost) {
        return res.status(404).json({ error: 'Indirect cost not found' });
      }

      await prisma.indirectCost.delete({
        where: { id }
      });

      // Update monthly summary
      await updateMonthlySummary(indirectCost.month, indirectCost.year);

      res.json({ message: 'Indirect cost deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
);

// Helper function to update monthly summary
async function updateMonthlySummary(month: number, year: number) {
  const indirectCosts = await prisma.indirectCost.aggregate({
    where: { month, year },
    _sum: { amount: true }
  });

  const productions = await prisma.production.aggregate({
    where: {
      week: {
        month,
        year
      }
    },
    _sum: { beneficiaries: true }
  });

  const totalIndirectCosts = indirectCosts._sum.amount || 0;
  const totalMealsProduced = productions._sum.beneficiaries || 0;
  const overheadPerMeal = totalMealsProduced > 0 ? totalIndirectCosts / totalMealsProduced : 0;

  await prisma.monthlySummary.upsert({
    where: {
      month_year: { month, year }
    },
    update: {
      totalIndirectCosts,
      totalMealsProduced,
      overheadPerMeal
    },
    create: {
      month,
      year,
      totalIndirectCosts,
      totalMealsProduced,
      overheadPerMeal
    }
  });

  // Update all weeks in this month with new overhead per meal
  await prisma.week.updateMany({
    where: { month, year },
    data: { overheadPerMeal }
  });

  // Recalculate total CPM for all weeks
  const weeks = await prisma.week.findMany({
    where: { month, year }
  });

  for (const week of weeks) {
    await prisma.week.update({
      where: { id: week.id },
      data: {
        totalCPM: week.costPerMeal + overheadPerMeal
      }
    });
  }
}

export { router as indirectCostRoutes };