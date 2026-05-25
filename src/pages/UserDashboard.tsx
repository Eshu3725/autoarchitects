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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [leaveDate, setLeaveDate] = useState(new Date().toISOString().split('T')[0]);
  const [leaveReason, setLeaveReason] = useState('');
  const [isSubmittingLeave, setIsSubmittingLeave] = useState(false);
  const [isRequestsLoading, setIsRequestsLoading] = useState(true);

  // Load attendance records from Supabase
  useEffect(() => {
    if (user?.id) {
      loadAttendanceRecords();
      loadLeaveRequests();
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

  const loadLeaveRequests = async () => {
    try {
      setIsRequestsLoading(true);
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error loading leave requests:', error);
        toast.error('Failed to load leave requests');
        return;
      }

      const transformedData: LeaveRequest[] = (data || []).map(r => ({
        id: r.id,
        userId: r.user_id,
        userName: r.user_name,
        date: r.date,
        reason: r.reason,
        status: r.status,
        createdAt: r.created_at
      }));

      setLeaveRequests(transformedData);
    } catch (error) {
      console.error('Error loading leave requests:', error);
    } finally {
      setIsRequestsLoading(false);
    }
  };

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !user?.name) {
      toast.error('User information is incomplete');
      return;
    }
    if (!leaveDate) {
      toast.error('Please select a date');
      return;
    }
    if (!leaveReason.trim()) {
      toast.error('Please enter a valid reason');
      return;
    }

    try {
      setIsSubmittingLeave(true);
      const { error } = await supabase
        .from('leave_requests')
        .insert({
          user_id: user.id,
          user_name: user.name,
          date: leaveDate,
          reason: leaveReason.trim(),
          status: 'Pending'
        });

      if (error) {
        console.error('Error submitting leave request:', error);
        toast.error('Failed to submit leave request: ' + error.message);
        return;
      }

      toast.success('Leave request submitted successfully');
      setLeaveReason('');
      loadLeaveRequests();
    } catch (error: any) {
      console.error('Error submitting leave request:', error);
      toast.error('Failed to submit leave request');
    } finally {
      setIsSubmittingLeave(false);
    }
  };

  const getLeaveStatusBadge = (status: string) => {
    const variants = {
      Pending: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
      Approved: 'bg-green-500/15 text-green-400 border-green-500/20',
      Rejected: 'bg-red-500/15 text-red-400 border-red-500/20'
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

        {/* Attendance & Leave Request Grid */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Telemetry Attendance Records (Left/Middle Column) */}
              <div className="lg:col-span-2">
                <Card className="glass-panel border-white/5 shadow-2xl rounded-2xl overflow-hidden h-full">
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

              {/* Leave Request Center (Right Column) */}
              <div className="lg:col-span-1">
                <div className="space-y-6">
                  {/* Submit Request Card */}
                  <Card className="glass-panel border-white/5 shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-black/10">
                      <CardTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
                        Request Leave
                      </CardTitle>
                      <p className="text-xs text-zinc-400 mt-1">
                        Submit a leave request for administrative approval
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <form onSubmit={handleSubmitLeave} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="leave-date" className="text-zinc-300 font-semibold text-xs uppercase tracking-wider">Date *</Label>
                          <Input
                            id="leave-date"
                            type="date"
                            value={leaveDate}
                            onChange={(e) => setLeaveDate(e.target.value)}
                            required
                            className="bg-zinc-900/50 border-white/10 text-white placeholder-zinc-500 focus:border-energy focus:ring-energy/20"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="leave-reason" className="text-zinc-300 font-semibold text-xs uppercase tracking-wider">Reason *</Label>
                          <Textarea
                            id="leave-reason"
                            value={leaveReason}
                            onChange={(e) => setLeaveReason(e.target.value)}
                            placeholder="Enter a valid reason for leave..."
                            required
                            rows={3}
                            className="bg-zinc-900/50 border-white/10 text-white placeholder-zinc-500 focus:border-energy focus:ring-energy/20 text-sm"
                          />
                        </div>
                        <Button
                          type="submit"
                          disabled={isSubmittingLeave}
                          className="w-full bg-energy hover:bg-energy-light text-white font-bold transition-all duration-300 hover:shadow-glow hover:scale-[1.03] btn-modern"
                        >
                          {isSubmittingLeave ? 'Submitting...' : 'Submit Request'}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>

                  {/* Leave Log Card */}
                  <Card className="glass-panel border-white/5 shadow-2xl rounded-2xl overflow-hidden">
                    <CardHeader className="border-b border-white/5 bg-black/10">
                      <CardTitle className="font-display font-bold text-lg text-white uppercase tracking-wider">
                        Leave History
                      </CardTitle>
                      <p className="text-xs text-zinc-400 mt-1">
                        Track the status of your submitted leave requests
                      </p>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
                        {isRequestsLoading ? (
                          <p className="text-center text-xs text-zinc-500 py-4">Loading requests...</p>
                        ) : leaveRequests.length === 0 ? (
                          <p className="text-center text-xs text-zinc-500 py-4">No leave requests submitted</p>
                        ) : (
                          leaveRequests.map((req) => (
                            <div key={req.id} className="p-3 border border-white/5 rounded-xl bg-zinc-900/10 hover:bg-white/5 transition-colors">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-bold text-xs text-white">
                                  {new Date(req.date).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                                <Badge className={`text-[9px] font-bold border rounded-md uppercase tracking-wider px-1.5 py-0.5 ${getLeaveStatusBadge(req.status)}`}>
                                  {req.status}
                                </Badge>
                              </div>
                              <p className="text-xs text-zinc-400 mt-2 line-clamp-2" title={req.reason}>
                                {req.reason}
                              </p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

            </div>
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

