import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Download, Eye, Handshake, Inbox, Mail, MessageSquare, Phone, Sparkles, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { TIERS } from '@/data/club';
import {
  ENQUIRER_LABELS,
  ENQUIRY_STATUSES,
  SUPPORT_LABELS,
  TIER_LABELS,
  type EnquiryStatus,
  type SponsorEnquiry,
} from '@/types/sponsor';

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  New: 'bg-energy/10 text-energy border-energy/40',
  Contacted: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
  'In discussion': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  Confirmed: 'bg-green-500/10 text-green-400 border-green-500/30',
  Declined: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/30',
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const csvCell = (v: string | null | undefined) => `"${(v ?? '').replace(/"/g, '""')}"`;

function Detail({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">{label}</Label>
      <div className="font-semibold text-white mt-1 break-words">{children}</div>
    </div>
  );
}

const SponsorEnquiries = () => {
  const [rows, setRows] = useState<SponsorEnquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | EnquiryStatus>('all');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selected, setSelected] = useState<SponsorEnquiry | null>(null);
  const [notesDraft, setNotesDraft] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from('sponsor_enquiries')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error loading sponsor enquiries:', error);
      setLoadError(
        error.code === '42P01' || /does not exist|schema cache/i.test(error.message)
          ? 'The sponsor_enquiries table does not exist yet. Run CREATE_SPONSOR_ENQUIRIES_TABLE.sql in the Supabase SQL editor.'
          : 'Could not load sponsor enquiries. Check your connection and try again.'
      );
    } else {
      setLoadError('');
      setRows((data as SponsorEnquiry[]) ?? []);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
    const channel = supabase
      .channel('sponsor_enquiries_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'sponsor_enquiries' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const r = payload.new as SponsorEnquiry;
          toast.success(`New sponsor enquiry from ${r.organisation || r.contact_name}`);
        }
        load();
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  // Keep the open dialog in sync with live data
  useEffect(() => {
    if (!selected) return;
    const fresh = rows.find((r) => r.id === selected.id);
    if (!fresh) setSelected(null);
    else if (fresh !== selected) setSelected(fresh);
  }, [rows, selected]);

  const openDetail = (r: SponsorEnquiry) => {
    setSelected(r);
    setNotesDraft(r.admin_notes ?? '');
  };

  const patch = async (id: string, changes: Partial<SponsorEnquiry>) => {
    const { error } = await supabase
      .from('sponsor_enquiries')
      .update({ ...changes, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('Error updating sponsor enquiry:', error);
      toast.error('Update failed');
      return false;
    }
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));
    return true;
  };

  const updateStatus = async (id: string, status: EnquiryStatus) => {
    if (await patch(id, { status })) toast.success(`Marked as ${status}`);
  };

  const saveNotes = async () => {
    if (!selected) return;
    setIsSavingNotes(true);
    if (await patch(selected.id, { admin_notes: notesDraft.trim() || null })) toast.success('Notes saved');
    setIsSavingNotes(false);
  };

  const remove = async (r: SponsorEnquiry) => {
    if (!confirm(`Delete the enquiry from ${r.organisation || r.contact_name}? This can't be undone.`)) return;
    const { error } = await supabase.from('sponsor_enquiries').delete().eq('id', r.id);
    if (error) {
      console.error('Error deleting sponsor enquiry:', error);
      toast.error('Delete failed');
      return;
    }
    setRows((prev) => prev.filter((x) => x.id !== r.id));
    setSelected(null);
    toast.success('Enquiry deleted');
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (tierFilter !== 'all' && r.tier !== tierFilter) return false;
      if (!q) return true;
      return [r.organisation, r.contact_name, r.email, r.phone, r.referred_by]
        .filter(Boolean)
        .some((v) => v!.toLowerCase().includes(q));
    });
  }, [rows, search, statusFilter, tierFilter]);

  const stats = [
    { label: 'Total enquiries', value: rows.length, icon: Inbox, tone: 'text-white', ring: 'bg-energy/10', iconTone: 'text-energy' },
    { label: 'New', value: rows.filter((r) => r.status === 'New').length, icon: Sparkles, tone: 'text-energy', ring: 'bg-energy/10', iconTone: 'text-energy' },
    { label: 'In discussion', value: rows.filter((r) => r.status === 'Contacted' || r.status === 'In discussion').length, icon: MessageSquare, tone: 'text-yellow-400', ring: 'bg-yellow-500/10', iconTone: 'text-yellow-400' },
    { label: 'Confirmed', value: rows.filter((r) => r.status === 'Confirmed').length, icon: Trophy, tone: 'text-green-400', ring: 'bg-green-500/10', iconTone: 'text-green-400' },
  ];

  const exportCSV = () => {
    const headers = ['Date', 'Status', 'Type', 'Organisation', 'Contact', 'Designation', 'Email', 'Phone', 'Website', 'Tier', 'Support', 'Referred by', 'Message', 'Admin notes'];
    const lines = filtered.map((r) =>
      [
        new Date(r.created_at).toISOString().slice(0, 10),
        r.status,
        ENQUIRER_LABELS[r.enquirer_type],
        r.organisation,
        r.contact_name,
        r.designation,
        r.email,
        r.phone,
        r.website,
        TIER_LABELS[r.tier],
        SUPPORT_LABELS[r.support_type],
        r.referred_by,
        r.message,
        r.admin_notes,
      ]
        .map(csvCell)
        .join(',')
    );
    const blob = new Blob(['﻿' + [headers.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sponsor_enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('CSV exported');
  };

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
                <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-2">Sponsor Enquiries</h1>
                <p className="text-zinc-300">Submissions from the sponsorship form on the Sponsors page</p>
              </div>
              <Handshake className="w-12 h-12 text-energy shrink-0" />
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-8 bg-background/50 border-b border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {stats.map(({ label, value, icon: Icon, tone, ring, iconTone }) => (
              <Card key={label} className="glass-panel border-white/5 shadow-2xl">
                <CardContent className="p-5 md:p-6 flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">{label}</p>
                    <p className={`text-3xl font-black mt-1 ${tone}`}>{value}</p>
                  </div>
                  <div className={`p-3 rounded-xl hidden sm:block ${ring}`}>
                    <Icon className={`w-7 h-7 ${iconTone}`} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* List */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass-panel border-white/5 shadow-2xl">
              <CardHeader className="border-b border-white/5 pb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    Enquiries
                  </CardTitle>
                  <Button
                    onClick={exportCSV}
                    disabled={!filtered.length}
                    className="border border-energy/50 text-energy bg-energy/5 hover:bg-energy hover:text-white hover:border-energy transition-all duration-300 btn-modern px-6"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search organisation, name, email or phone…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="md:w-80 bg-zinc-900/50 border-white/10 text-white placeholder-zinc-500 focus:border-energy focus:ring-energy/20"
                  />
                  <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as 'all' | EnquiryStatus)}>
                    <SelectTrigger className="md:w-48 bg-zinc-900/50 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                      <SelectItem value="all">All statuses</SelectItem>
                      {ENQUIRY_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={tierFilter} onValueChange={setTierFilter}>
                    <SelectTrigger className="md:w-48 bg-zinc-900/50 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                      <SelectItem value="all">All tiers</SelectItem>
                      {TIERS.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="undecided">{TIER_LABELS.undecided}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-xl border border-white/5 overflow-x-auto bg-zinc-900/20">
                  <Table className="table-modern min-w-[860px]">
                    <TableHeader className="bg-zinc-950/80">
                      <TableRow className="border-b border-white/5">
                        <TableHead className="text-zinc-400 font-bold">Organisation / contact</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Reach</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Tier</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Support</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Received</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Status</TableHead>
                        <TableHead className="text-zinc-400 font-bold sr-only">Open</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-zinc-400">
                            Loading enquiries…
                          </TableCell>
                        </TableRow>
                      ) : loadError ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-red-400">
                            {loadError}
                          </TableCell>
                        </TableRow>
                      ) : filtered.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-zinc-500">
                            {rows.length ? 'No enquiries match these filters.' : 'No sponsor enquiries yet.'}
                          </TableCell>
                        </TableRow>
                      ) : (
                        filtered.map((r) => (
                          <TableRow key={r.id} className="border-b border-white/5 hover:bg-white/5">
                            <TableCell>
                              <button type="button" onClick={() => openDetail(r)} className="text-left group">
                                <span className="block font-bold text-white group-hover:text-energy transition-colors">
                                  {r.organisation || r.contact_name}
                                </span>
                                <span className="block text-xs text-zinc-400 mt-0.5">
                                  {r.organisation ? r.contact_name : ENQUIRER_LABELS[r.enquirer_type]}
                                  {r.referred_by && <> · via {r.referred_by}</>}
                                </span>
                              </button>
                            </TableCell>
                            <TableCell className="text-zinc-300 text-sm">
                              <a href={`mailto:${r.email}`} className="block hover:text-energy">
                                {r.email}
                              </a>
                              <a href={`tel:${r.phone.replace(/[\s\-()]/g, '')}`} className="block text-zinc-400 hover:text-energy">
                                {r.phone}
                              </a>
                            </TableCell>
                            <TableCell className="text-zinc-300 font-semibold">{TIER_LABELS[r.tier]}</TableCell>
                            <TableCell className="text-zinc-300">{SUPPORT_LABELS[r.support_type]}</TableCell>
                            <TableCell className="text-zinc-400 whitespace-nowrap">{fmtDate(r.created_at)}</TableCell>
                            <TableCell>
                              <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v as EnquiryStatus)}>
                                <SelectTrigger className={`w-36 h-8 border ${STATUS_STYLES[r.status]}`} aria-label="Status">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                  {ENQUIRY_STATUSES.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {s}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => openDetail(r)}
                                aria-label={`Open enquiry from ${r.organisation || r.contact_name}`}
                                className="border-white/10 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Detail */}
        <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-zinc-950 border-white/10 text-white">
            {selected && (
              <>
                <DialogHeader>
                  <DialogTitle className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    {selected.organisation || selected.contact_name}
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    {ENQUIRER_LABELS[selected.enquirer_type]} · received {new Date(selected.created_at).toLocaleString()}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={`badge-modern border ${STATUS_STYLES[selected.status]}`}>{selected.status}</Badge>
                  <Badge className="badge-modern border border-white/10 bg-white/5 text-zinc-200">
                    Tier: {TIER_LABELS[selected.tier]}
                  </Badge>
                  <Badge className="badge-modern border border-white/10 bg-white/5 text-zinc-200">
                    {SUPPORT_LABELS[selected.support_type]}
                  </Badge>
                </div>

                <div className="grid sm:grid-cols-2 gap-5 bg-zinc-900/30 p-5 rounded-xl border border-white/5">
                  <Detail label="Contact">{selected.contact_name}</Detail>
                  <Detail label="Designation">{selected.designation || '—'}</Detail>
                  <Detail label="Email">
                    <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-1.5 hover:text-energy">
                      <Mail className="w-4 h-4 text-energy" />
                      {selected.email}
                    </a>
                  </Detail>
                  <Detail label="Phone">
                    <a
                      href={`tel:${selected.phone.replace(/[\s\-()]/g, '')}`}
                      className="inline-flex items-center gap-1.5 hover:text-energy"
                    >
                      <Phone className="w-4 h-4 text-energy" />
                      {selected.phone}
                    </a>
                  </Detail>
                  <Detail label="Website">
                    {selected.website ? (
                      <a
                        href={/^https?:\/\//i.test(selected.website) ? selected.website : `https://${selected.website}`}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="hover:text-energy underline underline-offset-2"
                      >
                        {selected.website}
                      </a>
                    ) : (
                      '—'
                    )}
                  </Detail>
                  <Detail label="Referred by">{selected.referred_by || '—'}</Detail>
                  <Detail label="Their message" wide>
                    <p className="font-normal text-zinc-200 whitespace-pre-wrap">{selected.message || '—'}</p>
                  </Detail>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enquiry-status" className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Status
                  </Label>
                  <Select value={selected.status} onValueChange={(v) => updateStatus(selected.id, v as EnquiryStatus)}>
                    <SelectTrigger id="enquiry-status" className="bg-zinc-900/50 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                      {ENQUIRY_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enquiry-notes" className="text-zinc-500 text-xs font-bold uppercase tracking-wider">
                    Team notes (internal)
                  </Label>
                  <Textarea
                    id="enquiry-notes"
                    value={notesDraft}
                    onChange={(e) => setNotesDraft(e.target.value)}
                    maxLength={4000}
                    rows={4}
                    placeholder="Who's following up, what was agreed, next call…"
                    className="bg-zinc-900/50 border-white/10 text-white placeholder-zinc-500"
                  />
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => remove(selected)}
                    className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white"
                  >
                    Delete
                  </Button>
                  <Button
                    onClick={saveNotes}
                    disabled={isSavingNotes || notesDraft.trim() === (selected.admin_notes ?? '')}
                    className="flex-1 bg-energy hover:bg-energy-dark text-white font-bold"
                  >
                    {isSavingNotes ? 'Saving…' : 'Save notes'}
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default SponsorEnquiries;
