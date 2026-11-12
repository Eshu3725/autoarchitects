import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowUp, Edit, ExternalLink, ImagePlus, Plus, Trash2, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import SponsorMarquee, { SponsorLogoTile } from '@/components/SponsorMarquee';
import { supabase } from '@/lib/supabase';
import { processLogo, type ProcessedLogo } from '@/lib/logoImage';
import {
  SPONSOR_TIERS,
  deleteAllSponsorLogos,
  deleteSponsorLogo,
  fetchSponsors,
  isMissingTable,
  normalizeWebsite,
  sortSponsors,
  tierLabel,
  uploadSponsorLogo,
  validateLogo,
  type Sponsor,
  type SponsorTier,
} from '@/lib/sponsors';

interface FormState {
  name: string;
  tier: SponsorTier;
  website: string;
  since: string;
  is_visible: boolean;
  /** New logo picked in the dialog, not yet uploaded. */
  logoFile: File | null;
  /** Editing: the admin cleared the saved logo. */
  removeLogo: boolean;
  /** Make a plain white/light background transparent before upload. */
  removeBackground: boolean;
}

const emptyForm = (): FormState => ({
  name: '',
  tier: 'associate',
  website: '',
  since: '',
  is_visible: true,
  logoFile: null,
  removeLogo: false,
  removeBackground: true,
});

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
};

const ManageSponsors = () => {
  const [rows, setRows] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Sponsor | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [isSaving, setIsSaving] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const { data, error } = await fetchSponsors({ visibleOnly: false });
    if (error) {
      console.error('Error loading sponsors:', error);
      setLoadError(
        isMissingTable(error)
          ? 'The sponsors table does not exist yet. Run CREATE_SPONSORS_TABLE.sql in the Supabase SQL editor.'
          : 'Could not load sponsors. Check your connection and try again.'
      );
    } else {
      setLoadError('');
      setRows(data);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Clean up the picked logo (background removal + trim) as soon as it's chosen,
  // so the preview shows exactly what will be uploaded.
  const [processed, setProcessed] = useState<(ProcessedLogo & { url: string }) | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  useEffect(() => {
    if (!form.logoFile) {
      setProcessed(null);
      return;
    }
    let cancelled = false;
    let url: string | null = null;
    setIsProcessing(true);
    processLogo(form.logoFile, { removeBackground: form.removeBackground })
      .then((result) => {
        if (cancelled) return;
        url = URL.createObjectURL(result.blob);
        setProcessed({ ...result, url });
      })
      .catch((err) => {
        if (cancelled) return;
        console.error('Error processing logo:', err);
        toast.error((err as Error).message);
        setForm((f) => ({ ...f, logoFile: null }));
      })
      .finally(() => !cancelled && setIsProcessing(false));
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [form.logoFile, form.removeBackground]);
  const shownLogo = processed?.url ?? (form.removeLogo ? null : editing?.logo_url ?? null);
  const newLogo = form.logoFile ? processed?.blob ?? null : null;

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (s: Sponsor) => {
    setEditing(s);
    setForm({
      name: s.name,
      tier: s.tier,
      website: s.website ?? '',
      since: s.since ?? '',
      is_visible: s.is_visible,
      logoFile: null,
      removeLogo: false,
      removeBackground: true,
    });
    setDialogOpen(true);
  };

  const pickLogo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    const problem = validateLogo(file);
    if (problem) {
      toast.error(problem);
      return;
    }
    setForm((f) => ({ ...f, logoFile: file, removeLogo: false, removeBackground: true }));
  };

  const save = async () => {
    const name = form.name.trim();
    if (!name) {
      toast.error('Sponsor name is required');
      return;
    }
    let website: string | null;
    try {
      website = normalizeWebsite(form.website);
    } catch (err) {
      toast.error((err as Error).message);
      return;
    }
    const row = { name, tier: form.tier, website, since: form.since.trim() || null, is_visible: form.is_visible };

    setIsSaving(true);
    try {
      if (!editing) {
        const nextOrder = rows.reduce((m, r) => Math.max(m, r.display_order), 0) + 1;
        const { data, error } = await supabase
          .from('sponsors')
          .insert({ ...row, display_order: nextOrder })
          .select('id')
          .single();
        if (error) throw new Error(error.message);

        // Logos are stored under the sponsor's id, so they go up after the insert.
        if (newLogo && data?.id) {
          try {
            const logoUrl = await uploadSponsorLogo(data.id, newLogo);
            const { error: logoError } = await supabase.from('sponsors').update({ logo_url: logoUrl }).eq('id', data.id);
            if (logoError) throw new Error(logoError.message);
          } catch (logoErr) {
            console.error('Error uploading sponsor logo:', logoErr);
            toast.warning(`"${name}" was added, but the logo upload failed. Edit the sponsor to try again.`);
          }
        }
        toast.success(`"${name}" added`);
      } else {
        const update: Record<string, unknown> = { ...row, updated_at: new Date().toISOString() };
        if (newLogo) update.logo_url = await uploadSponsorLogo(editing.id, newLogo);
        else if (form.removeLogo) update.logo_url = null;

        const { error } = await supabase.from('sponsors').update(update).eq('id', editing.id);
        if (error) {
          // Don't leave an orphaned upload behind if the row didn't save.
          if (newLogo) await deleteSponsorLogo(update.logo_url as string);
          throw new Error(error.message);
        }
        // Remove the replaced/cleared logo only once the row points elsewhere.
        if ('logo_url' in update && editing.logo_url && editing.logo_url !== update.logo_url) {
          await deleteSponsorLogo(editing.logo_url);
        }
        toast.success(`"${name}" updated`);
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      console.error('Error saving sponsor:', err);
      toast.error(`Could not save sponsor: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleVisible = async (s: Sponsor, is_visible: boolean) => {
    setRows((prev) => prev.map((r) => (r.id === s.id ? { ...r, is_visible } : r)));
    const { error } = await supabase
      .from('sponsors')
      .update({ is_visible, updated_at: new Date().toISOString() })
      .eq('id', s.id);
    if (error) {
      console.error('Error updating sponsor:', error);
      toast.error('Update failed');
      load();
      return;
    }
    toast.success(is_visible ? `"${s.name}" is shown on the Sponsors page` : `"${s.name}" is hidden`);
  };

  /** Move a sponsor up/down within its tier, renumbering that tier so the order is always unambiguous. */
  const move = async (s: Sponsor, dir: -1 | 1) => {
    const tierRows = rows.filter((r) => r.tier === s.tier);
    const i = tierRows.findIndex((r) => r.id === s.id);
    const j = i + dir;
    if (j < 0 || j >= tierRows.length) return;
    const reordered = [...tierRows];
    [reordered[i], reordered[j]] = [reordered[j], reordered[i]];

    const base = Math.min(...tierRows.map((r) => r.display_order));
    const changes = reordered
      .map((r, k) => ({ id: r.id, display_order: base + k, prev: r.display_order }))
      .filter((c) => c.display_order !== c.prev);

    const orderById = new Map(changes.map((c) => [c.id, c.display_order]));
    setRows((prev) => sortSponsors(prev.map((r) => (orderById.has(r.id) ? { ...r, display_order: orderById.get(r.id)! } : r))));

    const results = await Promise.all(
      changes.map((c) => supabase.from('sponsors').update({ display_order: c.display_order }).eq('id', c.id))
    );
    if (results.some((r) => r.error)) {
      console.error('Error reordering sponsors:', results.map((r) => r.error).filter(Boolean));
      toast.error('Could not save the new order');
      load();
    }
  };

  const remove = async (s: Sponsor) => {
    if (!confirm(`Remove "${s.name}" from the Sponsors page? This deletes the sponsor and their logo.`)) return;
    const { error } = await supabase.from('sponsors').delete().eq('id', s.id);
    if (error) {
      console.error('Error deleting sponsor:', error);
      toast.error('Delete failed');
      return;
    }
    await deleteAllSponsorLogos(s.id);
    setRows((prev) => prev.filter((r) => r.id !== s.id));
    toast.success(`"${s.name}" removed`);
  };

  const visible = rows.filter((r) => r.is_visible);

  return (
    <Layout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />

        {/* Header */}
        <section className="hero-gradient py-12 text-white relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              to="/admin/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4" /> Admin dashboard
            </Link>
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="inline-block px-3 py-1 bg-energy/10 border border-energy/30 text-energy text-xs font-bold uppercase tracking-widest rounded-md mb-2">
                  Control Panel
                </span>
                <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-2">Sponsors &amp; Logos</h1>
                <p className="text-zinc-300">
                  Sponsors listed here scroll across the{' '}
                  <Link to="/sponsors" className="text-energy hover:underline">
                    Sponsors page
                  </Link>
                </p>
              </div>
              <Trophy className="w-12 h-12 text-energy shrink-0" />
            </div>
          </div>
        </section>

        {/* Live preview */}
        {visible.length > 0 && (
          <section className="py-8 border-b border-white/5 relative z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
              <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Live preview · {visible.length} shown
              </h2>
            </div>
            <SponsorMarquee sponsors={visible} />
          </section>
        )}

        {/* List */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass-panel border-white/5 shadow-2xl">
              <CardHeader className="border-b border-white/5 pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <CardTitle className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    Sponsors <span className="text-zinc-500">({rows.length})</span>
                  </CardTitle>
                  <Button onClick={openAdd} disabled={!!loadError} className="energy-gradient px-6">
                    <Plus className="w-4 h-4 mr-2" />
                    Add sponsor
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <p className="text-center text-zinc-500 py-10">Loading sponsors…</p>
                ) : loadError ? (
                  <p className="text-center text-amber-400 py-10">{loadError}</p>
                ) : rows.length === 0 ? (
                  <p className="text-center text-zinc-500 py-10">No sponsors yet. Add the first one.</p>
                ) : (
                  <ul className="space-y-3">
                    {rows.map((s) => {
                      const tierRows = rows.filter((r) => r.tier === s.tier);
                      const pos = tierRows.findIndex((r) => r.id === s.id);
                      return (
                        <li
                          key={s.id}
                          className={`flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 p-3 rounded-lg border border-white/5 bg-background/60 ${
                            s.is_visible ? '' : 'opacity-60'
                          }`}
                        >
                          <div className="flex flex-col">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={pos === 0}
                              onClick={() => move(s, -1)}
                              aria-label={`Move ${s.name} up`}
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              disabled={pos === tierRows.length - 1}
                              onClick={() => move(s, 1)}
                              aria-label={`Move ${s.name} down`}
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </Button>
                          </div>

                          <SponsorLogoTile sponsor={{ ...s, website: null }} className="h-14 w-28 p-2 shrink-0 [&_span]:text-xs" />

                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-white truncate">{s.name}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1">
                              <Badge variant="outline" className="border-energy/40 text-energy text-[10px]">
                                {tierLabel(s.tier)}
                              </Badge>
                              {s.since && <span className="text-xs text-zinc-500">{s.since}</span>}
                              {!s.logo_url && <span className="text-xs text-amber-400">No logo yet</span>}
                              {s.website && (
                                <a
                                  href={s.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-zinc-400 hover:text-white inline-flex items-center gap-1 truncate max-w-[14rem]"
                                >
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                  {hostOf(s.website)}
                                </a>
                              )}
                            </div>
                          </div>

                          <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                            <Switch checked={s.is_visible} onCheckedChange={(v) => toggleVisible(s, v)} />
                            {s.is_visible ? 'Shown' : 'Hidden'}
                          </label>
                          <Button variant="ghost" size="sm" onClick={() => openEdit(s)} aria-label={`Edit ${s.name}`}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(s)}
                            aria-label={`Delete ${s.name}`}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Add / edit */}
        <Dialog open={dialogOpen} onOpenChange={(o) => !isSaving && setDialogOpen(o)}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? 'Edit sponsor' : 'Add sponsor'}</DialogTitle>
              <DialogDescription>Shown on the Sponsors page in the scrolling logo strip and under its tier.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Logo */}
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  <SponsorLogoTile
                    sponsor={{ name: form.name || 'Logo', logo_url: shownLogo, website: null }}
                    className="h-20 w-40 shrink-0 [&_span]:text-sm"
                  />
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => fileInput.current?.click()}>
                        <ImagePlus className="w-4 h-4 mr-2" />
                        {shownLogo ? 'Change logo' : 'Upload logo'}
                      </Button>
                      {shownLogo && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => setForm((f) => ({ ...f, logoFile: null, removeLogo: !!editing?.logo_url }))}
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {isProcessing
                        ? 'Cleaning up the logo…'
                        : form.logoFile && processed
                          ? processed.backgroundRemoved
                            ? 'Background removed and margins trimmed. This is how it will look on the site.'
                            : form.removeBackground
                              ? 'No plain light background found, so the logo is kept as is (margins trimmed).'
                              : 'Original background kept.'
                          : 'Any PNG, JPG or SVG. A plain white background is removed automatically. Without a logo, the name is shown instead.'}
                    </p>
                  </div>
                </div>
                {form.logoFile && (
                  <label className="flex items-center justify-between gap-3 rounded-md border p-3 cursor-pointer">
                    <span className="text-sm">
                      <span className="font-medium">Remove white background</span>
                      <span className="block text-xs text-muted-foreground">
                        Turn off if the clean-up cuts into the logo itself.
                      </span>
                    </span>
                    <Switch
                      checked={form.removeBackground}
                      onCheckedChange={(v) => setForm((f) => ({ ...f, removeBackground: v }))}
                    />
                  </label>
                )}
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                  className="hidden"
                  onChange={pickLogo}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsorName">Sponsor name *</Label>
                <Input
                  id="sponsorName"
                  placeholder="Acme Engineering Pvt Ltd"
                  maxLength={120}
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sponsorTier">Tier *</Label>
                  <Select value={form.tier} onValueChange={(v: SponsorTier) => setForm((f) => ({ ...f, tier: v }))}>
                    <SelectTrigger id="sponsorTier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPONSOR_TIERS.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsorSince">Season(s)</Label>
                  <Input
                    id="sponsorSince"
                    placeholder="e.g. 2025"
                    maxLength={40}
                    value={form.since}
                    onChange={(e) => setForm((f) => ({ ...f, since: e.target.value }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsorWebsite">Website</Label>
                <Input
                  id="sponsorWebsite"
                  placeholder="acme.com"
                  maxLength={300}
                  value={form.website}
                  onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                />
              </div>

              <label className="flex items-center justify-between gap-3 rounded-md border p-3 cursor-pointer">
                <span className="text-sm">
                  <span className="font-medium">Show on Sponsors page</span>
                  <span className="block text-xs text-muted-foreground">Turn off to keep a past sponsor on file without listing them.</span>
                </span>
                <Switch checked={form.is_visible} onCheckedChange={(v) => setForm((f) => ({ ...f, is_visible: v }))} />
              </label>

              <Button onClick={save} disabled={isSaving || isProcessing} className="w-full energy-gradient">
                {isSaving ? 'Saving…' : editing ? 'Save changes' : 'Add sponsor'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default ManageSponsors;
