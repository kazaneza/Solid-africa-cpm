import express from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/reports/weekly/:weekId
router.get('/weekly/:weekId', authenticateToken, async (req, res, next) => {
  try {
    const { weekId } = req.params;

    const week = await prisma.week.findUnique({
      where: { id: weekId },
      include: {
        purchases: {
          include: {
            ingredient: true
          }
        },
        productions: {
          include: {
            school: true
          }
        }
      }
    });

    if (!week) {
      return res.status(404).json({ error: 'Week not found' });
    }

    // Calculate purchase summary
    const purchaseSummary = week.purchases.reduce((acc, purchase) => {
      const category = purchase.ingredient.category;
      if (!acc[category]) {
        acc[category] = { quantity: 0, cost: 0, count: 0 };
      }
      acc[category].quantity += purchase.quantity;
      acc[category].cost += purchase.totalPrice;
      acc[category].count += 1;
      return acc;
    }, {} as Record<string, { quantity: number; cost: number; count: number }>);

    // Calculate production summary
    const productionSummary = week.productions.reduce((acc, production) => {
      const schoolName = production.school.name;
      if (!acc[schoolName]) {
        acc[schoolName] = {
          starchKg: 0,
          vegetablesKg: 0,
          totalKg: 0,
          beneficiaries: 0,
          productions: 0
        };
      }
      acc[schoolName].starchKg += production.starchKg;
      acc[schoolName].vegetablesKg += production.vegetablesKg;
      acc[schoolName].totalKg += production.totalKg;
      acc[schoolName].beneficiaries += production.beneficiaries;
      acc[schoolName].productions += 1;
      return acc;
    }, {} as Record<string, any>);

    const report = {
      week: {
        id: week.id,
        weekNumber: week.weekNumber,
        month: week.month,
        year: week.year,
        startDate: week.startDate,
        endDate: week.endDate
      },
      summary: {
        totalMealsServed: week.mealsServed,
        totalIngredientCost: week.ingredientCost,
        costPerMeal: week.costPerMeal,
        overheadPerMeal: week.overheadPerMeal,
        totalCostPerMeal: week.totalCPM,
        totalPurchases: week.purchases.length,
        totalProductions: week.productions.length
      },
      purchases: {
        total: week.purchases.length,
        totalCost: week.ingredientCost,
        byCategory: purchaseSummary,
        details: week.purchases.map(p => ({
          ingredient: p.ingredient.name,
          category: p.ingredient.category,
          quantity: p.quantity,
          unit: p.ingredient.unit,
          unitPrice: p.unitPrice,
          totalPrice: p.totalPrice,
          date: p.purchaseDate
        }))
      },
      productions: {
        total: week.productions.length,
        totalBeneficiaries: week.mealsServed,
        bySchool: productionSummary,
        details: week.productions.map(p => ({
          school: p.school.name,
          date: p.productionDate,
          starchKg: p.starchKg,
          vegetablesKg: p.vegetablesKg,
          totalKg: p.totalKg,
          beneficiaries: p.beneficiaries
        }))
      }
    };

    res.json({ report });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/monthly/:month/:year
router.get('/monthly/:month/:year', authenticateToken, async (req, res, next) => {
  try {
    const month = parseInt(req.params.month);
    const year = parseInt(req.params.year);

    if (month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid month' });
    }

    // Get all weeks in the month
    const weeks = await prisma.week.findMany({
      where: { month, year },
      include: {
        purchases: {
          include: { ingredient: true }
        },
        productions: {
          include: { school: true }
        }
      },
      orderBy: { weekNumber: 'asc' }
    });

    // Get indirect costs
    const indirectCosts = await prisma.indirectCost.findMany({
      where: { month, year },
      orderBy: { createdAt: 'desc' }
    });

    // Get monthly summary
    const monthlySummary = await prisma.monthlySummary.findUnique({
      where: {
        month_year: { month, year }
      }
    });

    // Calculate totals
    const totals = weeks.reduce((acc, week) => {
      acc.mealsServed += week.mealsServed;
      acc.ingredientCost += week.ingredientCost;
      acc.purchases += week.purchases.length;
      acc.productions += week.productions.length;
      return acc;
    }, {
      mealsServed: 0,
      ingredientCost: 0,
      purchases: 0,
      productions: 0
    });

    const totalIndirectCosts = indirectCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const totalCosts = totals.ingredientCost + totalIndirectCosts;
    const avgCostPerMeal = totals.mealsServed > 0 ? totalCosts / totals.mealsServed : 0;

    // Category breakdown
    const categoryBreakdown = weeks.reduce((acc, week) => {
      week.purchases.forEach(purchase => {
        const category = purchase.ingredient.category;
        if (!acc[category]) {
          acc[category] = { quantity: 0, cost: 0 };
        }
        acc[category].quantity += purchase.quantity;
        acc[category].cost += purchase.totalPrice;
      });
      return acc;
    }, {} as Record<string, { quantity: number; cost: number }>);

    // School breakdown
    const schoolBreakdown = weeks.reduce((acc, week) => {
      week.productions.forEach(production => {
        const schoolName = production.school.name;
        if (!acc[schoolName]) {
          acc[schoolName] = {
            beneficiaries: 0,
            starchKg: 0,
            vegetablesKg: 0,
            totalKg: 0
          };
        }
        acc[schoolName].beneficiaries += production.beneficiaries;
        acc[schoolName].starchKg += production.starchKg;
        acc[schoolName].vegetablesKg += production.vegetablesKg;
        acc[schoolName].totalKg += production.totalKg;
      });
      return acc;
    }, {} as Record<string, any>);

    const report = {
      period: { month, year },
      summary: {
        totalMealsServed: totals.mealsServed,
        totalIngredientCost: totals.ingredientCost,
        totalIndirectCosts,
        totalCosts,
        avgCostPerMeal,
        overheadPerMeal: monthlySummary?.overheadPerMeal || 0,
        totalWeeks: weeks.length,
        totalPurchases: totals.purchases,
        totalProductions: totals.productions
      },
      weeks: weeks.map(week => ({
        weekNumber: week.weekNumber,
        startDate: week.startDate,
        endDate: week.endDate,
        mealsServed: week.mealsServed,
        ingredientCost: week.ingredientCost,
        costPerMeal: week.costPerMeal,
        totalCPM: week.totalCPM
      })),
      purchases: {
        byCategory: categoryBreakdown,
        total: totals.purchases,
        totalCost: totals.ingredientCost
      },
      productions: {
        bySchool: schoolBreakdown,
        total: totals.productions,
        totalBeneficiaries: totals.mealsServed
      },
      indirectCosts: {
        total: totalIndirectCosts,
        breakdown: indirectCosts.reduce((acc, cost) => {
          if (!acc[cost.category]) {
            acc[cost.category] = 0;
          }
          acc[cost.category] += cost.amount;
          return acc;
        }, {} as Record<string, number>),
        details: indirectCosts
      }
    };

    res.json({ report });
  } catch (error) {
    next(error);
  }
});

// GET /api/reports/daily/:date
router.get('/daily/:date', authenticateToken, async (req, res, next) => {
  try {
    const { date } = req.params;
    const targetDate = new Date(date);
    
    // Get start and end of day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get productions for the day
    const productions = await prisma.production.findMany({
      where: {
        productionDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        school: true,
        week: true
      }
    });

    // Get purchases for the day
    const purchases = await prisma.purchase.findMany({
      where: {
        purchaseDate: {
          gte: startOfDay,
          lte: endOfDay
        }
      },
      include: {
        ingredient: true,
        week: true
      }
    });

    // Calculate summaries
    const productionSummary = productions.reduce((acc, prod) => {
      acc.totalBeneficiaries += prod.beneficiaries;
      acc.totalStarchKg += prod.starchKg;
      acc.totalVegetablesKg += prod.vegetablesKg;
      acc.totalKg += prod.totalKg;
      return acc;
    }, {
      totalBeneficiaries: 0,
      totalStarchKg: 0,
      totalVegetablesKg: 0,
      totalKg: 0
    });

    const purchaseSummary = purchases.reduce((acc, purchase) => {
      acc.totalCost += purchase.totalPrice;
      acc.totalQuantity += purchase.quantity;
      return acc;
    }, {
      totalCost: 0,
      totalQuantity: 0
    });

    const report = {
      date: targetDate.toISOString().split('T')[0],
      summary: {
        totalMealsServed: productionSummary.totalBeneficiaries,
        totalIngredientCost: purchaseSummary.totalCost,
        costPerMeal: productionSummary.totalBeneficiaries > 0 
          ? purchaseSummary.totalCost / productionSummary.totalBeneficiaries 
          : 0,
        totalPurchases: purchases.length,
        totalProductions: productions.length
      },
      productions: {
        summary: productionSummary,
        bySchool: productions.reduce((acc, prod) => {
          const schoolName = prod.school.name;
          if (!acc[schoolName]) {
            acc[schoolName] = {
              beneficiaries: 0,
              starchKg: 0,
              vegetablesKg: 0,
              totalKg: 0
            };
          }
          acc[schoolName].beneficiaries += prod.beneficiaries;
          acc[schoolName].starchKg += prod.starchKg;
          acc[schoolName].vegetablesKg += prod.vegetablesKg;
          acc[schoolName].totalKg += prod.totalKg;
          return acc;
        }, {} as Record<string, any>),
        details: productions
      },
      purchases: {
        summary: purchaseSummary,
        byCategory: purchases.reduce((acc, purchase) => {
          const category = purchase.ingredient.category;
          if (!acc[category]) {
            acc[category] = { quantity: 0, cost: 0 };
          }
          acc[category].quantity += purchase.quantity;
          acc[category].cost += purchase.totalPrice;
          return acc;
        }, {} as Record<string, any>),
        details: purchases
      }
    };

    res.json({ report });
  } catch (error) {
    next(error);
  }
});

export { router as reportRoutes };