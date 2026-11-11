import { useState, type FormEvent, type ReactNode } from 'react';
import { ArrowRight, CheckCircle2, Loader2, RotateCcw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/lib/supabase';
import { CLUB, TIERS } from '@/data/club';
import { cn } from '@/lib/utils';
import {
  ENQUIRER_LABELS,
  SUPPORT_LABELS,
  TIER_LABELS,
  type EnquirerType,
  type SponsorEnquiryInsert,
  type SupportType,
  type TierChoice,
} from '@/types/sponsor';

interface Props {
  tier: TierChoice;
  onTierChange: (tier: TierChoice) => void;
}

const EMPTY = {
  enquirerType: 'company' as EnquirerType,
  organisation: '',
  contactName: '',
  designation: '',
  email: '',
  phone: '',
  website: '',
  supportType: 'monetary' as SupportType,
  message: '',
  referredBy: '',
  /** Honeypot: hidden from people, filled in by most bots. */
  fax: '',
};

type Fields = typeof EMPTY;
type Errors = Partial<Record<keyof Fields, string>>;

const fieldClass =
  'h-12 bg-background border-border rounded-sm focus-visible:ring-energy/40 focus-visible:border-energy aria-[invalid=true]:border-destructive';

function Field({
  id,
  label,
  optional,
  error,
  hint,
  className,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 label-mono text-[10px] text-muted-foreground">
        {label}
        {optional && <span className="normal-case tracking-normal font-sans text-[11px]">Optional</span>}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p className="text-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}

function ChoiceGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Record<T, string>;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="label-mono text-[10px] text-muted-foreground mb-2">{label}</legend>
      <div className="flex flex-wrap gap-2" role="radiogroup">
        {(Object.keys(options) as T[]).map((key) => {
          const on = key === value;
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => onChange(key)}
              className={cn(
                'h-10 px-4 border font-display font-bold uppercase tracking-wide text-[15px] transition-colors',
                on
                  ? 'bg-energy border-energy text-white'
                  : 'border-border text-muted-foreground hover:text-foreground hover:border-foreground/40'
              )}
            >
              {options[key]}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

const SponsorEnquiryForm = ({ tier, onTierChange }: Props) => {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [done, setDone] = useState(false);

  const set = (key: keyof Fields, value: string) => {
    setF((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const needsOrg = f.enquirerType === 'company' || f.enquirerType === 'member';
  const isReferral = f.enquirerType === 'member';

  const validate = (): Errors => {
    const e: Errors = {};
    if (!f.contactName.trim()) e.contactName = isReferral ? "Enter the sponsor contact's name" : 'Enter your name';
    if (needsOrg && !f.organisation.trim()) e.organisation = 'Enter the company or organisation';
    if (!f.email.trim()) e.email = 'Enter an email address';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address';
    const digits = f.phone.replace(/[\s\-()]/g, '');
    if (!digits) e.phone = 'Enter a phone number';
    else if (!/^\+?\d{7,15}$/.test(digits)) e.phone = 'Enter a valid phone number, e.g. 98765 43210';
    if (f.website.trim() && !/^(https?:\/\/)?[^\s.]+\.[^\s]{2,}$/i.test(f.website.trim())) e.website = 'Enter a valid website';
    if (isReferral && !f.referredBy.trim()) e.referredBy = 'Enter your name so we know who referred them';
    if (f.message.length > 2000) e.message = 'Keep this under 2000 characters';
    return e;
  };

  const handleSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setSubmitError('');
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      // Focus the first invalid field in page order once the errors have rendered.
      const form = ev.currentTarget as HTMLFormElement;
      requestAnimationFrame(() => form.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus());
      return;
    }
    // Bots fill the hidden field; pretend it worked and store nothing.
    if (f.fax) {
      setDone(true);
      return;
    }

    setIsSubmitting(true);
    const trimOrNull = (s: string) => s.trim() || null;
    const row: SponsorEnquiryInsert = {
      enquirer_type: f.enquirerType,
      organisation: trimOrNull(f.organisation),
      contact_name: f.contactName.trim(),
      designation: trimOrNull(f.designation),
      email: f.email.trim(),
      phone: f.phone.trim(),
      website: trimOrNull(f.website),
      tier,
      support_type: f.supportType,
      message: trimOrNull(f.message),
      referred_by: isReferral ? trimOrNull(f.referredBy) : null,
    };

    const { error } = await supabase.from('sponsor_enquiries').insert([row]);
    setIsSubmitting(false);
    if (error) {
      console.error('Sponsor enquiry failed:', error);
      setSubmitError(`We couldn't send that. Please try again, or email us at ${CLUB.email}.`);
      return;
    }
    setDone(true);
  };

  const reset = () => {
    setF(EMPTY);
    setErrors({});
    onTierChange('undecided');
    setDone(false);
  };

  if (done) {
    return (
      <div className="border border-border bg-card p-8 sm:p-12 text-center" role="status">
        <CheckCircle2 className="w-12 h-12 text-energy mx-auto" />
        <h3 className="mt-6 font-display font-extrabold italic uppercase text-4xl leading-none">Enquiry received</h3>
        <p className="mt-4 text-muted-foreground leading-relaxed max-w-md mx-auto">
          Thank you. Someone from the team will get in touch within a few days with the full brochure and next steps.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 inline-flex items-center gap-2 h-12 px-6 border border-border font-display font-bold uppercase tracking-wide hover:bg-foreground hover:text-background transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Send another
        </button>
      </div>
    );
  }

  const err = (k: keyof Fields) =>
    errors[k] ? { 'aria-invalid': true as const, 'aria-describedby': `sp-${k}-error` } : {};

  return (
    <form onSubmit={handleSubmit} noValidate className="relative border border-border bg-card">
      <div className="flex items-center justify-between px-5 sm:px-8 h-10 border-b border-border bg-muted">
        <span className="label-mono text-[10px] text-muted-foreground">Form SP-01 · Sponsorship enquiry</span>
        <span className="label-mono text-[10px] text-muted-foreground hidden sm:inline">All fields required unless marked</span>
      </div>

      <div className="p-5 sm:p-8 space-y-8">
        {/* Who */}
        <ChoiceGroup label="I am" value={f.enquirerType} options={ENQUIRER_LABELS} onChange={(v) => set('enquirerType', v)} />

        {isReferral && (
          <Field
            id="sp-referredBy"
            label="Your name (team member)"
            error={errors.referredBy}
            hint="Then fill in the sponsor's details below."
          >
            <Input
              id="sp-referredBy"
              value={f.referredBy}
              onChange={(e) => set('referredBy', e.target.value)}
              maxLength={120}
              autoComplete="name"
              className={fieldClass}
              {...err('referredBy')}
            />
          </Field>
        )}

        {/* Contact */}
        <div className="grid sm:grid-cols-2 gap-5">
          <Field
            id="sp-organisation"
            label="Company / organisation"
            optional={!needsOrg}
            error={errors.organisation}
            className="sm:col-span-2"
          >
            <Input
              id="sp-organisation"
              value={f.organisation}
              onChange={(e) => set('organisation', e.target.value)}
              maxLength={200}
              autoComplete="organization"
              className={fieldClass}
              {...err('organisation')}
            />
          </Field>
          <Field id="sp-contactName" label={isReferral ? 'Sponsor contact name' : 'Your name'} error={errors.contactName}>
            <Input
              id="sp-contactName"
              value={f.contactName}
              onChange={(e) => set('contactName', e.target.value)}
              maxLength={120}
              autoComplete={isReferral ? 'off' : 'name'}
              className={fieldClass}
              {...err('contactName')}
            />
          </Field>
          <Field id="sp-designation" label="Designation" optional>
            <Input
              id="sp-designation"
              value={f.designation}
              onChange={(e) => set('designation', e.target.value)}
              maxLength={120}
              autoComplete={isReferral ? 'off' : 'organization-title'}
              className={fieldClass}
            />
          </Field>
          <Field id="sp-email" label="Email" error={errors.email}>
            <Input
              id="sp-email"
              type="email"
              value={f.email}
              onChange={(e) => set('email', e.target.value)}
              maxLength={200}
              autoComplete={isReferral ? 'off' : 'email'}
              className={fieldClass}
              {...err('email')}
            />
          </Field>
          <Field id="sp-phone" label="Phone" error={errors.phone}>
            <Input
              id="sp-phone"
              type="tel"
              value={f.phone}
              onChange={(e) => set('phone', e.target.value)}
              maxLength={20}
              autoComplete={isReferral ? 'off' : 'tel'}
              className={fieldClass}
              {...err('phone')}
            />
          </Field>
          <Field id="sp-website" label="Website" optional error={errors.website} className="sm:col-span-2">
            <Input
              id="sp-website"
              value={f.website}
              onChange={(e) => set('website', e.target.value)}
              maxLength={300}
              placeholder="example.com"
              autoComplete="url"
              className={fieldClass}
              {...err('website')}
            />
          </Field>
        </div>

        {/* What */}
        <div className="grid sm:grid-cols-2 gap-5 items-start">
          <Field id="sp-tier" label="Sponsorship tier">
            <Select value={tier} onValueChange={(v) => onTierChange(v as TierChoice)}>
              <SelectTrigger id="sp-tier" className={fieldClass}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TIERS.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.code} · {t.name} ({t.amount})
                  </SelectItem>
                ))}
                <SelectItem value="undecided">{TIER_LABELS.undecided}</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <ChoiceGroup label="Type of support" value={f.supportType} options={SUPPORT_LABELS} onChange={(v) => set('supportType', v)} />
        </div>

        <Field
          id="sp-message"
          label="What would you like to offer?"
          optional
          error={errors.message}
          hint="Parts, materials, software, services or an amount, and anything else we should know."
        >
          <Textarea
            id="sp-message"
            value={f.message}
            onChange={(e) => set('message', e.target.value)}
            maxLength={2000}
            rows={4}
            className="bg-background border-border rounded-sm focus-visible:ring-energy/40 focus-visible:border-energy"
            {...err('message')}
          />
        </Field>

        {/* Honeypot: off-screen, not focusable, ignored by assistive tech */}
        <div aria-hidden className="absolute -left-[9999px] w-px h-px overflow-hidden">
          <label htmlFor="sp-fax">Fax</label>
          <input id="sp-fax" tabIndex={-1} autoComplete="off" value={f.fax} onChange={(e) => set('fax', e.target.value)} />
        </div>
      </div>

      <div className="px-5 sm:px-8 py-5 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-xs text-muted-foreground max-w-sm">
          We use these details only to contact you about sponsoring {CLUB.name}.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="group h-14 px-8 bg-energy text-white font-display font-bold uppercase tracking-wide text-lg flex items-center justify-center gap-2 hover:bg-energy-dark disabled:opacity-60 transition-colors"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Sending…
            </>
          ) : (
            <>
              Send enquiry <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </>
          )}
        </button>
      </div>
      {submitError && (
        <p role="alert" className="px-5 sm:px-8 pb-5 -mt-1 text-sm text-destructive">
          {submitError}
        </p>
      )}
    </form>
  );
};

export default SponsorEnquiryForm;
