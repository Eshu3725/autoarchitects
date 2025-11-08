import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://sawvlnfvcnotntgwieiz.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhd3ZsbmZ2Y25vdG50Z3dpZWl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1ODExODcsImV4cCI6MjA3ODE1NzE4N30.Tnbmfn0bRE8gVEq6GCe0kv7vwn4L5RmbQEQewB3_QRQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'user';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'admin' | 'user';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'user';
          created_at?: string;
        };
      };
      attendance_records: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'leave';
          check_in_time: string | null;
          check_out_time: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_name: string;
          date: string;
          status: 'present' | 'absent' | 'late' | 'leave';
          check_in_time?: string | null;
          check_out_time?: string | null;
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          date?: string;
          status?: 'present' | 'absent' | 'late' | 'leave';
          check_in_time?: string | null;
          check_out_time?: string | null;
          notes?: string | null;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

