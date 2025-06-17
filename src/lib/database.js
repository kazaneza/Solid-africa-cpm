import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database connection
const dbPath = path.join(__dirname, '../../database.sqlite');
export const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Store queries object
export let queries = {};

// Database schema
export const initializeDatabase = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'USER' CHECK (role IN ('ADMIN', 'MANAGER', 'USER')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Schools table
  db.exec(`
    CREATE TABLE IF NOT EXISTS schools (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT NOT NULL,
      location TEXT DEFAULT '',
      active BOOLEAN DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Ingredients table
  db.exec(`
    CREATE TABLE IF NOT EXISTS ingredients (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      name TEXT UNIQUE NOT NULL,
      unit TEXT NOT NULL CHECK (unit IN ('kg', 'ltr', 'pcs')),
      category TEXT DEFAULT 'general',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Weeks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS weeks (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      week_number INTEGER NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      meals_served INTEGER DEFAULT 0,
      ingredient_cost DECIMAL(10,2) DEFAULT 0,
      cost_per_meal DECIMAL(10,4) DEFAULT 0,
      overhead_per_meal DECIMAL(10,4) DEFAULT 0,
      total_cpm DECIMAL(10,4) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(year, week_number)
    )
  `);

  // Purchases table
  db.exec(`
    CREATE TABLE IF NOT EXISTS purchases (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      week_id TEXT,
      ingredient_id TEXT,
      purchase_date DATE NOT NULL,
      quantity DECIMAL(10,3) NOT NULL,
      unit_price DECIMAL(10,2) NOT NULL,
      total_price DECIMAL(10,2) DEFAULT 0,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (week_id) REFERENCES weeks(id),
      FOREIGN KEY (ingredient_id) REFERENCES ingredients(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Productions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS productions (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      week_id TEXT,
      school_id TEXT,
      production_date DATE NOT NULL,
      starch_kg DECIMAL(10,3) DEFAULT 0,
      vegetables_kg DECIMAL(10,3) DEFAULT 0,
      total_kg DECIMAL(10,3) DEFAULT 0,
      starch_portion_per_kg DECIMAL(10,3) DEFAULT 0,
      veg_portion_per_kg DECIMAL(10,3) DEFAULT 0,
      beneficiaries INTEGER DEFAULT 0,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (week_id) REFERENCES weeks(id),
      FOREIGN KEY (school_id) REFERENCES schools(id),
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Indirect costs table
  db.exec(`
    CREATE TABLE IF NOT EXISTS indirect_costs (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      cost_category TEXT NOT NULL CHECK (cost_category IN ('SALARIES', 'TRANSPORT', 'UTILITIES', 'MAINTENANCE', 'EQUIPMENT', 'ADMINISTRATION', 'OTHER')),
      description TEXT DEFAULT '',
      amount DECIMAL(10,2) NOT NULL,
      created_by TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    )
  `);

  // Monthly summary table
  db.exec(`
    CREATE TABLE IF NOT EXISTS monthly_summary (
      id TEXT PRIMARY KEY DEFAULT (lower(hex(randomblob(16)))),
      month INTEGER NOT NULL,
      year INTEGER NOT NULL,
      total_indirect_costs DECIMAL(10,2) DEFAULT 0,
      total_meals_produced INTEGER DEFAULT 0,
      overhead_per_meal DECIMAL(10,4) DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(month, year)
    )
  `);

  // Create triggers for automatic calculations
  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_purchase_total
    AFTER INSERT ON purchases
    BEGIN
      UPDATE purchases 
      SET total_price = NEW.quantity * NEW.unit_price 
      WHERE id = NEW.id;
    END;
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_purchase_total_on_update
    AFTER UPDATE ON purchases
    BEGIN
      UPDATE purchases 
      SET total_price = NEW.quantity * NEW.unit_price 
      WHERE id = NEW.id;
    END;
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_production_total
    AFTER INSERT ON productions
    BEGIN
      UPDATE productions 
      SET total_kg = NEW.starch_kg + NEW.vegetables_kg 
      WHERE id = NEW.id;
    END;
  `);

  db.exec(`
    CREATE TRIGGER IF NOT EXISTS update_production_total_on_update
    AFTER UPDATE ON productions
    BEGIN
      UPDATE productions 
      SET total_kg = NEW.starch_kg + NEW.vegetables_kg 
      WHERE id = NEW.id;
    END;
  `);

  console.log('✅ Database schema created successfully');

  // Now prepare all queries after tables are created
  queries = {
    // Users
    createUser: db.prepare(`
      INSERT INTO users (email, password, role) 
      VALUES (?, ?, ?) 
      RETURNING id, email, role, created_at
    `),
    
    getUserByEmail: db.prepare(`
      SELECT id, email, password, role, created_at 
      FROM users 
      WHERE email = ?
    `),
    
    getUserById: db.prepare(`
      SELECT id, email, role, created_at 
      FROM users 
      WHERE id = ?
    `),

    // Schools
    getAllSchools: db.prepare(`
      SELECT * FROM schools 
      WHERE active = 1 
      ORDER BY name
    `),
    
    createSchool: db.prepare(`
      INSERT INTO schools (name, location, active) 
      VALUES (?, ?, ?) 
      RETURNING *
    `),

    // Ingredients
    getAllIngredients: db.prepare(`
      SELECT * FROM ingredients 
      ORDER BY name
    `),
    
    createIngredient: db.prepare(`
      INSERT INTO ingredients (name, unit, category) 
      VALUES (?, ?, ?) 
      RETURNING *
    `),

    // Weeks
    getCurrentWeek: db.prepare(`
      SELECT * FROM weeks 
      WHERE year = ? AND week_number = ?
    `),
    
    createWeek: db.prepare(`
      INSERT INTO weeks (month, year, week_number, start_date, end_date) 
      VALUES (?, ?, ?, ?, ?) 
      RETURNING *
    `),

    // Purchases
    getPurchasesByWeek: db.prepare(`
      SELECT p.*, i.name as ingredient_name, i.unit as ingredient_unit
      FROM purchases p
      JOIN ingredients i ON p.ingredient_id = i.id
      WHERE p.week_id = ?
      ORDER BY p.purchase_date DESC
    `),
    
    createPurchase: db.prepare(`
      INSERT INTO purchases (week_id, ingredient_id, purchase_date, quantity, unit_price, created_by) 
      VALUES (?, ?, ?, ?, ?, ?) 
      RETURNING *
    `),

    // Productions
    getProductionsByWeek: db.prepare(`
      SELECT p.*, s.name as school_name
      FROM productions p
      JOIN schools s ON p.school_id = s.id
      WHERE p.week_id = ?
      ORDER BY p.production_date DESC
    `),
    
    createProduction: db.prepare(`
      INSERT INTO productions (week_id, school_id, production_date, starch_kg, vegetables_kg, starch_portion_per_kg, veg_portion_per_kg, beneficiaries, created_by) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
      RETURNING *
    `),

    // Indirect costs
    getIndirectCostsByMonth: db.prepare(`
      SELECT * FROM indirect_costs 
      WHERE month = ? AND year = ? 
      ORDER BY created_at DESC
    `),
    
    createIndirectCost: db.prepare(`
      INSERT INTO indirect_costs (month, year, cost_category, description, amount, created_by) 
      VALUES (?, ?, ?, ?, ?, ?) 
      RETURNING *
    `)
  };

  console.log('✅ Database queries prepared successfully');
};

export { queries }