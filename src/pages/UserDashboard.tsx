import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AttendanceRecord } from '@/types/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, ClipboardList, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import Layout from '@/components/Layout';

const UserDashboard = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load attendance records from Supabase
  useEffect(() => {
    if (user?.id) {
      loadAttendanceRecords();
    }
  }, [user?.id]);

  const loadAttendanceRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('user_id', user?.id)
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

  const getStatusBadge = (status: string) => {
    const variants = {
      present: 'bg-green-500/10 text-green-700 border-green-500/20',
      absent: 'bg-red-500/10 text-red-700 border-red-500/20',
      late: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
      leave: 'bg-blue-500/10 text-blue-700 border-blue-500/20'
    };
    return variants[status as keyof typeof variants] || '';
  };

  // Calculate statistics for current user
  const stats = {
    totalDays: attendanceRecords.length,
    present: attendanceRecords.filter(r => r.status === 'present').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    leave: attendanceRecords.filter(r => r.status === 'leave').length
  };

  const attendancePercentage = stats.totalDays > 0 
    ? ((stats.present / stats.totalDays) * 100).toFixed(1)
    : '0';

  return (
    <Layout>
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="hero-gradient py-12 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-bold text-4xl mb-2">My Attendance</h1>
                <p className="text-white/90">Welcome back, {user?.name}</p>
              </div>
              <ClipboardList className="w-16 h-16 text-energy" />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-8 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Days</p>
                      <p className="text-3xl font-bold text-steel-dark">{stats.totalDays}</p>
                    </div>
                    <Calendar className="w-10 h-10 text-energy" />
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
                    <TrendingUp className="w-10 h-10 text-green-600" />
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
                    <Calendar className="w-10 h-10 text-red-600" />
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
                    <Clock className="w-10 h-10 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Attendance %</p>
                      <p className="text-3xl font-bold text-energy">{attendancePercentage}%</p>
                    </div>
                    <TrendingUp className="w-10 h-10 text-energy" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Attendance Records */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-card">
              <CardHeader>
                <CardTitle className="font-display text-2xl text-steel-dark">
                  My Attendance Records
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  View-only access to your attendance history
                </p>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Check In</TableHead>
                        <TableHead>Check Out</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        attendanceRecords
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((record) => (
                            <TableRow key={record.id}>
                              <TableCell className="font-medium">
                                {new Date(record.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </TableCell>
                              <TableCell>
                                <Badge className={getStatusBadge(record.status)}>
                                  {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                                </Badge>
                              </TableCell>
                              <TableCell>{record.checkInTime || '-'}</TableCell>
                              <TableCell>{record.checkOutTime || '-'}</TableCell>
                              <TableCell className="max-w-xs truncate">
                                {record.notes || '-'}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {new Date(record.updatedAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {attendanceRecords.length > 0 && (
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <h3 className="font-semibold text-steel-dark mb-2">Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Present Days:</span>
                        <span className="ml-2 font-semibold text-green-600">{stats.present}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Absent Days:</span>
                        <span className="ml-2 font-semibold text-red-600">{stats.absent}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Late Days:</span>
                        <span className="ml-2 font-semibold text-yellow-600">{stats.late}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Leave Days:</span>
                        <span className="ml-2 font-semibold text-blue-600">{stats.leave}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-card bg-energy/5">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-energy/10 rounded-full flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-energy" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-steel-dark mb-2">About Your Attendance</h3>
                    <p className="text-sm text-muted-foreground">
                      Your attendance records are managed by the admin team. If you notice any discrepancies 
                      or have questions about your attendance, please contact the admin or your team lead.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default UserDashboard;

