// src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json }

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          account_type: string
          name: string | null
          /* ... الحقول الأخرى في جدول users ... */
        }
        Insert: {
          id?: string
          account_type: string
          name?: string | null
          /* ... */
        }
        Update: {
          id?: string
          account_type?: string
          name?: string | null
          /* ... */
        }
      }
      /* ... بقية جداولك ... */
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    /* ... */
  }
}
