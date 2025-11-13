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
      loadRegistrations(); // Reload data
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
      loadRegistrations(); // Reload data
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
      Pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      Approved: 'bg-green-500/10 text-green-700 border-green-500/20',
      Rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
    };
    return variants[status as keyof typeof variants] || '';
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
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="hero-gradient py-12 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-bold text-4xl mb-2">Student Registrations</h1>
                <p className="text-white/90">Manage student registration applications</p>
              </div>
              <Users className="w-16 h-16 text-energy" />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-8 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Applications</p>
                      <p className="text-3xl font-bold text-steel-dark">{stats.total}</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-energy" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                    </div>
                    <Clock className="w-10 h-10 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Approved</p>
                      <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                    </div>
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Rejected</p>
                      <p className="text-3xl font-bold text-red-600">{stats.rejected}</p>
                    </div>
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="font-display text-2xl text-steel-dark">
                    Registration Applications
                  </CardTitle>
                  <Button
                    onClick={exportToCSV}
                    variant="outline"
                    className="border-energy text-energy hover:bg-energy hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search by name, USN, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-80"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="md:w-48">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterRole} onValueChange={setFilterRole}>
                    <SelectTrigger className="md:w-48">
                      <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Roles</SelectItem>
                      {roles.map(role => (
                        <SelectItem key={role} value={role}>{role}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Table */}
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>USN</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-energy"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredRegistrations.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                            No registrations found
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredRegistrations.map((reg) => (
                          <TableRow key={reg.id}>
                            <TableCell className="font-medium">{reg.name}</TableCell>
                            <TableCell>{reg.usn}</TableCell>
                            <TableCell>{reg.email}</TableCell>
                            <TableCell>{reg.phone}</TableCell>
                            <TableCell>{reg.role_interested}</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadge(reg.status)}>
                                <span className="flex items-center gap-1">
                                  {getStatusIcon(reg.status)}
                                  {reg.status}
                                </span>
                              </Badge>
                            </TableCell>
                            <TableCell>{new Date(reg.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDetailDialog(reg)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Select
                                  value={reg.status}
                                  onValueChange={(value: any) => handleStatusUpdate(reg.id, value)}
                                >
                                  <SelectTrigger className="w-32 h-8">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
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
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Registration Details</DialogTitle>
            </DialogHeader>
            {selectedRegistration && (
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="font-medium">{selectedRegistration.name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">USN</Label>
                    <p className="font-medium">{selectedRegistration.usn}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Phone</Label>
                    <p className="font-medium">{selectedRegistration.phone}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Role Interested In</Label>
                    <p className="font-medium">{selectedRegistration.role_interested}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Part of Other Club</Label>
                    <p className="font-medium">{selectedRegistration.part_of_other_club === 'yes' ? 'Yes' : 'No'}</p>
                  </div>
                  {selectedRegistration.part_of_other_club === 'yes' && (
                    <div className="col-span-2">
                      <Label className="text-muted-foreground">Other Club Name</Label>
                      <p className="font-medium">{selectedRegistration.other_club_name || 'N/A'}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Status</Label>
                    <Badge className={getStatusBadge(selectedRegistration.status)}>
                      <span className="flex items-center gap-1">
                        {getStatusIcon(selectedRegistration.status)}
                        {selectedRegistration.status}
                      </span>
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Registration Date</Label>
                    <p className="font-medium">{new Date(selectedRegistration.created_at).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={() => handleStatusUpdate(selectedRegistration.id, 'Approved')}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    onClick={() => handleStatusUpdate(selectedRegistration.id, 'Rejected')}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                  <Button
                    onClick={() => handleDelete(selectedRegistration.id)}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
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

