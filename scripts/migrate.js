import { initializeDatabase } from '../src/lib/database.js';

console.log('Initializing SQLite database...');
initializeDatabase();
console.log('Database migration completed!');