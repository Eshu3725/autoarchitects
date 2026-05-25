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
          designation?: string;
          year?: string;
          major?: string;
          bio?: string;
          category?: 'leadership' | 'technical' | 'operations';
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role: 'admin' | 'user';
          created_at?: string;
          designation?: string;
          year?: string;
          major?: string;
          bio?: string;
          category?: 'leadership' | 'technical' | 'operations';
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'user';
          created_at?: string;
          designation?: string;
          year?: string;
          major?: string;
          bio?: string;
          category?: 'leadership' | 'technical' | 'operations';
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
      student_registrations: {
        Row: {
          id: string;
          name: string;
          usn: string;
          email: string;
          phone: string;
          role_interested: string;
          part_of_other_club: 'yes' | 'no';
          other_club_name: string | null;
          created_at: string;
          status: 'Pending' | 'Approved' | 'Rejected';
        };
        Insert: {
          id?: string;
          name: string;
          usn: string;
          email: string;
          phone: string;
          role_interested: string;
          part_of_other_club: 'yes' | 'no';
          other_club_name?: string | null;
          created_at?: string;
          status?: 'Pending' | 'Approved' | 'Rejected';
        };
        Update: {
          id?: string;
          name?: string;
          usn?: string;
          email?: string;
          phone?: string;
          role_interested?: string;
          part_of_other_club?: 'yes' | 'no';
          other_club_name?: string | null;
          created_at?: string;
          status?: 'Pending' | 'Approved' | 'Rejected';
        };
      };
      leave_requests: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          date: string;
          reason: string;
          status: 'Pending' | 'Approved' | 'Rejected';
          created_at: string;
          reviewed_by: string | null;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_name: string;
          date: string;
          reason: string;
          status?: 'Pending' | 'Approved' | 'Rejected';
          created_at?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          date?: string;
          reason?: string;
          status?: 'Pending' | 'Approved' | 'Rejected';
          created_at?: string;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
        };
      };
      notices: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          file_name: string | null;
          file_type: string | null;
          file_data: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          file_name?: string | null;
          file_type?: string | null;
          file_data?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          file_name?: string | null;
          file_type?: string | null;
          file_data?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
      };
    };
  };
}

