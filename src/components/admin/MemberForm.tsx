import { useEffect, useRef, useState } from 'react';
import { Camera, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DOMAIN_OPTIONS, initials, validatePhoto, type CrewMember } from '@/lib/crew';
import type { SubsystemId } from '@/data/club';

export interface MemberFormValues {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'user';
  designation: string;
  year: string;
  major: string;
  bio: string;
  domain: SubsystemId | '';
  isLeadership: boolean;
  /** New photo chosen in this form, not yet uploaded. */
  photoFile: File | null;
  /** Edit mode: the admin cleared the existing photo. */
  removePhoto: boolean;
}

export const emptyMemberForm = (): MemberFormValues => ({
  name: '',
  email: '',
  password: '',
  role: 'user',
  designation: '',
  year: '1st Year',
  major: 'Mechanical Engineering',
  bio: '',
  domain: '',
  isLeadership: false,
  photoFile: null,
  removePhoto: false,
});

export const memberToForm = (m: CrewMember, domain: SubsystemId | null): MemberFormValues => ({
  ...emptyMemberForm(),
  name: m.name ?? '',
  email: m.email ?? '',
  designation: m.designation && m.designation !== 'Team Member' ? m.designation : '',
  year: m.year || '1st Year',
  major: m.major || 'Mechanical Engineering',
  bio: m.bio || '',
  domain: domain ?? '',
  isLeadership: m.category === 'leadership',
});

interface MemberFormProps {
  mode: 'add' | 'edit';
  values: MemberFormValues;
  onChange: (values: MemberFormValues) => void;
  onSubmit: () => void;
  submitting: boolean;
  /** Edit mode: the photo currently saved for this member. */
  existingPhotoUrl?: string | null;
  /** False until ADD_MEMBER_DOMAIN_AND_PHOTOS.sql has been run. */
  photosEnabled: boolean;
  /** Admin accounts: offer "Not on Crew page" instead of requiring a domain. */
  allowNoDomain?: boolean;
}

/** Radix Select can't use '' as an item value, so "no domain" gets a sentinel. */
const NO_DOMAIN = 'none';

const MemberForm = ({ mode, values, onChange, onSubmit, submitting, existingPhotoUrl, photosEnabled, allowNoDomain }: MemberFormProps) => {
  const set = <K extends keyof MemberFormValues>(key: K, value: MemberFormValues[K]) => onChange({ ...values, [key]: value });
  const fileInput = useRef<HTMLInputElement>(null);

  // Preview the newly picked file, else the saved photo (unless it's being removed).
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!values.photoFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(values.photoFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [values.photoFile]);
  const shownPhoto = previewUrl ?? (values.removePhoto ? null : existingPhotoUrl ?? null);

  const pickPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const problem = validatePhoto(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    onChange({ ...values, photoFile: file, removePhoto: false });
  };

  const clearPhoto = () => onChange({ ...values, photoFile: null, removePhoto: !!existingPhotoUrl });

  return (
    <div className="space-y-4">
      {/* Photo */}
      <div className="flex items-center gap-4">
        <div className="h-20 w-20 shrink-0 rounded-md border bg-muted overflow-hidden flex items-center justify-center text-xl font-bold text-muted-foreground">
          {shownPhoto ? (
            <img src={shownPhoto} alt="" className="h-full w-full object-cover" />
          ) : (
            initials(values.name || '?')
          )}
        </div>
        <div className="space-y-2 min-w-0">
          <Label>Photo</Label>
          {photosEnabled ? (
            <>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
                  <Camera className="w-4 h-4 mr-2" />
                  {shownPhoto ? 'Change photo' : 'Upload photo'}
                </Button>
                {shownPhoto && (
                  <Button type="button" variant="ghost" size="sm" onClick={clearPhoto} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Square head-and-shoulders shots look best. Shown on the Crew page.</p>
              <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={pickPhoto} />
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Photo uploads need a one-time database update: run ADD_MEMBER_DOMAIN_AND_PHOTOS.sql in Supabase.
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${mode}-memberName`}>Full Name *</Label>
        <Input
          id={`${mode}-memberName`}
          placeholder="John Doe"
          value={values.name}
          onChange={(e) => set('name', e.target.value)}
        />
      </div>

      {mode === 'add' && (
        <>
          <div className="space-y-2">
            <Label htmlFor="add-memberEmail">Email Address (Username) *</Label>
            <Input
              id="add-memberEmail"
              type="email"
              placeholder="john.doe@autoarchitects.com"
              value={values.email}
              onChange={(e) => set('email', e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-memberPassword">Password *</Label>
            <Input
              id="add-memberPassword"
              type="text"
              placeholder="Enter password"
              value={values.password}
              onChange={(e) => set('password', e.target.value)}
            />
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor={`${mode}-memberDomain`}>Domain (Crew section){allowNoDomain ? '' : ' *'}</Label>
          <Select
            value={values.domain || (allowNoDomain ? NO_DOMAIN : '')}
            onValueChange={(v) => set('domain', v === NO_DOMAIN ? '' : (v as SubsystemId))}
          >
            <SelectTrigger id={`${mode}-memberDomain`}>
              <SelectValue placeholder="Pick a sub-team" />
            </SelectTrigger>
            <SelectContent>
              {allowNoDomain && <SelectItem value={NO_DOMAIN}>Not on Crew page</SelectItem>}
              {DOMAIN_OPTIONS.map((d) => (
                <SelectItem key={d.id} value={d.id}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${mode}-memberYear`}>Year *</Label>
          <Select value={values.year} onValueChange={(v) => set('year', v)}>
            <SelectTrigger id={`${mode}-memberYear`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1st Year">1st Year</SelectItem>
              <SelectItem value="2nd Year">2nd Year</SelectItem>
              <SelectItem value="3rd Year">3rd Year</SelectItem>
              <SelectItem value="4th Year">4th Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`${mode}-memberDesignation`}>Designation / Title</Label>
        <Input
          id={`${mode}-memberDesignation`}
          placeholder="e.g. Captain (Transmission). Leave blank to use the domain name."
          value={values.designation}
          onChange={(e) => set('designation', e.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 rounded-md border p-3 cursor-pointer">
        <Checkbox
          checked={values.isLeadership}
          onCheckedChange={(c) => set('isLeadership', c === true)}
          className="mt-0.5"
        />
        <span className="text-sm">
          <span className="font-medium">Leadership</span>
          <span className="block text-xs text-muted-foreground">Captain or vice-captain. Listed under Leadership instead of their domain.</span>
        </span>
      </label>

      <div className="space-y-2">
        <Label htmlFor={`${mode}-memberMajor`}>Major / Department *</Label>
        <Input
          id={`${mode}-memberMajor`}
          placeholder="Mechanical Engineering"
          value={values.major}
          onChange={(e) => set('major', e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${mode}-memberBio`}>Bio / USN</Label>
        <Input
          id={`${mode}-memberBio`}
          placeholder="USN: 1SI22ME000"
          value={values.bio}
          onChange={(e) => set('bio', e.target.value)}
        />
      </div>

      {mode === 'add' && (
        <div className="space-y-2">
          <Label htmlFor="add-memberRole">Auth Role *</Label>
          <Select value={values.role} onValueChange={(v: 'admin' | 'user') => set('role', v)}>
            <SelectTrigger id="add-memberRole">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="user">User (Team Member)</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          {values.role === 'admin' && (
            <p className="text-xs text-muted-foreground">Admin accounts are not listed on the public Crew page.</p>
          )}
        </div>
      )}

      <Button onClick={onSubmit} disabled={submitting} className="w-full energy-gradient mt-2">
        {submitting ? 'Saving…' : mode === 'add' ? 'Add Team Member' : 'Save Changes'}
      </Button>
    </div>
  );
};

export default MemberForm;
