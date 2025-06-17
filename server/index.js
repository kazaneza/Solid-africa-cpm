import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db, queries, initializeDatabase } from '../src/lib/database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize database
initializeDatabase();

// Middleware
app.use(cors());
app.use(express.json());

// Auth middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = queries.getUserByEmail.get(email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = bcrypt.compareSync(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        created_at: user.created_at
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const user = queries.getUserById.get(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Schools routes
app.get('/api/schools', authenticateToken, (req, res) => {
  try {
    const schools = queries.getAllSchools.all();
    res.json({ schools });
  } catch (error) {
    console.error('Get schools error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Ingredients routes
app.get('/api/ingredients', authenticateToken, (req, res) => {
  try {
    const ingredients = queries.getAllIngredients.all();
    res.json({ ingredients });
  } catch (error) {
    console.error('Get ingredients error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Weeks routes
app.get('/api/weeks/current', authenticateToken, (req, res) => {
  try {
    const currentDate = new Date();
    const weekNumber = Math.ceil((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    let week = queries.getCurrentWeek.get(currentDate.getFullYear(), weekNumber);
    
    if (!week) {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 4);
      
      week = queries.createWeek.get(
        currentDate.getMonth() + 1,
        currentDate.getFullYear(),
        weekNumber,
        startOfWeek.toISOString().split('T')[0],
        endOfWeek.toISOString().split('T')[0]
      );
    }
    
    res.json({ week });
  } catch (error) {
    console.error('Get current week error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Purchases routes
app.get('/api/purchases/week/:weekId', authenticateToken, (req, res) => {
  try {
    const purchases = queries.getPurchasesByWeek.all(req.params.weekId);
    res.json({ purchases });
  } catch (error) {
    console.error('Get purchases error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/purchases', authenticateToken, (req, res) => {
  try {
    const { weekId, ingredientId, purchaseDate, quantity, unitPrice } = req.body;
    
    const purchase = queries.createPurchase.get(
      weekId,
      ingredientId,
      purchaseDate,
      quantity,
      unitPrice,
      req.user.userId
    );
    
    res.status(201).json({
      message: 'Purchase recorded successfully',
      purchase
    });
  } catch (error) {
    console.error('Create purchase error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Productions routes
app.get('/api/productions/week/:weekId', authenticateToken, (req, res) => {
  try {
    const productions = queries.getProductionsByWeek.all(req.params.weekId);
    res.json({ productions });
  } catch (error) {
    console.error('Get productions error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/productions', authenticateToken, (req, res) => {
  try {
    const {
      weekId,
      schoolId,
      productionDate,
      starchKg,
      vegetablesKg,
      starchPortionPerKg = 25,
      vegPortionPerKg = 30,
      beneficiaries
    } = req.body;
    
    const production = queries.createProduction.get(
      weekId,
      schoolId,
      productionDate,
      starchKg,
      vegetablesKg,
      starchPortionPerKg,
      vegPortionPerKg,
      beneficiaries,
      req.user.userId
    );
    
    res.status(201).json({
      message: 'Production recorded successfully',
      production
    });
  } catch (error) {
    console.error('Create production error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Indirect costs routes
app.get('/api/indirect-costs/month/:month/:year', authenticateToken, (req, res) => {
  try {
    const { month, year } = req.params;
    const indirectCosts = queries.getIndirectCostsByMonth.all(parseInt(month), parseInt(year));
    res.json({ indirectCosts });
  } catch (error) {
    console.error('Get indirect costs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/indirect-costs', authenticateToken, (req, res) => {
  try {
    const { month, year, category, description, amount } = req.body;
    
    const indirectCost = queries.createIndirectCost.get(
      month,
      year,
      category,
      description,
      amount,
      req.user.userId
    );
    
    res.status(201).json({
      message: 'Indirect cost added successfully',
      indirectCost
    });
  } catch (error) {
    console.error('Create indirect cost error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});