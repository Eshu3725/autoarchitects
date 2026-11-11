import { TIERS, type TierId } from '@/data/club';

export type EnquirerType = 'company' | 'individual' | 'alumni' | 'member';
export type SupportType = 'monetary' | 'in_kind' | 'both';
export type TierChoice = TierId | 'undecided';
export type EnquiryStatus = 'New' | 'Contacted' | 'In discussion' | 'Confirmed' | 'Declined';

/** A row of public.sponsor_enquiries (see CREATE_SPONSOR_ENQUIRIES_TABLE.sql). */
export interface SponsorEnquiry {
  id: string;
  enquirer_type: EnquirerType;
  organisation: string | null;
  contact_name: string;
  designation: string | null;
  email: string;
  phone: string;
  website: string | null;
  tier: TierChoice;
  support_type: SupportType;
  message: string | null;
  referred_by: string | null;
  status: EnquiryStatus;
  admin_notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export type SponsorEnquiryInsert = Omit<SponsorEnquiry, 'id' | 'status' | 'admin_notes' | 'created_at' | 'updated_at'>;

export const ENQUIRER_LABELS: Record<EnquirerType, string> = {
  company: 'Company / organisation',
  individual: 'Individual',
  alumni: 'Alumni',
  member: 'Team member referring a sponsor',
};

export const SUPPORT_LABELS: Record<SupportType, string> = {
  monetary: 'Monetary',
  in_kind: 'In kind',
  both: 'Both',
};

export const TIER_LABELS = {
  ...Object.fromEntries(TIERS.map((t) => [t.id, t.name])),
  undecided: 'Not sure yet',
} as Record<TierChoice, string>;

export const ENQUIRY_STATUSES: EnquiryStatus[] = ['New', 'Contacted', 'In discussion', 'Confirmed', 'Declined'];
