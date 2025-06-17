import express from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// GET /api/weeks/current
router.get('/current', authenticateToken, async (req, res, next) => {
  try {
    const currentDate = new Date();
    const currentWeekNumber = getWeekNumber(currentDate);
    const currentYear = currentDate.getFullYear();

    let week = await prisma.week.findUnique({
      where: {
        year_weekNumber: {
          year: currentYear,
          weekNumber: currentWeekNumber
        }
      }
    });

    // If current week doesn't exist, create it
    if (!week) {
      const { startDate, endDate } = getWeekDates(currentYear, currentWeekNumber);
      
      week = await prisma.week.create({
        data: {
          month: currentDate.getMonth() + 1,
          year: currentYear,
          weekNumber: currentWeekNumber,
          startDate,
          endDate,
          mealsServed: 0,
          ingredientCost: 0,
          costPerMeal: 0,
          overheadPerMeal: 0,
          totalCPM: 0
        }
      });
    }

    res.json({ week });
  } catch (error) {
    next(error);
  }
});

// GET /api/weeks/month/:month/:year
router.get('/month/:month/:year', authenticateToken, async (req, res, next) => {
  try {
    const month = parseInt(req.params.month);
    const year = parseInt(req.params.year);

    if (month < 1 || month > 12) {
      return res.status(400).json({ error: 'Invalid month' });
    }

    const weeks = await prisma.week.findMany({
      where: {
        month,
        year
      },
      orderBy: { weekNumber: 'asc' },
      include: {
        _count: {
          select: {
            purchases: true,
            productions: true
          }
        }
      }
    });

    res.json({ weeks });
  } catch (error) {
    next(error);
  }
});

// POST /api/weeks/create
router.post('/create', authenticateToken, async (req, res, next) => {
  try {
    const { year, month } = req.body;
    
    if (!year || !month) {
      return res.status(400).json({ error: 'Year and month required' });
    }

    const weeksInMonth = getWeeksInMonth(year, month);
    const createdWeeks = [];

    for (const weekInfo of weeksInMonth) {
      const existingWeek = await prisma.week.findUnique({
        where: {
          year_weekNumber: {
            year,
            weekNumber: weekInfo.weekNumber
          }
        }
      });

      if (!existingWeek) {
        const week = await prisma.week.create({
          data: {
            month,
            year,
            weekNumber: weekInfo.weekNumber,
            startDate: weekInfo.startDate,
            endDate: weekInfo.endDate,
            mealsServed: 0,
            ingredientCost: 0,
            costPerMeal: 0,
            overheadPerMeal: 0,
            totalCPM: 0
          }
        });
        createdWeeks.push(week);
      }
    }

    res.json({
      message: `${createdWeeks.length} weeks created for ${month}/${year}`,
      weeks: createdWeeks
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/weeks/:id
router.get('/:id', authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;

    const week = await prisma.week.findUnique({
      where: { id },
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

    res.json({ week });
  } catch (error) {
    next(error);
  }
});

// Helper functions
function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

function getWeekDates(year: number, weekNumber: number) {
  const firstDayOfYear = new Date(year, 0, 1);
  const daysToAdd = (weekNumber - 1) * 7 - firstDayOfYear.getDay() + 1;
  
  const startDate = new Date(year, 0, 1 + daysToAdd);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  
  return { startDate, endDate };
}

function getWeeksInMonth(year: number, month: number) {
  const firstDay = new Date(year, month - 1, 1);
  const lastDay = new Date(year, month, 0);
  
  const weeks = [];
  let currentDate = new Date(firstDay);
  
  while (currentDate <= lastDay) {
    const weekNumber = getWeekNumber(currentDate);
    const { startDate, endDate } = getWeekDates(year, weekNumber);
    
    weeks.push({
      weekNumber,
      startDate,
      endDate
    });
    
    currentDate.setDate(currentDate.getDate() + 7);
  }
  
  return weeks;
}

export { router as weekRoutes };