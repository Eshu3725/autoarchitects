// Student Registration Types

export interface StudentRegistration {
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
}

export interface StudentRegistrationInsert {
  name: string;
  usn: string;
  email: string;
  phone: string;
  role_interested: string;
  part_of_other_club: 'yes' | 'no';
  other_club_name?: string | null;
  status?: 'Pending' | 'Approved' | 'Rejected';
}

export interface StudentRegistrationUpdate {
  status?: 'Pending' | 'Approved' | 'Rejected';
  name?: string;
  usn?: string;
  email?: string;
  phone?: string;
  role_interested?: string;
  part_of_other_club?: 'yes' | 'no';
  other_club_name?: string | null;
}

// Filter and search types
export interface RegistrationFilters {
  status?: 'all' | 'Pending' | 'Approved' | 'Rejected';
  role?: string;
  searchQuery?: string;
}

export interface RegistrationStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

