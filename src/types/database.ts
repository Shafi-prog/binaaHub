// @ts-nocheck
// Database type definitions for Supabase

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description?: string;
          status: string;
          budget?: number;
          start_date?: string;
          end_date?: string;
          user_id: string;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          status?: string;
          budget?: number;
          start_date?: string;
          end_date?: string;
          user_id: string;
          is_active?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          status?: string;
          budget?: number;
          start_date?: string;
          end_date?: string;
          user_id?: string;
          is_active?: boolean;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name?: string;
          account_type?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string;
          account_type?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          account_type?: string;
        };
      };
      expenses: {
        Row: {
          id: string;
          project_id: string;
          amount: number;
          description?: string;
          category?: string;
          receipt_url?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          amount: number;
          description?: string;
          category?: string;
          receipt_url?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          amount?: number;
          description?: string;
          category?: string;
          receipt_url?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}


