import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { AttendanceRecord } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Plus, Edit, Users, ClipboardList, TrendingUp, UserPlus, ChevronDown, ChevronRight } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [teamMembers, setTeamMembers] = useState<Array<{ id: string; name: string; email: string }>>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formData, setFormData] = useState({
    userId: '',
    userName: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present' as 'present' | 'absent' | 'late' | 'leave',
    checkInTime: '',
    checkOutTime: '',
    notes: ''
  });

  // Load team members and attendance records from Supabase
  useEffect(() => {
    loadTeamMembers();
    loadAttendanceRecords();
  }, []);

  const loadTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email')
        .eq('role', 'user')
        .order('name');

      if (error) {
        console.error('Error loading team members:', error);
        toast.error('Failed to load team members');
        return;
      }

      setTeamMembers(data || []);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast.error('Failed to load team members');
    }
  };

  const loadAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading attendance records:', error);
        toast.error('Failed to load attendance records');
        return;
      }

      // Transform Supabase data to match our AttendanceRecord type
      const transformedData: AttendanceRecord[] = (data || []).map(record => ({
        id: record.id,
        userId: record.user_id,
        userName: record.user_name,
        date: record.date,
        status: record.status,
        checkInTime: record.check_in_time,
        checkOutTime: record.check_out_time,
        notes: record.notes,
        createdBy: record.created_by,
        updatedAt: record.updated_at
      }));

      setAttendanceRecords(transformedData);
    } catch (error) {
      console.error('Error loading attendance records:', error);
      toast.error('Failed to load attendance records');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAttendance = async () => {
    if (!formData.userId || !formData.date) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedMember = teamMembers.find(m => m.id === formData.userId);
    if (!selectedMember) return;

    try {
      const { data, error } = await supabase
        .from('attendance_records')
        .insert([
          {
            user_id: formData.userId,
            user_name: selectedMember.name,
            date: formData.date,
            status: formData.status,
            check_in_time: formData.checkInTime || null,
            check_out_time: formData.checkOutTime || null,
            notes: formData.notes || null,
            created_by: user?.id || ''
          }
        ])
        .select();

      if (error) {
        console.error('Error adding attendance:', error);
        toast.error('Failed to add attendance record');
        return;
      }

      setIsAddDialogOpen(false);
      resetForm();
      toast.success('Attendance record added successfully');
      loadAttendanceRecords(); // Reload records
    } catch (error) {
      console.error('Error adding attendance:', error);
      toast.error('Failed to add attendance record');
    }
  };

  const handleEditAttendance = async () => {
    if (!selectedRecord) return;

    try {
      const { error } = await supabase
        .from('attendance_records')
        .update({
          status: formData.status,
          check_in_time: formData.checkInTime || null,
          check_out_time: formData.checkOutTime || null,
          notes: formData.notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedRecord.id);

      if (error) {
        console.error('Error updating attendance:', error);
        toast.error('Failed to update attendance record');
        return;
      }

      setIsEditDialogOpen(false);
      setSelectedRecord(null);
      resetForm();
      toast.success('Attendance record updated successfully');
      loadAttendanceRecords(); // Reload records
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error('Failed to update attendance record');
    }
  };

  const openEditDialog = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setFormData({
      userId: record.userId,
      userName: record.userName,
      date: record.date,
      status: record.status,
      checkInTime: record.checkInTime || '',
      checkOutTime: record.checkOutTime || '',
      notes: record.notes || ''
    });
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      userId: '',
      userName: '',
      date: new Date().toISOString().split('T')[0],
      status: 'present',
      checkInTime: '',
      checkOutTime: '',
      notes: ''
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'bg-green-500/10 text-green-700 border-green-500/20',
      absent: 'bg-red-500/10 text-red-700 border-red-500/20',
      late: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      leave: 'bg-blue-500/10 text-blue-700 border-blue-500/20'
    };
    return variants[status as keyof typeof variants] || '';
  };

  // Filter records
  const filteredRecords = attendanceRecords
    .filter(record => {
      const matchesStatus = filterStatus === 'all' || record.status === filterStatus;
      const matchesSearch = record.userName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      // Sort by date in descending order (most recent first)
      // Date format is 'YYYY-MM-DD', so string comparison works correctly
      return b.date.localeCompare(a.date);
    });

  // Group records by date
  const groupedByDate = filteredRecords.reduce((groups, record) => {
    const date = record.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(record);
    return groups;
  }, {} as Record<string, AttendanceRecord[]>);

  // Get sorted dates (most recent first)
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => b.localeCompare(a));

  // Calculate statistics per date
  const getDateStats = (records: AttendanceRecord[]) => {
    return {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      leave: records.filter(r => r.status === 'leave').length,
    };
  };

  // Format date for display
  const formatDateHeader = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00'); // Add time to avoid timezone issues
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Calculate statistics
  const stats = {
    totalRecords: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length
  };

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="hero-gradient py-12 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-bold text-4xl mb-2">Admin Dashboard</h1>
                <p className="text-white/90">Welcome back, {user?.name}</p>
              </div>
              <ClipboardList className="w-16 h-16 text-energy" />
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="py-6 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold text-steel-dark mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className="border-0 shadow-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/admin/registrations')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Student Registrations</p>
                      <p className="text-lg font-semibold text-steel-dark">View & Manage Applications</p>
                    </div>
                    <UserPlus className="w-10 h-10 text-energy" />
                  </div>
                </CardContent>
              </Card>
              <Card
                className="border-0 shadow-card cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate('/admin/bulk-attendance')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Bulk Attendance</p>
                      <p className="text-lg font-semibold text-steel-dark">Mark by Date (Recommended)</p>
                    </div>
                    <Users className="w-10 h-10 text-energy" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Individual Records</p>
                      <p className="text-lg font-semibold text-steel-dark">Current Page</p>
                    </div>
                    <ClipboardList className="w-10 h-10 text-steel" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-8 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-lg font-semibold text-steel-dark mb-4">Attendance Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Records</p>
                      <p className="text-3xl font-bold text-steel-dark">{stats.totalRecords}</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-energy" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Present</p>
                      <p className="text-3xl font-bold text-green-600">{stats.present}</p>
                    </div>
                    <Users className="w-10 h-10 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Absent</p>
                      <p className="text-3xl font-bold text-red-600">{stats.absent}</p>
                    </div>
                    <Users className="w-10 h-10 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Late</p>
                      <p className="text-3xl font-bold text-yellow-600">{stats.late}</p>
                    </div>
                    <Calendar className="w-10 h-10 text-yellow-600" />
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
                    Attendance Records
                  </CardTitle>
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="energy-gradient hover-glow" onClick={resetForm}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Attendance
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Add Attendance Record</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Team Member *</Label>
                          <Select value={formData.userId} onValueChange={(value) => setFormData({ ...formData, userId: value })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select member" />
                            </SelectTrigger>
                            <SelectContent>
                              {teamMembers.map(member => (
                                <SelectItem key={member.id} value={member.id}>
                                  {member.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Date *</Label>
                          <Input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Status *</Label>
                          <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="present">Present</SelectItem>
                              <SelectItem value="absent">Absent</SelectItem>
                              <SelectItem value="late">Late</SelectItem>
                              <SelectItem value="leave">Leave</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Check In</Label>
                            <Input
                              type="time"
                              value={formData.checkInTime}
                              onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Check Out</Label>
                            <Input
                              type="time"
                              value={formData.checkOutTime}
                              onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label>Notes</Label>
                          <Textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Add any notes..."
                          />
                        </div>
                        <Button onClick={handleAddAttendance} className="w-full energy-gradient">
                          Add Record
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <Input
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="md:w-64"
                  />
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="leave">Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date-Based Sections */}
                {filteredRecords.length === 0 ? (
                  <div className="text-center text-muted-foreground py-12 border rounded-lg bg-muted/30">
                    <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p className="text-lg font-medium">No attendance records found</p>
                    <p className="text-sm mt-2">Try adjusting your filters or add new attendance records</p>
                  </div>
                ) : (
                  <Accordion type="multiple" className="space-y-4">
                    {sortedDates.map((date) => {
                      const dateRecords = groupedByDate[date];
                      const dateStats = getDateStats(dateRecords);

                      return (
                        <AccordionItem
                          key={date}
                          value={date}
                          className="border-0 shadow-card rounded-lg overflow-hidden"
                        >
                          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-muted/50 transition-colors">
                            <div className="flex items-center justify-between w-full pr-4">
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 energy-gradient rounded-lg flex items-center justify-center shadow-glow">
                                  <Calendar className="w-6 h-6 text-white" />
                                </div>
                                <div className="text-left">
                                  <h3 className="font-display font-bold text-lg text-steel-dark">
                                    {formatDateHeader(date)}
                                  </h3>
                                  <p className="text-sm text-muted-foreground mt-1">
                                    {dateStats.total} members:
                                    <span className="text-green-600 font-medium ml-2">{dateStats.present} present</span>
                                    {dateStats.absent > 0 && <span className="text-red-600 font-medium ml-2">{dateStats.absent} absent</span>}
                                    {dateStats.late > 0 && <span className="text-yellow-600 font-medium ml-2">{dateStats.late} late</span>}
                                    {dateStats.leave > 0 && <span className="text-blue-600 font-medium ml-2">{dateStats.leave} on leave</span>}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <div className="space-y-2 mt-2">
                              {dateRecords.map((record) => (
                                <div
                                  key={record.id}
                                  className="flex items-center justify-between p-4 rounded-lg border bg-background hover:bg-muted/30 transition-colors"
                                >
                                  <div className="flex items-center gap-4 flex-1">
                                    <div className="flex-1">
                                      <p className="font-medium text-steel-dark">{record.userName}</p>
                                      <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                          <Badge className={getStatusBadge(record.status)}>
                                            {record.status}
                                          </Badge>
                                        </span>
                                        {record.checkInTime && (
                                          <span>In: {record.checkInTime}</span>
                                        )}
                                        {record.checkOutTime && (
                                          <span>Out: {record.checkOutTime}</span>
                                        )}
                                      </div>
                                      {record.notes && (
                                        <p className="text-sm text-muted-foreground mt-2 italic">
                                          {record.notes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditDialog(record)}
                                    className="ml-4"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Attendance Record</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Team Member</Label>
                <Input value={formData.userName} disabled />
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date} disabled />
              </div>
              <div className="space-y-2">
                <Label>Status *</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="leave">Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Check In</Label>
                  <Input
                    type="time"
                    value={formData.checkInTime}
                    onChange={(e) => setFormData({ ...formData, checkInTime: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Check Out</Label>
                  <Input
                    type="time"
                    value={formData.checkOutTime}
                    onChange={(e) => setFormData({ ...formData, checkOutTime: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any notes..."
                />
              </div>
              <Button onClick={handleEditAttendance} className="w-full energy-gradient">
                Update Record
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default AdminDashboard;

