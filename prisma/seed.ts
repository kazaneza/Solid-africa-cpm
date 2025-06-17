import { PrismaClient, UserRole, IngredientUnit, IndirectCostCategory } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@solidafrica.org' },
    update: {},
    create: {
      email: 'admin@solidafrica.org',
      password: hashedPassword,
      role: UserRole.ADMIN,
    },
  });

  console.log('✅ Admin user created');

  // Create schools - GS Ruhanga and GS Kagugu
  const schools = await Promise.all([
    prisma.school.upsert({
      where: { id: 'school-1' },
      update: {},
      create: {
        id: 'school-1',
        name: 'GS Ruhanga',
        location: 'Ruhanga, Rwanda',
        active: true,
      },
    }),
    prisma.school.upsert({
      where: { id: 'school-2' },
      update: {},
      create: {
        id: 'school-2',
        name: 'GS Kagugu',
        location: 'Kagugu, Rwanda',
        active: true,
      },
    }),
  ]);

  console.log('✅ Schools created');

  // Create ingredients - Rice, Kawunga, Dry Beans, Cooking oil, Salt
  const ingredients = await Promise.all([
    prisma.ingredient.upsert({
      where: { name: 'Rice' },
      update: {},
      create: {
        name: 'Rice',
        unit: IngredientUnit.KG,
        category: 'Starch',
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Kawunga' },
      update: {},
      create: {
        name: 'Kawunga',
        unit: IngredientUnit.KG,
        category: 'Starch',
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Dry Beans' },
      update: {},
      create: {
        name: 'Dry Beans',
        unit: IngredientUnit.KG,
        category: 'Protein',
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Cooking Oil' },
      update: {},
      create: {
        name: 'Cooking Oil',
        unit: IngredientUnit.LTR,
        category: 'Fat',
      },
    }),
    prisma.ingredient.upsert({
      where: { name: 'Salt' },
      update: {},
      create: {
        name: 'Salt',
        unit: IngredientUnit.KG,
        category: 'Seasoning',
      },
    }),
  ]);

  console.log('✅ Ingredients created');

  // Create current week (Monday-Friday operations)
  const currentDate = new Date();
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay() + 1); // Monday
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 4); // Friday (5-day week)

  const currentWeek = await prisma.week.upsert({
    where: {
      year_weekNumber: {
        year: currentDate.getFullYear(),
        weekNumber: getWeekNumber(currentDate),
      },
    },
    update: {},
    create: {
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      weekNumber: getWeekNumber(currentDate),
      startDate: startOfWeek,
      endDate: endOfWeek,
      mealsServed: 37475, // 7,495 × 5 days
      ingredientCost: 0,
      costPerMeal: 0,
      overheadPerMeal: 0,
      totalCPM: 0,
    },
  });

  console.log('✅ Current week created');

  // Create sample purchases with realistic Rwandan pricing
  const samplePurchases = await Promise.all([
    prisma.purchase.create({
      data: {
        weekId: currentWeek.id,
        ingredientId: ingredients[0].id, // Rice
        purchaseDate: new Date(),
        quantity: 500,
        unitPrice: 1200, // RWF per kg
        totalPrice: 600000, // 600,000 RWF
        createdBy: adminUser.id,
      },
    }),
    prisma.purchase.create({
      data: {
        weekId: currentWeek.id,
        ingredientId: ingredients[1].id, // Kawunga
        purchaseDate: new Date(),
        quantity: 300,
        unitPrice: 800, // RWF per kg
        totalPrice: 240000, // 240,000 RWF
        createdBy: adminUser.id,
      },
    }),
    prisma.purchase.create({
      data: {
        weekId: currentWeek.id,
        ingredientId: ingredients[2].id, // Dry Beans
        purchaseDate: new Date(),
        quantity: 200,
        unitPrice: 1500, // RWF per kg
        totalPrice: 300000, // 300,000 RWF
        createdBy: adminUser.id,
      },
    }),
    prisma.purchase.create({
      data: {
        weekId: currentWeek.id,
        ingredientId: ingredients[3].id, // Cooking Oil
        purchaseDate: new Date(),
        quantity: 50,
        unitPrice: 2500, // RWF per liter
        totalPrice: 125000, // 125,000 RWF
        createdBy: adminUser.id,
      },
    }),
    prisma.purchase.create({
      data: {
        weekId: currentWeek.id,
        ingredientId: ingredients[4].id, // Salt
        purchaseDate: new Date(),
        quantity: 25,
        unitPrice: 600, // RWF per kg
        totalPrice: 15000, // 15,000 RWF
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample purchases created');

  // Create sample productions for both schools (~7,495 beneficiaries per day)
  const sampleProductions = await Promise.all([
    prisma.production.create({
      data: {
        weekId: currentWeek.id,
        schoolId: schools[0].id, // GS Ruhanga
        productionDate: new Date(),
        starchKg: 180, // Rice + Kawunga
        vegetablesKg: 120, // Beans and other vegetables
        totalKg: 300,
        starchPortionPerKg: 25, // portions per kg
        vegPortionPerKg: 30, // portions per kg
        beneficiaries: 3750, // ~50% of daily total
        createdBy: adminUser.id,
      },
    }),
    prisma.production.create({
      data: {
        weekId: currentWeek.id,
        schoolId: schools[1].id, // GS Kagugu
        productionDate: new Date(),
        starchKg: 150,
        vegetablesKg: 100,
        totalKg: 250,
        starchPortionPerKg: 25,
        vegPortionPerKg: 30,
        beneficiaries: 3745, // ~50% of daily total
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample productions created');

  // Create indirect costs - PC Staff Salaries and Staff delivery fees
  const sampleIndirectCosts = await Promise.all([
    prisma.indirectCost.create({
      data: {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        category: IndirectCostCategory.SALARIES,
        description: 'PC Staff Salaries',
        amount: 13113063, // 13,113,063 RWF
        createdBy: adminUser.id,
      },
    }),
    prisma.indirectCost.create({
      data: {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
        category: IndirectCostCategory.TRANSPORT,
        description: 'Staff delivery fees',
        amount: 540000, // 540,000 RWF
        createdBy: adminUser.id,
      },
    }),
  ]);

  console.log('✅ Sample indirect costs created');

  // Calculate totals and update week
  const totalIngredientCost = samplePurchases.reduce((sum, purchase) => sum + purchase.totalPrice, 0);
  const totalIndirectCosts = sampleIndirectCosts.reduce((sum, cost) => sum + cost.amount, 0);
  const totalMealsProduced = sampleProductions.reduce((sum, prod) => sum + prod.beneficiaries, 0);
  
  // Update week with calculated costs
  const costPerMeal = totalMealsProduced > 0 ? totalIngredientCost / totalMealsProduced : 0;
  const overheadPerMeal = totalMealsProduced > 0 ? totalIndirectCosts / totalMealsProduced : 0;
  const totalCPM = costPerMeal + overheadPerMeal;

  await prisma.week.update({
    where: { id: currentWeek.id },
    data: {
      ingredientCost: totalIngredientCost,
      costPerMeal,
      overheadPerMeal,
      totalCPM,
    },
  });

  // Create monthly summary
  const monthlySummary = await prisma.monthlySummary.upsert({
    where: {
      month_year: {
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      },
    },
    update: {},
    create: {
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
      totalIndirectCosts,
      totalMealsProduced,
      overheadPerMeal,
    },
  });

  console.log('✅ Monthly summary created');

  console.log('🎉 Database seeded successfully with Rwandan school feeding data!');
  console.log(`📧 Admin login: admin@solidafrica.org`);
  console.log(`🔑 Admin password: admin123`);
  console.log(`🏫 Schools: GS Ruhanga, GS Kagugu`);
  console.log(`🍚 Daily beneficiaries: ~7,495`);
  console.log(`💰 Total ingredient cost: ${totalIngredientCost.toLocaleString()} RWF`);
  console.log(`💼 Total indirect costs: ${totalIndirectCosts.toLocaleString()} RWF`);
  console.log(`📊 Cost per meal: ${Math.round(totalCPM)} RWF`);
}

function getWeekNumber(date: Date): number {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });