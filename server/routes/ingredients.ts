import express from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequired } from '../middleware/validation';

const router = express.Router();

// GET /api/ingredients
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [ingredients, total] = await Promise.all([
      prisma.ingredient.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { purchases: true }
          }
        }
      }),
      prisma.ingredient.count()
    ]);

    res.json({
      ingredients,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/ingredients/search
router.get('/search', authenticateToken, async (req, res, next) => {
  try {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string') {
      return res.status(400).json({ error: 'Search query required' });
    }

    const ingredients = await prisma.ingredient.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { category: { contains: q, mode: 'insensitive' } }
        ]
      },
      orderBy: { name: 'asc' },
      take: 10
    });

    res.json({ ingredients });
  } catch (error) {
    next(error);
  }
});

// POST /api/ingredients
router.post('/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  validateRequired(['name', 'unit', 'category']),
  async (req, res, next) => {
    try {
      const { name, unit, category } = req.body;

      const ingredient = await prisma.ingredient.create({
        data: {
          name,
          unit: unit.toUpperCase(),
          category
        }
      });

      res.status(201).json({
        message: 'Ingredient created successfully',
        ingredient
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/ingredients/:id
router.put('/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, unit, category } = req.body;

      const ingredient = await prisma.ingredient.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(unit && { unit: unit.toUpperCase() }),
          ...(category && { category })
        }
      });

      res.json({
        message: 'Ingredient updated successfully',
        ingredient
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as ingredientRoutes };