import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'ADMIN' | 'MANAGER' | 'USER';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'ADMIN' | 'MANAGER' | 'USER';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'ADMIN' | 'MANAGER' | 'USER';
          created_at?: string;
        };
      };
      schools: {
        Row: {
          id: string;
          name: string;
          location: string;
          active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          location: string;
          active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          location?: string;
          active?: boolean;
          created_at?: string;
        };
      };
      ingredients: {
        Row: {
          id: string;
          name: string;
          unit: 'KG' | 'LTR' | 'PCS';
          category: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          unit: 'KG' | 'LTR' | 'PCS';
          category: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          unit?: 'KG' | 'LTR' | 'PCS';
          category?: string;
          created_at?: string;
        };
      };
      weeks: {
        Row: {
          id: string;
          month: number;
          year: number;
          week_number: number;
          start_date: string;
          end_date: string;
          meals_served: number;
          ingredient_cost: number;
          cost_per_meal: number;
          overhead_per_meal: number;
          total_cpm: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          month: number;
          year: number;
          week_number: number;
          start_date: string;
          end_date: string;
          meals_served?: number;
          ingredient_cost?: number;
          cost_per_meal?: number;
          overhead_per_meal?: number;
          total_cpm?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          month?: number;
          year?: number;
          week_number?: number;
          start_date?: string;
          end_date?: string;
          meals_served?: number;
          ingredient_cost?: number;
          cost_per_meal?: number;
          overhead_per_meal?: number;
          total_cpm?: number;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          week_id: string;
          ingredient_id: string;
          purchase_date: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          week_id: string;
          ingredient_id: string;
          purchase_date: string;
          quantity: number;
          unit_price: number;
          total_price: number;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          week_id?: string;
          ingredient_id?: string;
          purchase_date?: string;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          created_by?: string;
          created_at?: string;
        };
      };
      productions: {
        Row: {
          id: string;
          week_id: string;
          school_id: string;
          production_date: string;
          starch_kg: number;
          vegetables_kg: number;
          total_kg: number;
          starch_portion_per_kg: number;
          veg_portion_per_kg: number;
          beneficiaries: number;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          week_id: string;
          school_id: string;
          production_date: string;
          starch_kg: number;
          vegetables_kg: number;
          total_kg: number;
          starch_portion_per_kg: number;
          veg_portion_per_kg: number;
          beneficiaries: number;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          week_id?: string;
          school_id?: string;
          production_date?: string;
          starch_kg?: number;
          vegetables_kg?: number;
          total_kg?: number;
          starch_portion_per_kg?: number;
          veg_portion_per_kg?: number;
          beneficiaries?: number;
          created_by?: string;
          created_at?: string;
        };
      };
      indirect_costs: {
        Row: {
          id: string;
          month: number;
          year: number;
          category: 'SALARIES' | 'TRANSPORT' | 'UTILITIES' | 'MAINTENANCE' | 'EQUIPMENT' | 'ADMINISTRATION' | 'OTHER';
          description: string;
          amount: number;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          month: number;
          year: number;
          category: 'SALARIES' | 'TRANSPORT' | 'UTILITIES' | 'MAINTENANCE' | 'EQUIPMENT' | 'ADMINISTRATION' | 'OTHER';
          description: string;
          amount: number;
          created_by: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          month?: number;
          year?: number;
          category?: 'SALARIES' | 'TRANSPORT' | 'UTILITIES' | 'MAINTENANCE' | 'EQUIPMENT' | 'ADMINISTRATION' | 'OTHER';
          description?: string;
          amount?: number;
          created_by?: string;
          created_at?: string;
        };
      };
    };
  };
}