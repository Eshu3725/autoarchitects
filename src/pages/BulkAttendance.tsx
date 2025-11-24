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

      console.log('Saving attendance for date:', dateStr);
      console.log('User ID:', user.id);
      console.log('Team members count:', teamMembers.length);

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
      <div className="min-h-screen bg-muted/30">
        {/* Header */}
        <section className="hero-gradient py-12 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="font-display font-bold text-4xl mb-2">Bulk Attendance</h1>
                <p className="text-white/90">Mark attendance for all members on a specific date</p>
              </div>
              <Users className="w-16 h-16 text-energy" />
            </div>
          </div>
        </section>

        {/* Date Selection & Stats */}
        <section className="py-8 bg-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Date Picker */}
              <Card className="border-0 shadow-card md:col-span-1">
                <CardContent className="p-6">
                  <Label className="text-sm font-semibold mb-3 block">Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
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
              <Card className="border-0 shadow-card">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Members</p>
                      <p className="text-3xl font-bold text-steel-dark">{stats.total}</p>
                    </div>
                    <Users className="w-10 h-10 text-energy" />
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
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
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
                    <XCircle className="w-10 h-10 text-red-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Members List */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="border-0 shadow-card">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-display text-2xl text-steel-dark">
                  Team Members - {format(selectedDate, 'MMMM dd, yyyy')}
                </CardTitle>
                <Button
                  onClick={saveAttendance}
                  disabled={isSaving}
                  className="energy-gradient hover-glow"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Attendance'}
                </Button>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">Loading team members...</p>
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
                            "flex items-center justify-between p-4 rounded-lg border-2 transition-all duration-200",
                            isPresent
                              ? "bg-green-50 border-green-200 hover:border-green-300"
                              : "bg-red-50 border-red-200 hover:border-red-300"
                          )}
                        >
                          <div className="flex-1 min-w-0 mr-4">
                            <p className="font-semibold text-steel-dark truncate">{member.name}</p>
                            <p className="text-sm text-muted-foreground truncate">{member.email}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant={isPresent ? "default" : "destructive"}
                              className={cn(
                                "font-semibold",
                                isPresent ? "bg-green-600" : "bg-red-600"
                              )}
                            >
                              {isPresent ? 'Present' : 'Absent'}
                            </Badge>
                            <Switch
                              checked={isPresent}
                              onCheckedChange={() => toggleAttendance(member.id)}
                              className={cn(
                                "data-[state=checked]:bg-green-600",
                                "data-[state=unchecked]:bg-red-600"
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

