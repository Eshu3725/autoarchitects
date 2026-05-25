import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StudentRegistration } from '@/types/registration';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, CheckCircle, XCircle, Clock, Eye, Download } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';

const StudentRegistrations = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState<StudentRegistration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegistration, setSelectedRegistration] = useState<StudentRegistration | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Available roles
  const roles = [
    'Leadership',
    'Steering',
    'Transmission',
    'Suspension',
    'Brakes',
    'Chassis/CAE',
    'Digital',
    'Graphics',
  ];

  // Load registrations from Supabase
  useEffect(() => {
    loadRegistrations();

    // Set up real-time subscription
    const channel = supabase
      .channel('student_registrations_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'student_registrations' },
        (payload) => {
          console.log('Real-time update:', payload);
          loadRegistrations(); // Reload data when changes occur
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const loadRegistrations = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('student_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading registrations:', error);
        toast.error('Failed to load registrations');
        return;
      }

      setRegistrations(data || []);
    } catch (error) {
      console.error('Error loading registrations:', error);
      toast.error('Failed to load registrations');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: 'Pending' | 'Approved' | 'Rejected') => {
    try {
      const { error } = await supabase
        .from('student_registrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) {
        console.error('Error updating status:', error);
        toast.error('Failed to update status');
        return;
      }

      toast.success(`Status updated to ${newStatus}`);

      // Reload all registrations
      await loadRegistrations();

      // Update the selected registration to show the new status in the dialog
      if (selectedRegistration && selectedRegistration.id === id) {
        setSelectedRegistration({
          ...selectedRegistration,
          status: newStatus
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this registration?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('student_registrations')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting registration:', error);
        toast.error('Failed to delete registration');
        return;
      }

      toast.success('Registration deleted successfully');

      // Close the detail dialog if it's open for this registration
      if (selectedRegistration && selectedRegistration.id === id) {
        setIsDetailDialogOpen(false);
        setSelectedRegistration(null);
      }

      // Reload data to remove the deleted record from the table
      loadRegistrations();
    } catch (error) {
      console.error('Error deleting registration:', error);
      toast.error('Failed to delete registration');
    }
  };

  const openDetailDialog = (registration: StudentRegistration) => {
    setSelectedRegistration(registration);
    setIsDetailDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      Pending: 'badge-modern bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
      Approved: 'badge-modern bg-green-500/10 text-green-400 border-green-500/30',
      Rejected: 'badge-modern bg-red-500/10 text-red-400 border-red-500/30',
    };
    return variants[status as keyof typeof variants] || 'badge-modern';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Rejected':
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // Filter registrations based on search and filters
  const filteredRegistrations = registrations.filter(reg => {
    // Filter by status
    if (filterStatus !== 'all' && reg.status !== filterStatus) {
      return false;
    }

    // Filter by role
    if (filterRole !== 'all' && reg.role_interested !== filterRole) {
      return false;
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        reg.name.toLowerCase().includes(query) ||
        reg.usn.toLowerCase().includes(query) ||
        reg.email.toLowerCase().includes(query) ||
        reg.phone.includes(query)
      );
    }

    return true;
  });

  // Calculate statistics
  const stats = {
    total: registrations.length,
    pending: registrations.filter(r => r.status === 'Pending').length,
    approved: registrations.filter(r => r.status === 'Approved').length,
    rejected: registrations.filter(r => r.status === 'Rejected').length,
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Name', 'USN', 'Email', 'Phone', 'Role', 'Other Club', 'Club Name', 'Status', 'Date'];
    const rows = filteredRegistrations.map(reg => [
      reg.name,
      reg.usn,
      reg.email,
      reg.phone,
      reg.role_interested,
      reg.part_of_other_club,
      reg.other_club_name || 'N/A',
      reg.status,
      new Date(reg.created_at).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student_registrations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  return (
    <Layout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />

        {/* Header */}
        <section className="hero-gradient py-12 text-white relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-energy/10 border border-energy/30 text-energy text-xs font-bold uppercase tracking-widest rounded-md mb-2">
                  Control Panel
                </span>
                <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-2">Student Registrations</h1>
                <p className="text-zinc-300">Manage student registration applications</p>
              </div>
              <Users className="w-12 h-12 text-energy animate-pulse" />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-8 bg-background/50 border-b border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-panel border-white/5 shadow-2xl hover:border-energy/30 hover:scale-[1.01] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Total Applications</p>
                      <p className="text-3xl font-black text-white mt-1">{stats.total}</p>
                    </div>
                    <div className="p-3 bg-energy/10 rounded-xl">
                      <TrendingUp className="w-8 h-8 text-energy" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5 shadow-2xl hover:border-yellow-500/30 hover:scale-[1.01] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Pending</p>
                      <p className="text-3xl font-black text-yellow-400 mt-1">{stats.pending}</p>
                    </div>
                    <div className="p-3 bg-yellow-500/10 rounded-xl">
                      <Clock className="w-8 h-8 text-yellow-400 animate-pulse" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5 shadow-2xl hover:border-green-500/30 hover:scale-[1.01] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Approved</p>
                      <p className="text-3xl font-black text-green-400 mt-1">{stats.approved}</p>
                    </div>
                    <div className="p-3 bg-green-500/10 rounded-xl">
                      <CheckCircle className="w-8 h-8 text-green-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5 shadow-2xl hover:border-red-500/30 hover:scale-[1.01] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Rejected</p>
                      <p className="text-3xl font-black text-red-400 mt-1">{stats.rejected}</p>
                    </div>
                    <div className="p-3 bg-red-500/10 rounded-xl">
                      <XCircle className="w-8 h-8 text-red-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass-panel border-white/5 shadow-2xl">
              <CardHeader className="border-b border-white/5 pb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="font-display font-black text-2xl text-white uppercase tracking-tight">
                    Registration Applications
                  </CardTitle>
                  <Button
                    onClick={exportToCSV}
                    className="border border-energy/50 text-energy bg-energy/5 hover:bg-energy hover:text-white hover:border-energy hover:shadow-glow hover:scale-[1.03] transition-all duration-300 btn-modern px-6"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search by name, USN, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-80 bg-zinc-900/50 border-white/10 text-white placeholder-zinc-500 focus:border-energy focus:ring-energy/20"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="md:w-48 bg-zinc-900/50 border-white/10 text-white">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="md:w-48 bg-zinc-900/50 border-white/10 text-white">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-950 border-white/10 text-white">
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="rounded-xl border border-white/5 overflow-hidden bg-zinc-900/20 backdrop-blur-md shadow-2xl">
                  <Table className="table-modern">
                    <TableHeader className="bg-zinc-950/80">
                      <TableRow className="border-b border-white/5">
                        <TableHead className="text-zinc-400 font-bold">Name</TableHead>
                        <TableHead className="text-zinc-400 font-bold">USN</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Email</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Phone</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Role</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Status</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Date</TableHead>
                        <TableHead className="text-zinc-400 font-bold">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-12">
                            <div className="flex flex-col items-center justify-center gap-3">
                              <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-energy/20"></div>
                                <div className="animate-spin rounded-full h-12 w-12 border-4 border-energy border-t-transparent absolute top-0 left-0"></div>
                              </div>
                              <p className="text-zinc-400 font-medium">Loading registrations...</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredRegistrations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-zinc-500 py-8">
                            No registrations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRegistrations.map((reg) => (
                          <TableRow key={reg.id} className="border-b border-white/5 hover:bg-white/5">
                            <TableCell className="font-bold text-white">{reg.name}</TableCell>
                            <TableCell className="text-zinc-300">{reg.usn}</TableCell>
                            <TableCell className="text-zinc-300">{reg.email}</TableCell>
                            <TableCell className="text-zinc-300">{reg.phone}</TableCell>
                            <TableCell className="text-zinc-300 font-semibold">{reg.role_interested}</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(reg.status)}>
                                <span className="flex items-center gap-1.5 font-bold">
                                  {getStatusIcon(reg.status)}
                                  {reg.status}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell className="text-zinc-400">{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDetailDialog(reg)}
                                  className="border-white/10 hover:bg-zinc-800 text-zinc-300 hover:text-white"
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Select
                                  value={reg.status}
                                  onValueChange={(value: any) => handleStatusUpdate(reg.id, value)}
                                >
                                  <SelectTrigger className="w-32 h-8 bg-zinc-900/50 border-white/10 text-white">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-zinc-950 border-white/10 text-white">
                                    <SelectItem value="Pending">Pending</SelectItem>
                                    <SelectItem value="Approved">Approve</SelectItem>
                                    <SelectItem value="Rejected">Reject</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
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

        {/* Detail Dialog */}
        <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
          <DialogContent className="max-w-2xl bg-zinc-950 border-white/10 text-white">
            <DialogHeader>
              <DialogTitle className="font-display font-black text-2xl text-white uppercase tracking-tight">Registration Details</DialogTitle>
            </DialogHeader>
            {selectedRegistration && (
              <div className="space-y-6 py-4">
                <div className="grid grid-cols-2 gap-6 bg-zinc-900/30 p-6 rounded-xl border border-white/5">
                  <div>
                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Name</Label>
                    <p className="font-bold text-white text-base mt-1">{selectedRegistration.name}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">USN</Label>
                    <p className="font-bold text-white text-base mt-1">{selectedRegistration.usn}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Email</Label>
                    <p className="font-bold text-white text-base mt-1">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Phone</Label>
                    <p className="font-bold text-white text-base mt-1">{selectedRegistration.phone}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Role Interested In</Label>
                    <p className="font-bold text-white text-base mt-1">{selectedRegistration.role_interested}</p>
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Part of Other Club</Label>
                    <p className="font-bold text-white text-base mt-1">{selectedRegistration.part_of_other_club === 'yes' ? 'Yes' : 'No'}</p>
                  </div>
                  {selectedRegistration.part_of_other_club === 'yes' && (
                    <div className="col-span-2">
                      <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Other Club Name</Label>
                      <p className="font-bold text-white text-base mt-1">{selectedRegistration.other_club_name || 'N/A'}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Status</Label>
                    <div className="mt-1">
                      <Badge className={getStatusBadge(selectedRegistration.status)}>
                        <span className="flex items-center gap-1.5 font-bold">
                          {getStatusIcon(selectedRegistration.status)}
                          {selectedRegistration.status}
                        </span>
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-zinc-500 text-xs font-bold uppercase tracking-wider">Registration Date</Label>
                    <p className="font-bold text-white text-base mt-1">{new Date(selectedRegistration.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={() => handleStatusUpdate(selectedRegistration.id, 'Approved')}
                    className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold transition-all duration-300 hover:scale-[1.02]"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedRegistration.id, 'Rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-500 text-white font-bold transition-all duration-300 hover:scale-[1.02]"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedRegistration.id)}
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:scale-[1.02]"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default StudentRegistrations;

