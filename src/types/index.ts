export interface School {
  id: string;
  name: string;
  location: string;
  studentCount: number;
  createdAt: Date;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  category: string;
  createdAt: Date;
}

export interface Purchase {
  id: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantity: number;
  unitPrice: number;
  totalCost: number;
  supplier: string;
  purchaseDate: Date;
  schoolId: string;
  school?: School;
  createdAt: Date;
}

export interface MealProduction {
  id: string;
  schoolId: string;
  school?: School;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  studentsServed: number;
  productionDate: Date;
  ingredients: MealIngredient[];
  directCost: number;
  indirectCost: number;
  totalCost: number;
  costPerMeal: number;
  createdAt: Date;
}

export interface MealIngredient {
  id: string;
  mealProductionId: string;
  ingredientId: string;
  ingredient?: Ingredient;
  quantityUsed: number;
  cost: number;
}

export interface IndirectCost {
  id: string;
  type: 'salary' | 'transport' | 'utilities' | 'maintenance' | 'other';
  description: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  schoolId?: string;
  school?: School;
  effectiveDate: Date;
  createdAt: Date;
}

export interface CostReport {
  period: string;
  schoolId?: string;
  totalMealsServed: number;
  totalDirectCosts: number;
  totalIndirectCosts: number;
  totalCosts: number;
  averageCostPerMeal: number;
  breakdown: {
    ingredients: { [key: string]: number };
    indirectCosts: { [key: string]: number };
  };
}