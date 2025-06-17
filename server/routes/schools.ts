import express from 'express';
import { prisma } from '../../lib/prisma';
import { authenticateToken, requireRole } from '../middleware/auth';
import { validateRequired } from '../middleware/validation';

const router = express.Router();

// GET /api/schools
router.get('/', authenticateToken, async (req, res, next) => {
  try {
    const schools = await prisma.school.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { productions: true }
        }
      }
    });

    res.json({ schools });
  } catch (error) {
    next(error);
  }
});

// POST /api/schools
router.post('/',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  validateRequired(['name', 'location']),
  async (req, res, next) => {
    try {
      const { name, location, active = true } = req.body;

      const school = await prisma.school.create({
        data: {
          name,
          location,
          active
        }
      });

      res.status(201).json({
        message: 'School created successfully',
        school
      });
    } catch (error) {
      next(error);
    }
  }
);

// PUT /api/schools/:id
router.put('/:id',
  authenticateToken,
  requireRole(['ADMIN', 'MANAGER']),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, location, active } = req.body;

      const school = await prisma.school.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(location && { location }),
          ...(active !== undefined && { active })
        }
      });

      res.json({
        message: 'School updated successfully',
        school
      });
    } catch (error) {
      next(error);
    }
  }
);

export { router as schoolRoutes };