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
import { Calendar, Plus, Edit, Users, ClipboardList, TrendingUp, UserPlus, ChevronDown, ChevronRight, Trash2, Download, Check, X } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import Layout from '@/components/Layout';
import { jsPDF } from 'jspdf';

interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  date: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  reviewedBy?: string | null;
  reviewedAt?: string | null;
  designation?: string;
}

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
  const [summarySearchQuery, setSummarySearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [isLeavesLoading, setIsLeavesLoading] = useState(true);

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

  const [isAddMemberDialogOpen, setIsAddMemberDialogOpen] = useState(false);
  const [isCreatingMember, setIsCreatingMember] = useState(false);
  const [memberFormData, setMemberFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    designation: 'Team Member',
    year: '1st Year',
    major: 'Mechanical Engineering',
    bio: '',
    category: 'technical' as 'leadership' | 'technical' | 'operations'
  });

  // Load team members and attendance records from Supabase
  useEffect(() => {
    loadTeamMembers();
    loadAttendanceRecords();
    loadLeaveRequests();
  }, []);

  const loadTeamMembers = async () => {
    try {
      // First try to load all columns (including new ones)
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, designation, year, major, bio, category')
        .eq('role', 'user')
        .order('name');

      if (error) {
        console.warn('Failed to load all columns, falling back to core columns:', error);
        
        // Fallback: Query only core columns that exist for sure
        const { data: fallbackData, error: fallbackError } = await supabase
          .from('users')
          .select('id, name, email')
          .eq('role', 'user')
          .order('name');
          
        if (fallbackError) {
          console.error('Error loading fallback team members:', fallbackError);
          toast.error('Failed to load team members');
          return;
        }
        
        // Map fallback data with default values for new columns
        const mappedData = (fallbackData || []).map(member => ({
          ...member,
          designation: 'Team Member',
          year: '1st Year',
          major: 'Mechanical Engineering',
          bio: '',
          category: 'technical' as const
        }));
        
        setTeamMembers(mappedData);
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

  const loadLeaveRequests = async () => {
    try {
      setIsLeavesLoading(true);
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
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
        status: r.status as 'Pending' | 'Approved' | 'Rejected',
        createdAt: r.created_at,
        reviewedBy: r.reviewed_by,
        reviewedAt: r.reviewed_at
      }));

      setLeaveRequests(transformedData);
    } catch (error) {
      console.error('Error loading leave requests:', error);
    } finally {
      setIsLeavesLoading(false);
    }
  };

  const handleApproveLeave = async (request: LeaveRequest) => {
    try {
      // 1. Update the leave request status to Approved
      const { error: requestError } = await supabase
        .from('leave_requests')
        .update({
          status: 'Approved',
          reviewed_by: user?.id || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (requestError) {
        console.error('Error approving leave request:', requestError);
        toast.error('Failed to approve leave request: ' + requestError.message);
        return;
      }

      // 2. Check if attendance record exists for this user on this date
      const { data: existingRecords, error: checkError } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('user_id', request.userId)
        .eq('date', request.date);

      if (checkError) {
        console.error('Error checking existing attendance:', checkError);
        toast.error('Leave approved, but failed to check attendance records');
        loadLeaveRequests();
        return;
      }

      if (existingRecords && existingRecords.length > 0) {
        // Update existing record to 'leave'
        const { error: updateError } = await supabase
          .from('attendance_records')
          .update({
            status: 'leave',
            notes: `Leave Approved: ${request.reason}`,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingRecords[0].id);

        if (updateError) {
          console.error('Error updating attendance record:', updateError);
          toast.error('Leave approved, but failed to update attendance record');
        } else {
          toast.success('Leave request approved and attendance record updated');
        }
      } else {
        // Insert new record
        const { error: insertError } = await supabase
          .from('attendance_records')
          .insert({
            user_id: request.userId,
            user_name: request.userName,
            date: request.date,
            status: 'leave',
            notes: `Leave Approved: ${request.reason}`,
            created_by: user?.id || ''
          });

        if (insertError) {
          console.error('Error inserting attendance record:', insertError);
          toast.error('Leave approved, but failed to create attendance record');
        } else {
          toast.success('Leave request approved and attendance record created');
        }
      }

      // Refresh data
      loadLeaveRequests();
      loadAttendanceRecords();
    } catch (error: any) {
      console.error('Error handling leave approval:', error);
      toast.error('Failed to process leave approval');
    }
  };

  const handleRejectLeave = async (request: LeaveRequest) => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({
          status: 'Rejected',
          reviewed_by: user?.id || null,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', request.id);

      if (error) {
        console.error('Error rejecting leave request:', error);
        toast.error('Failed to reject leave request: ' + error.message);
        return;
      }

      toast.success('Leave request rejected successfully');
      loadLeaveRequests();
    } catch (error: any) {
      console.error('Error handling leave rejection:', error);
      toast.error('Failed to process leave rejection');
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

  const handleAddMember = async () => {
    if (!memberFormData.name || !memberFormData.email || !memberFormData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setIsCreatingMember(true);
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: memberFormData.name,
            email: memberFormData.email,
            password: memberFormData.password,
            role: memberFormData.role,
            designation: memberFormData.designation,
            year: memberFormData.year,
            major: memberFormData.major,
            bio: memberFormData.bio,
            category: memberFormData.category
          }
        ])
        .select();

      if (error) {
        console.error('Error adding team member:', error);
        toast.error(`Failed to add team member: ${error.message}`);
        return;
      }

      setIsAddMemberDialogOpen(false);
      setMemberFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
        designation: 'Team Member',
        year: '1st Year',
        major: 'Mechanical Engineering',
        bio: '',
        category: 'technical'
      });
      toast.success(`Team member "${memberFormData.name}" added successfully!`);
      loadTeamMembers(); // Reload members list
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Failed to add team member');
    } finally {
      setIsCreatingMember(false);
    }
  };

  const handleDeleteMember = async (memberId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to delete ${memberName}? This will also delete all their attendance records.`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', memberId);

      if (error) {
        console.error('Error deleting team member:', error);
        toast.error(`Failed to delete team member: ${error.message}`);
        return;
      }

      toast.success(`Team member "${memberName}" deleted successfully`);
      loadTeamMembers(); // Reload members list
      loadAttendanceRecords(); // Reload attendance records
    } catch (error) {
      console.error('Error deleting team member:', error);
      toast.error('Failed to delete team member');
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
      present: 'bg-green-500/15 text-green-400 border-green-500/20',
      absent: 'bg-red-500/15 text-red-400 border-red-500/20',
      late: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
      leave: 'bg-blue-500/15 text-blue-400 border-blue-500/20'
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

  // Calculate attendance summaries for each member
  const memberSummaries = teamMembers.map(member => {
    const memberRecords = attendanceRecords.filter(r => r.userId === member.id);
    const present = memberRecords.filter(r => r.status === 'present').length;
    const absent = memberRecords.filter(r => r.status === 'absent').length;
    const late = memberRecords.filter(r => r.status === 'late').length;
    const leave = memberRecords.filter(r => r.status === 'leave').length;
    const total = memberRecords.length;
    
    // Attendance rate formula: (present + late) / total * 100
    const percentage = total > 0 
      ? Math.round(((present + late) / total) * 1000) / 10 
      : 100.0;

    return {
      id: member.id,
      name: member.name,
      designation: (member as any).designation || 'Team Member',
      total,
      present,
      absent,
      late,
      leave,
      percentage
    };
  });

  const filteredSummaries = memberSummaries.filter(s => 
    s.name.toLowerCase().includes(summarySearchQuery.toLowerCase()) ||
    s.designation.toLowerCase().includes(summarySearchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["Member Name", "Designation", "Total Sessions", "Present", "Absent", "Late", "Leave", "Attendance Percentage"];
    const rows = filteredSummaries.map(row => [
      row.name,
      row.designation,
      row.total,
      row.present,
      row.absent,
      row.late,
      row.leave,
      row.total > 0 ? `${row.percentage}%` : "N/A"
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `attendance_summary_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Page setup - Sleek header card style
      doc.setFillColor(10, 15, 30); // Dark background header
      doc.rect(0, 0, 210, 45, "F");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(22);
      doc.setTextColor(255, 255, 255);
      doc.text("AUTOARCHITECTS ATV CLUB", 14, 20);
      
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(239, 68, 68); // Crimson Energy accent
      doc.text("Attendance Summary Report", 14, 28);
      
      doc.setFontSize(9);
      doc.setTextColor(161, 161, 170); // zinc-400
      doc.text(`Generated on: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, 14, 35);
      
      // Draw line
      doc.setDrawColor(63, 63, 70); // zinc-700
      doc.setLineWidth(0.5);
      doc.line(14, 45, 196, 45);
      
      // Table headers
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(10, 15, 30);
      
      const headers = ["Member Name", "Designation", "Total", "Present", "Absent", "Late", "Leave", "Rate (%)"];
      const colPositions = [14, 60, 105, 118, 133, 148, 163, 178];
      
      // Draw header row background
      doc.setFillColor(244, 244, 245); // zinc-100
      doc.rect(14, 50, 182, 8, "F");
      
      headers.forEach((header, index) => {
        doc.text(header, colPositions[index], 55);
      });
      
      // Table rows
      doc.setFont("helvetica", "normal");
      doc.setTextColor(39, 39, 42); // zinc-800
      let y = 65;
      
      filteredSummaries.forEach((row, i) => {
        // Page overflow control
        if (y > 280) {
          doc.addPage();
          y = 20;
          
          // Re-draw headers on new page
          doc.setFillColor(244, 244, 245);
          doc.rect(14, y - 5, 182, 8, "F");
          doc.setFont("helvetica", "bold");
          doc.setTextColor(10, 15, 30);
          headers.forEach((header, index) => {
            doc.text(header, colPositions[index], y);
          });
          doc.setFont("helvetica", "normal");
          doc.setTextColor(39, 39, 42);
          y += 10;
        }
        
        // Zebra striping
        if (i % 2 === 0) {
          doc.setFillColor(250, 250, 250);
          doc.rect(14, y - 4, 182, 6, "F");
        }
        
        doc.text(row.name.substring(0, 22), colPositions[0], y);
        doc.text((row.designation || "Team Member").substring(0, 20), colPositions[1], y);
        doc.text(row.total.toString(), colPositions[2], y);
        doc.text(row.present.toString(), colPositions[3], y);
        doc.text(row.absent.toString(), colPositions[4], y);
        doc.text(row.late.toString(), colPositions[5], y);
        doc.text(row.leave.toString(), colPositions[6], y);
        
        // Highlight low attendance in red, high in green
        if (row.total > 0) {
          if (row.percentage < 75) {
            doc.setTextColor(220, 38, 38); // red-600
          } else {
            doc.setTextColor(22, 163, 74); // green-600
          }
          doc.text(`${row.percentage}%`, colPositions[7], y);
          doc.setTextColor(39, 39, 42); // Reset to default
        } else {
          doc.text("N/A", colPositions[7], y);
        }
        
        y += 7;
      });
      
      doc.save(`attendance_summary_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF exported successfully');
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      toast.error('Failed to generate PDF report: ' + err.message);
    }
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
                <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-2">Admin Dashboard</h1>
                <p className="text-zinc-300">Welcome back, <span className="text-white font-bold">{user?.name}</span></p>
              </div>
              <ClipboardList className="w-12 h-12 text-energy" />
            </div>
          </div>
        </section>

        {/* Quick Access */}
        <section className="py-8 bg-background/50 border-b border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Quick Access</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card
                className="glass-panel border-white/5 shadow-2xl cursor-pointer hover:border-energy/30 hover:scale-[1.01] transition-all duration-300"
                onClick={() => navigate('/admin/registrations')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Student Registrations</p>
                      <p className="text-lg font-bold text-white uppercase tracking-tight">View & Manage Applications</p>
                    </div>
                    <UserPlus className="w-10 h-10 text-energy" />
                  </div>
                </CardContent>
              </Card>
              <Card
                className="glass-panel border-white/5 shadow-2xl cursor-pointer hover:border-energy/30 hover:scale-[1.01] transition-all duration-300"
                onClick={() => navigate('/admin/bulk-attendance')}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Bulk Attendance</p>
                      <p className="text-lg font-bold text-white uppercase tracking-tight">Mark by Date (Recommended)</p>
                    </div>
                    <Users className="w-10 h-10 text-energy" />
                  </div>
                </CardContent>
              </Card>
              <Card className="glass-panel border-white/5 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider mb-1">Individual Records</p>
                      <p className="text-lg font-bold text-white uppercase tracking-tight">Current Page</p>
                    </div>
                    <ClipboardList className="w-10 h-10 text-zinc-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="py-8 bg-background/30 border-b border-white/5 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Attendance Statistics</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="glass-panel border-white/5 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Total Records</p>
                      <p className="text-3xl font-black text-white mt-1">{stats.totalRecords}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-energy" />
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
                    <Users className="w-8 h-8 text-green-400" />
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
                    <Users className="w-8 h-8 text-red-400" />
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
                    <Calendar className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="glass-panel border-white/5 shadow-2xl rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-white/5 bg-black/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <CardTitle className="font-display font-bold text-xl text-white uppercase tracking-wider">
                    Attendance Records
                  </CardTitle>
                  <div className="flex flex-wrap gap-2">
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

                    <Dialog open={isAddMemberDialogOpen} onOpenChange={setIsAddMemberDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-energy text-energy hover:bg-energy hover:text-white" onClick={() => setMemberFormData({ name: '', email: '', password: '', role: 'user', designation: 'Team Member', year: '1st Year', major: 'Mechanical Engineering', bio: '', category: 'technical' })}>
                          <Users className="w-4 h-4 mr-2" />
                          Manage Team
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
                        <DialogHeader>
                          <DialogTitle>Manage Team</DialogTitle>
                        </DialogHeader>
                        
                        <Tabs defaultValue="list" className="w-full flex-1 flex flex-col overflow-hidden">
                          <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger value="list">Members List</TabsTrigger>
                            <TabsTrigger value="add">Add Member</TabsTrigger>
                          </TabsList>
                          
                          <TabsContent value="list" className="flex-1 overflow-y-auto pr-1">
                            <div className="space-y-3">
                              {teamMembers.length === 0 ? (
                                <p className="text-center text-muted-foreground py-6">No team members found.</p>
                              ) : (
                                teamMembers.map(member => (
                                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-muted/30 transition-colors">
                                    <div className="min-w-0 flex-1 mr-3">
                                      <p className="font-semibold text-steel-dark truncate">{member.name}</p>
                                      <p className="text-xs text-muted-foreground truncate">{member.email}</p>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => handleDeleteMember(member.id, member.name)}
                                      className="text-red-500 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                ))
                              )}
                            </div>
                          </TabsContent>
                          
                          <TabsContent value="add" className="space-y-4 pt-2 overflow-y-auto max-h-[60vh] pr-1">
                            <div className="space-y-2">
                              <Label htmlFor="memberName">Full Name *</Label>
                              <Input
                                id="memberName"
                                placeholder="John Doe"
                                value={memberFormData.name}
                                onChange={(e) => setMemberFormData({ ...memberFormData, name: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="memberEmail">Email Address (Username) *</Label>
                              <Input
                                id="memberEmail"
                                type="email"
                                placeholder="john.doe@autoarchitects.com"
                                value={memberFormData.email}
                                onChange={(e) => setMemberFormData({ ...memberFormData, email: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="memberPassword">Password *</Label>
                              <Input
                                id="memberPassword"
                                type="text"
                                placeholder="Enter password"
                                value={memberFormData.password}
                                onChange={(e) => setMemberFormData({ ...memberFormData, password: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="memberDesignation">Designation *</Label>
                                <Input
                                  id="memberDesignation"
                                  placeholder="Steering"
                                  value={memberFormData.designation}
                                  onChange={(e) => setMemberFormData({ ...memberFormData, designation: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="memberYear">Year *</Label>
                                <Select 
                                  value={memberFormData.year} 
                                  onValueChange={(value) => setMemberFormData({ ...memberFormData, year: value })}
                                >
                                  <SelectTrigger id="memberYear">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="1st Year">1st Year</SelectItem>
                                    <SelectItem value="2nd Year">2nd Year</SelectItem>
                                    <SelectItem value="3rd Year">3rd Year</SelectItem>
                                    <SelectItem value="4th Year">4th Year</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="memberMajor">Major / Department *</Label>
                              <Input
                                id="memberMajor"
                                placeholder="Mechanical Engineering"
                                value={memberFormData.major}
                                onChange={(e) => setMemberFormData({ ...memberFormData, major: e.target.value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="memberBio">Bio / USN</Label>
                              <Input
                                id="memberBio"
                                placeholder="USN: 1SI22ME000"
                                value={memberFormData.bio}
                                onChange={(e) => setMemberFormData({ ...memberFormData, bio: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="memberCategory">Subteam Category *</Label>
                                <Select 
                                  value={memberFormData.category} 
                                  onValueChange={(value: 'leadership' | 'technical' | 'operations') => setMemberFormData({ ...memberFormData, category: value })}
                                >
                                  <SelectTrigger id="memberCategory">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="leadership">Leadership</SelectItem>
                                    <SelectItem value="technical">Technical</SelectItem>
                                    <SelectItem value="operations">Operations</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="memberRole">Auth Role *</Label>
                                <Select 
                                  value={memberFormData.role} 
                                  onValueChange={(value: 'admin' | 'user') => setMemberFormData({ ...memberFormData, role: value })}
                                >
                                  <SelectTrigger id="memberRole">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="user">User (Team Member)</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            <Button onClick={handleAddMember} disabled={isCreatingMember} className="w-full energy-gradient mt-2">
                              {isCreatingMember ? 'Creating...' : 'Add Team Member'}
                            </Button>
                          </TabsContent>
                        </Tabs>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <Tabs defaultValue="daily" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 max-w-lg bg-zinc-900 border border-white/5 p-1 rounded-xl">
                    <TabsTrigger value="daily" className="rounded-lg data-[state=active]:bg-energy data-[state=active]:text-white">Daily Records</TabsTrigger>
                    <TabsTrigger value="summary" className="rounded-lg data-[state=active]:bg-energy data-[state=active]:text-white">Member Summary</TabsTrigger>
                    <TabsTrigger value="leaves" className="rounded-lg data-[state=active]:bg-energy data-[state=active]:text-white">Leave Requests</TabsTrigger>
                  </TabsList>

                  <TabsContent value="daily" className="space-y-4">
                    {/* Filters */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                      <Input
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="md:w-64 bg-zinc-900/50 border-white/10 text-white placeholder-zinc-500 focus:border-energy focus:ring-energy/20"
                      />
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="md:w-48 bg-zinc-900/50 border-white/10 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-950 border-white/10 text-white">
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
                      <div className="text-center text-zinc-500 py-12 border border-white/5 rounded-xl bg-zinc-900/10">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                        <p className="text-lg font-medium text-white">No attendance records found</p>
                        <p className="text-sm mt-2 text-zinc-400">Try adjusting your filters or add new attendance records</p>
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
                              className="border border-white/5 rounded-xl overflow-hidden glass-panel"
                            >
                              <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-white/5 transition-colors">
                                <div className="flex items-center justify-between w-full pr-4">
                                  <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 energy-gradient rounded-lg flex items-center justify-center shadow-glow">
                                      <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    <div className="text-left">
                                      <h3 className="font-display font-black text-lg text-white uppercase tracking-tight">
                                        {formatDateHeader(date)}
                                      </h3>
                                      <p className="text-xs text-zinc-400 mt-1 uppercase font-bold tracking-wider">
                                        {dateStats.total} members:
                                        <span className="text-green-400 font-bold ml-2">{dateStats.present} present</span>
                                        {dateStats.absent > 0 && <span className="text-red-400 font-bold ml-2">{dateStats.absent} absent</span>}
                                        {dateStats.late > 0 && <span className="text-yellow-400 font-bold ml-2">{dateStats.late} late</span>}
                                        {dateStats.leave > 0 && <span className="text-blue-400 font-bold ml-2">{dateStats.leave} on leave</span>}
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
                                      className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-zinc-900/10 hover:bg-white/5 transition-colors"
                                    >
                                      <div className="flex items-center gap-4 flex-1">
                                        <div className="flex-1">
                                          <p className="font-bold text-white">{record.userName}</p>
                                          <div className="flex items-center gap-3 mt-1 text-xs text-zinc-400">
                                            <span className="flex items-center gap-1">
                                              <Badge className={getStatusBadge(record.status)}>
                                                {record.status}
                                              </Badge>
                                            </span>
                                            {record.checkInTime && (
                                              <span className="font-semibold">In: {record.checkInTime}</span>
                                            )}
                                            {record.checkOutTime && (
                                              <span className="font-semibold">Out: {record.checkOutTime}</span>
                                            )}
                                          </div>
                                          {record.notes && (
                                            <p className="text-xs text-zinc-500 mt-2 italic">
                                              Notes: {record.notes}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEditDialog(record)}
                                        className="ml-4 border-white/10 hover:bg-zinc-800 text-zinc-300 hover:text-white"
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
                  </TabsContent>

                  <TabsContent value="summary" className="space-y-4">
                    {/* Summary Filters & Exports */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <Input
                        placeholder="Search members by name or designation..."
                        value={summarySearchQuery}
                        onChange={(e) => setSummarySearchQuery(e.target.value)}
                        className="md:w-80 bg-zinc-900/50 border-white/10 text-white placeholder-zinc-500 focus:border-energy focus:ring-energy/20"
                      />
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={handleExportCSV}
                          className="border border-energy/50 text-energy bg-energy/5 hover:bg-energy hover:text-white hover:border-energy hover:shadow-glow hover:scale-[1.03] transition-all duration-300 btn-modern px-4"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export CSV
                        </Button>
                        <Button
                          onClick={handleExportPDF}
                          className="bg-energy hover:bg-energy-light text-white font-bold transition-all duration-300 hover:shadow-glow hover:scale-[1.03] btn-modern px-4"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export PDF
                        </Button>
                      </div>
                    </div>

                    {/* Summary Grid Table */}
                    <div className="rounded-xl border border-white/5 overflow-hidden bg-zinc-900/20 backdrop-blur-md shadow-2xl">
                      <Table className="table-modern">
                        <TableHeader className="bg-zinc-950/80">
                          <TableRow className="border-b border-white/5">
                            <TableHead className="text-zinc-400 font-bold">Name</TableHead>
                            <TableHead className="text-zinc-400 font-bold">Designation</TableHead>
                            <TableHead className="text-zinc-400 font-bold text-center">Total Sessions</TableHead>
                            <TableHead className="text-zinc-400 font-bold text-center text-green-400">Present</TableHead>
                            <TableHead className="text-zinc-400 font-bold text-center text-red-400">Absent</TableHead>
                            <TableHead className="text-zinc-400 font-bold text-center text-yellow-400">Late</TableHead>
                            <TableHead className="text-zinc-400 font-bold text-center text-blue-400">Leave</TableHead>
                            <TableHead className="text-zinc-400 font-bold text-center">Attendance %</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredSummaries.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center text-zinc-500 py-8">
                                No members found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredSummaries.map((summary) => (
                              <TableRow key={summary.id} className="border-b border-white/5 hover:bg-white/5">
                                <TableCell className="font-bold text-white">{summary.name}</TableCell>
                                <TableCell className="text-zinc-300">{summary.designation}</TableCell>
                                <TableCell className="text-center text-white font-medium">{summary.total}</TableCell>
                                <TableCell className="text-center text-green-400 font-medium">{summary.present}</TableCell>
                                <TableCell className="text-center text-red-400 font-medium">{summary.absent}</TableCell>
                                <TableCell className="text-center text-yellow-400 font-medium">{summary.late}</TableCell>
                                <TableCell className="text-center text-blue-400 font-medium">{summary.leave}</TableCell>
                                <TableCell className="text-center">
                                  <Badge 
                                    className={
                                      summary.total === 0 
                                        ? "badge-modern bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                                        : summary.percentage >= 75
                                          ? "badge-modern bg-green-500/10 text-green-400 border-green-500/30 font-bold"
                                          : "badge-modern bg-red-500/10 text-red-400 border-red-500/30 font-bold"
                                    }
                                  >
                                    {summary.total > 0 ? `${summary.percentage}%` : 'N/A'}
                                  </Badge>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  <TabsContent value="leaves" className="space-y-6">
                    {/* Header/Filters for leaves */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider font-display">
                          Leave Requests Control Center
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1">
                          Review, approve, or reject leave requests from team members. Approved requests will automatically register as leave in the attendance system.
                        </p>
                      </div>
                    </div>

                    {isLeavesLoading ? (
                      <div className="text-center text-zinc-500 py-12 border border-white/5 rounded-xl bg-zinc-900/10">
                        <div className="animate-spin w-8 h-8 border-2 border-energy border-t-transparent rounded-full mx-auto mb-4" />
                        <p className="text-lg font-medium text-white">Loading leave requests...</p>
                      </div>
                    ) : leaveRequests.length === 0 ? (
                      <div className="text-center text-zinc-500 py-12 border border-white/5 rounded-xl bg-zinc-900/10">
                        <ClipboardList className="w-12 h-12 mx-auto mb-4 text-zinc-600" />
                        <p className="text-lg font-medium text-white">No leave requests found</p>
                        <p className="text-sm mt-2 text-zinc-400">All submitted leave requests will appear here</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Pending Requests Section */}
                        {leaveRequests.filter(r => r.status === 'Pending').length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                              Pending Action Required ({leaveRequests.filter(r => r.status === 'Pending').length})
                            </h4>
                            <div className="grid grid-cols-1 gap-4">
                              {leaveRequests
                                .filter(r => r.status === 'Pending')
                                .map((request) => {
                                  const member = teamMembers.find(m => m.id === request.userId);
                                  return (
                                    <div
                                      key={request.id}
                                      className="flex flex-col md:flex-row md:items-center justify-between p-5 rounded-xl border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all duration-300 gap-4"
                                    >
                                      <div className="flex-1 space-y-2">
                                        <div className="flex items-center flex-wrap gap-2">
                                          <p className="font-bold text-white text-lg">{request.userName}</p>
                                          <Badge className="badge-modern bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                                            {member?.designation || 'Team Member'}
                                          </Badge>
                                          <Badge className="badge-modern bg-zinc-800 text-zinc-300 border-zinc-700">
                                            {member?.year || '1st Year'}
                                          </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-400">
                                          <span className="font-bold text-energy uppercase tracking-wider">Leave Date:</span>
                                          <span className="text-white font-semibold">{formatDateHeader(request.date)}</span>
                                        </div>
                                        <p className="text-sm text-zinc-300 bg-black/20 p-3 rounded-lg border border-white/5 italic">
                                          "{request.reason}"
                                        </p>
                                        <p className="text-xxs text-zinc-500">
                                          Requested on {new Date(request.createdAt).toLocaleDateString()} at {new Date(request.createdAt).toLocaleTimeString()}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-3 md:self-center self-end">
                                        <Button
                                          onClick={() => handleRejectLeave(request)}
                                          className="border border-red-500/50 text-red-400 bg-red-500/5 hover:bg-red-600 hover:text-white hover:border-red-600 hover:shadow-glow hover:scale-[1.02] transition-all duration-300 btn-modern px-4 py-2"
                                        >
                                          <X className="w-4 h-4 mr-2" />
                                          Reject
                                        </Button>
                                        <Button
                                          onClick={() => handleApproveLeave(request)}
                                          className="bg-green-600 hover:bg-green-500 hover:shadow-glow hover:scale-[1.02] text-white font-bold transition-all duration-300 btn-modern px-4 py-2"
                                        >
                                          <Check className="w-4 h-4 mr-2" />
                                          Approve
                                        </Button>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}

                        {/* History Log Section */}
                        <div className="space-y-4">
                          <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                            Historical Records ({leaveRequests.filter(r => r.status !== 'Pending').length})
                          </h4>
                          <div className="rounded-xl border border-white/5 overflow-hidden bg-zinc-900/20 shadow-2xl">
                            <Table className="table-modern">
                              <TableHeader className="bg-zinc-950/80">
                                <TableRow className="border-b border-white/5">
                                  <TableHead className="text-zinc-400 font-bold">Member</TableHead>
                                  <TableHead className="text-zinc-400 font-bold">Leave Date</TableHead>
                                  <TableHead className="text-zinc-400 font-bold">Reason</TableHead>
                                  <TableHead className="text-zinc-400 font-bold text-center">Status</TableHead>
                                  <TableHead className="text-zinc-400 font-bold">Reviewed By</TableHead>
                                  <TableHead className="text-zinc-400 font-bold">Reviewed At</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {leaveRequests.filter(r => r.status !== 'Pending').length === 0 ? (
                                  <TableRow>
                                    <TableCell colSpan={6} className="text-center text-zinc-500 py-6">
                                      No historical requests recorded.
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  leaveRequests
                                    .filter(r => r.status !== 'Pending')
                                    .map((request) => {
                                      const reviewerName = request.reviewedBy === user?.id 
                                        ? user?.name 
                                        : 'Admin';
                                      return (
                                        <TableRow key={request.id} className="border-b border-white/5 hover:bg-white/5">
                                          <TableCell>
                                            <div>
                                              <p className="font-bold text-white">{request.userName}</p>
                                              <p className="text-xxs text-zinc-500 mt-0.5">
                                                Sub: {new Date(request.createdAt).toLocaleDateString()}
                                              </p>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-zinc-300 font-semibold">
                                            {new Date(request.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                          </TableCell>
                                          <TableCell className="max-w-xs truncate text-zinc-400 italic" title={request.reason}>
                                            "{request.reason}"
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <Badge 
                                              className={
                                                request.status === 'Approved'
                                                  ? "badge-modern bg-green-500/10 text-green-400 border-green-500/30"
                                                  : "badge-modern bg-red-500/10 text-red-400 border-red-500/30"
                                              }
                                            >
                                              {request.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="text-zinc-400">{reviewerName}</TableCell>
                                          <TableCell className="text-zinc-500 text-xs">
                                            {request.reviewedAt ? new Date(request.reviewedAt).toLocaleDateString() : 'N/A'}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })
                                )}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
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

