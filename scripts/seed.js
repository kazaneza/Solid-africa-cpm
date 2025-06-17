import { db, queries } from '../src/lib/database.js';
import bcrypt from 'bcryptjs';

console.log('Seeding database with initial data...');

// Create admin user
const hashedPassword = bcrypt.hashSync('admin123', 10);
const adminUser = queries.createUser.get('admin@solidafrica.org', hashedPassword, 'ADMIN');
console.log('✅ Admin user created');

// Create schools
const school1 = queries.createSchool.get('GS Ruhanga', 'Ruhanga, Rwanda', 1);
const school2 = queries.createSchool.get('GS Kagugu', 'Kagugu, Rwanda', 1);
console.log('✅ Schools created');

// Create ingredients
const ingredients = [
  ['Rice', 'kg', 'Starch'],
  ['Kawunga', 'kg', 'Starch'],
  ['Dry Beans', 'kg', 'Protein'],
  ['Cooking Oil', 'ltr', 'Fat'],
  ['Salt', 'kg', 'Seasoning']
];

ingredients.forEach(([name, unit, category]) => {
  queries.createIngredient.get(name, unit, category);
});
console.log('✅ Ingredients created');

// Create current week
const currentDate = new Date();
const startOfWeek = new Date(currentDate);
startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
const endOfWeek = new Date(startOfWeek);
endOfWeek.setDate(startOfWeek.getDate() + 4); // Friday

const weekNumber = Math.ceil((currentDate.getTime() - new Date(currentDate.getFullYear(), 0, 1).getTime()) / (7 * 24 * 60 * 60 * 1000));

const currentWeek = queries.createWeek.get(
  currentDate.getMonth() + 1,
  currentDate.getFullYear(),
  weekNumber,
  startOfWeek.toISOString().split('T')[0],
  endOfWeek.toISOString().split('T')[0]
);
console.log('✅ Current week created');

console.log('🎉 Database seeded successfully!');
console.log(`📧 Admin login: admin@solidafrica.org`);
console.log(`🔑 Admin password: admin123`);