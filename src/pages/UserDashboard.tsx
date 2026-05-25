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
      present: 'bg-green-500/15 text-green-400 border-green-500/20',
      absent: 'bg-red-500/15 text-red-400 border-red-500/20',
      late: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
      leave: 'bg-blue-500/15 text-blue-400 border-blue-500/20'
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
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Tech Grid Overlay */}
        <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />

        {/* Header */}
        <section className="hero-gradient py-12 text-white relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-energy/10 border border-energy/30 text-energy text-xs font-bold uppercase tracking-widest rounded-md mb-2">
                  Portal Dashboard
                </span>
                <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-2">My Attendance</h1>
                <p className="text-zinc-300">Welcome back, <span className="text-white font-bold">{user?.name}</span></p>
              </div>
              <ClipboardList className="w-12 h-12 text-energy" />
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-8 bg-background/50 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card className="glass-panel border-white/5 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total Days</p>
                      <p className="text-3xl font-black text-white mt-1">{stats.totalDays}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-energy" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel border-white/5 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Present</p>
                      <p className="text-3xl font-black text-green-400 mt-1">{stats.present}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel border-white/5 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Absent</p>
                      <p className="text-3xl font-black text-red-400 mt-1">{stats.absent}</p>
                    </div>
                    <Calendar className="w-8 h-8 text-red-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel border-white/5 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Late</p>
                      <p className="text-3xl font-black text-yellow-400 mt-1">{stats.late}</p>
                    </div>
                    <Clock className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel border-white/5 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Attendance %</p>
                      <p className="text-3xl font-black text-energy mt-1">{attendancePercentage}%</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-energy" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Attendance Records */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass-panel border-white/5 shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-black/10">
                <CardTitle className="font-display font-bold text-xl text-white uppercase tracking-wider">
                  Telemetry Attendance Records
                </CardTitle>
                <p className="text-xs text-zinc-400 mt-1">
                  View-only access to your personal attendance history
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="rounded-xl border border-white/5 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-b border-white/5 hover:bg-transparent">
                        <TableHead className="text-zinc-300 font-bold uppercase tracking-wider text-xs">Date</TableHead>
                        <TableHead className="text-zinc-300 font-bold uppercase tracking-wider text-xs">Status</TableHead>
                        <TableHead className="text-zinc-300 font-bold uppercase tracking-wider text-xs">Check In</TableHead>
                        <TableHead className="text-zinc-300 font-bold uppercase tracking-wider text-xs">Check Out</TableHead>
                        <TableHead className="text-zinc-300 font-bold uppercase tracking-wider text-xs">Notes</TableHead>
                        <TableHead className="text-zinc-300 font-bold uppercase tracking-wider text-xs">Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {attendanceRecords.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                          <TableCell colSpan={6} className="text-center text-zinc-500 py-12">
                            No attendance records found
                          </TableCell>
                        </TableRow>
                      ) : (
                        attendanceRecords
                          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                          .map((record) => (
                            <TableRow key={record.id} className="border-b border-white/5 hover:bg-white/5">
                              <TableCell className="font-medium text-white">
                                {new Date(record.date).toLocaleDateString('en-US', {
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </TableCell>
                              <TableCell>
                                <Badge className={`font-semibold border rounded-md uppercase tracking-wider text-[10px] ${getStatusBadge(record.status)}`}>
                                  {record.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-zinc-300">{record.checkInTime || '-'}</TableCell>
                              <TableCell className="text-zinc-300">{record.checkOutTime || '-'}</TableCell>
                              <TableCell className="max-w-xs truncate text-zinc-400">
                                {record.notes || '-'}
                              </TableCell>
                              <TableCell className="text-xs text-zinc-500">
                                {new Date(record.updatedAt).toLocaleDateString()}
                              </TableCell>
                            </TableRow>
                          ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {attendanceRecords.length > 0 && (
                  <div className="mt-8 p-6 bg-black/20 border border-white/5 rounded-xl">
                    <h3 className="font-bold text-white text-xs uppercase tracking-wider mb-4">Summary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Present:</span>
                        <span className="text-green-400">{stats.present} Days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Absent:</span>
                        <span className="text-red-400">{stats.absent} Days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Late:</span>
                        <span className="text-yellow-400">{stats.late} Days</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-zinc-500">Leave:</span>
                        <span className="text-blue-400">{stats.leave} Days</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Info Section */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass-panel border-white/5 shadow-2xl bg-energy/5 hover:border-energy/20 transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-energy/10 rounded-xl flex items-center justify-center">
                      <ClipboardList className="w-6 h-6 text-energy" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-white uppercase text-sm tracking-wider mb-2">About Your Attendance</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      Your attendance records are managed by the team administration. If you notice any telemetry discrepancies 
                      or have questions about check-in/out timestamps, please contact your respective subteam lead.
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

