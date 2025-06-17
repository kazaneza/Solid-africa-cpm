import { initializeDatabase } from '../src/lib/database.js';

console.log('🔄 Initializing SQLite database...');
try {
  initializeDatabase();
  console.log('✅ Database migration completed successfully!');
} catch (error) {
  console.error('❌ Database migration failed:', error);
  process.exit(1);
}