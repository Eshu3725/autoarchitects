import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Save, Users, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TeamMember {
  id: string;
  name: string;
  email: string;
}

interface MemberAttendance {
  userId: string;
  userName: string;
  status: 'present' | 'absent';
}

const BulkAttendance = () => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [attendanceMap, setAttendanceMap] = useState<Map<string, 'present' | 'absent'>>(new Map());
  const [existingRecords, setExistingRecords] = useState<Map<string, string>>(new Map());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load team members on mount
  useEffect(() => {
    loadTeamMembers();
  }, []);

  // Load existing attendance when date changes
  useEffect(() => {
    if (selectedDate) {
      loadExistingAttendance();
    }
  }, [selectedDate]);

  const loadTeamMembers = async () => {
    try {
      setIsLoading(true);
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
      
      // Initialize all members as present by default
      const initialMap = new Map<string, 'present' | 'absent'>();
      (data || []).forEach(member => {
        initialMap.set(member.id, 'present');
      });
      setAttendanceMap(initialMap);
    } catch (error) {
      console.error('Error loading team members:', error);
      toast.error('Failed to load team members');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingAttendance = async () => {
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const { data, error } = await supabase
        .from('attendance_records')
        .select('user_id, status, id')
        .eq('date', dateStr);

      if (error) {
        console.error('Error loading existing attendance:', error);
        return;
      }

      // Update attendance map with existing records
      const newMap = new Map(attendanceMap);
      const recordsMap = new Map<string, string>();
      
      (data || []).forEach(record => {
        newMap.set(record.user_id, record.status as 'present' | 'absent');
        recordsMap.set(record.user_id, record.id);
      });
      
      setAttendanceMap(newMap);
      setExistingRecords(recordsMap);
    } catch (error) {
      console.error('Error loading existing attendance:', error);
    }
  };

  const toggleAttendance = (userId: string) => {
    setAttendanceMap(prev => {
      const newMap = new Map(prev);
      const currentStatus = newMap.get(userId) || 'present';
      newMap.set(userId, currentStatus === 'present' ? 'absent' : 'present');
      return newMap;
    });
  };

  const saveAttendance = async () => {
    if (!user?.id) {
      toast.error('User not authenticated');
      return;
    }

    try {
      setIsSaving(true);
      const dateStr = format(selectedDate, 'yyyy-MM-dd');

      console.log('=== BULK ATTENDANCE SAVE DEBUG ===');
      console.log('Saving attendance for date:', dateStr);
      console.log('Current user object:', user);
      console.log('User ID (created_by):', user.id);
      console.log('User email:', user.email);
      console.log('User role:', user.role);
      console.log('Team members count:', teamMembers.length);

      // Verify the user exists in the database
      const { data: userCheck, error: userCheckError } = await supabase
        .from('users')
        .select('id, email, name, role')
        .eq('id', user.id)
        .single();

      console.log('User verification in database:', userCheck);
      console.log('User verification error:', userCheckError);

      if (userCheckError || !userCheck) {
        console.error('CRITICAL: Logged-in user does not exist in database!');
        console.error('User ID from auth:', user.id);
        console.error('Error:', userCheckError);
        toast.error('Authentication error: Your user account is not properly set up in the database. Please contact an administrator.');
        setIsSaving(false);
        return;
      }

      // Separate records into updates and inserts
      const recordsToUpdate = [];
      const recordsToInsert = [];

      for (const member of teamMembers) {
        const status = attendanceMap.get(member.id) || 'present';
        const existingRecordId = existingRecords.get(member.id);

        if (existingRecordId) {
          // Update existing record
          recordsToUpdate.push({
            id: existingRecordId,
            status: status,
            updated_at: new Date().toISOString()
          });
        } else {
          // Insert new record
          recordsToInsert.push({
            user_id: member.id,
            user_name: member.name,
            date: dateStr,
            status: status,
            created_by: user.id
          });
        }
      }

      console.log('Records to update:', recordsToUpdate.length);
      console.log('Records to insert:', recordsToInsert.length);

      // Perform updates if any
      if (recordsToUpdate.length > 0) {
        for (const record of recordsToUpdate) {
          const { error } = await supabase
            .from('attendance_records')
            .update({
              status: record.status,
              updated_at: record.updated_at
            })
            .eq('id', record.id);

          if (error) {
            console.error('Error updating attendance:', error);
            toast.error(`Failed to update attendance: ${error.message}`);
            return;
          }
        }
      }

      // Perform inserts if any
      if (recordsToInsert.length > 0) {
        const { error } = await supabase
          .from('attendance_records')
          .insert(recordsToInsert);

        if (error) {
          console.error('Error inserting attendance:', error);
          toast.error(`Failed to save attendance: ${error.message}`);
          return;
        }
      }

      toast.success(`Attendance saved for ${teamMembers.length} members on ${format(selectedDate, 'MMM dd, yyyy')}`);
      loadExistingAttendance(); // Reload to get updated record IDs
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast.error('Failed to save attendance records');
    } finally {
      setIsSaving(false);
    }
  };

  const stats = {
    total: teamMembers.length,
    present: Array.from(attendanceMap.values()).filter(s => s === 'present').length,
    absent: Array.from(attendanceMap.values()).filter(s => s === 'absent').length
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
                  Telemetry Management
                </span>
                <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-2">Bulk Attendance</h1>
                <p className="text-zinc-300">Mark attendance for all team members on a specific date</p>
              </div>
              <Users className="w-12 h-12 text-energy animate-pulse" />
            </div>
          </div>
        </section>

        {/* Date Selection & Stats */}
        <section className="py-8 bg-background/50 border-b border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Date Picker */}
              <Card className="glass-panel border-white/5 shadow-2xl md:col-span-1">
                <CardContent className="p-6">
                  <Label className="text-sm font-semibold mb-3 block text-zinc-300">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal border-white/10 bg-zinc-900/50 hover:bg-zinc-800/50 text-white hover:text-white",
                          !selectedDate && "text-zinc-400"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4 text-energy" />
                        {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-zinc-950 border-white/10" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => date && setSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              {/* Stats Cards */}
              <Card className="glass-panel border-white/5 shadow-2xl hover:border-energy/30 hover:scale-[1.01] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Total Members</p>
                      <p className="text-3xl font-black text-white mt-1">{stats.total}</p>
                    </div>
                    <Users className="w-10 h-10 text-energy" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5 shadow-2xl hover:border-green-500/30 hover:scale-[1.01] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Present</p>
                      <p className="text-3xl font-black text-green-400 mt-1">{stats.present}</p>
                    </div>
                    <CheckCircle2 className="w-10 h-10 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-panel border-white/5 shadow-2xl hover:border-red-500/30 hover:scale-[1.01] transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Absent</p>
                      <p className="text-3xl font-black text-red-400 mt-1">{stats.absent}</p>
                    </div>
                    <XCircle className="w-10 h-10 text-red-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Members List */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass-panel border-white/5 shadow-2xl">
              <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
                <CardTitle className="font-display font-black text-2xl text-white uppercase tracking-tight">
                  Team Members <span className="text-zinc-400 font-normal">| {format(selectedDate, 'MMMM dd, yyyy')}</span>
                </CardTitle>
                <Button
                  onClick={saveAttendance}
                  disabled={isSaving}
                  className="bg-energy hover:bg-energy-light text-white font-bold transition-all duration-300 hover:shadow-glow hover:scale-[1.03] btn-modern px-6"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Attendance'}
                </Button>
              </CardHeader>
              <CardContent className="pt-6">
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="relative inline-block mb-3">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-energy/20"></div>
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-energy border-t-transparent absolute top-0 left-0"></div>
                    </div>
                    <p className="text-zinc-400 font-medium">Loading team members...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {teamMembers.map((member) => {
                      const status = attendanceMap.get(member.id) || 'present';
                      const isPresent = status === 'present';

                      return (
                        <div
                          key={member.id}
                          className={cn(
                            "flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300",
                            isPresent
                              ? "bg-green-500/5 border-green-500/20 hover:border-green-500/40 hover:bg-green-500/10 shadow-lg shadow-green-950/20"
                              : "bg-red-500/5 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10 shadow-lg shadow-red-950/20"
                          )}
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="font-bold text-white truncate">{member.name}</p>
                            <p className="text-xs text-zinc-400 truncate">{member.email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={cn(
                                "font-bold badge-modern",
                                isPresent 
                                  ? "bg-green-500/10 text-green-400 border-green-500/30 hover:bg-green-500/20" 
                                  : "bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20"
                              )}
                            >
                              {isPresent ? 'Present' : 'Absent'}
                            </Badge>
                            <Switch
                              checked={isPresent}
                              onCheckedChange={() => toggleAttendance(member.id)}
                              className={cn(
                                "data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-red-500",
                                "border border-white/10"
                              )}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default BulkAttendance;

