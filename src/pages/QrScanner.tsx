import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  QrCode,
  Camera,
  Download,
  Printer,
  CheckCircle2,
  XCircle,
  Users,
  Scan,
  ZapIcon,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { isRemovedMember } from '@/lib/removedMembers';
import Layout from '@/components/Layout';
import { Html5Qrcode } from 'html5-qrcode';
import QRCode from 'qrcode';
import { format } from 'date-fns';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  designation?: string;
}

interface ScanResult {
  memberName: string;
  memberId: string;
  timestamp: string;
  success: boolean;
  message: string;
}

// ─── QR Generator Card ───────────────────────────────────────────────────────
const MemberQrCard = ({ member }: { member: TeamMember }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    const generate = async () => {
      try {
        const payload = JSON.stringify({ userId: member.id, name: member.name });
        const url = await QRCode.toDataURL(payload, {
          width: 220,
          margin: 2,
          color: { dark: '#ffffff', light: '#09090b' },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(url);
        if (canvasRef.current) {
          await QRCode.toCanvas(canvasRef.current, payload, {
            width: 220,
            margin: 2,
            color: { dark: '#ffffff', light: '#09090b' },
          });
        }
      } catch (err) {
        console.error('QR generation error:', err);
      }
    };
    generate();
  }, [member.id, member.name]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${member.name.replace(/\s+/g, '_').toLowerCase()}_qr.png`;
    a.click();
  };

  return (
    <Card className="glass-panel border-white/5 shadow-2xl hover:border-energy/30 hover:scale-[1.02] transition-all duration-300 group">
      <CardContent className="p-5 flex flex-col items-center gap-3">
        {/* QR Code */}
        <div className="w-[120px] h-[120px] rounded-xl overflow-hidden border border-white/10 bg-zinc-950 flex items-center justify-center">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt={`QR for ${member.name}`} className="w-full h-full object-cover" />
          ) : (
            <div className="animate-spin w-6 h-6 border-2 border-energy border-t-transparent rounded-full" />
          )}
        </div>
        {/* Info */}
        <div className="text-center">
          <p className="font-bold text-white text-sm truncate max-w-[140px]">{member.name}</p>
          <p className="text-xs text-zinc-500 truncate max-w-[140px]">
            {member.designation || 'Team Member'}
          </p>
        </div>
        {/* Download */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleDownload}
          disabled={!qrDataUrl}
          className="w-full border-white/10 bg-zinc-900/50 hover:bg-energy/10 hover:border-energy/40 text-white hover:text-energy text-xs font-semibold transition-all"
        >
          <Download className="w-3 h-3 mr-1.5" />
          Download
        </Button>
      </CardContent>
    </Card>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const QrScanner = () => {
  const { user } = useAuth();

  // Members state
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isMembersLoading, setIsMembersLoading] = useState(true);

  // Scanner state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResults, setScanResults] = useState<ScanResult[]>([]);
  const [lastScan, setLastScan] = useState<ScanResult | null>(null);
  const [flashState, setFlashState] = useState<'idle' | 'success' | 'error'>('idle');
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const lastScannedId = useRef<string | null>(null);
  const cooldownRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Print all QR codes
  const [isPrintLoading, setIsPrintLoading] = useState(false);

  // Load team members
  useEffect(() => {
    loadTeamMembers();
  }, []);

  // Cleanup scanner on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (cooldownRef.current) clearTimeout(cooldownRef.current);
    };
  }, []);

  const loadTeamMembers = async () => {
    try {
      setIsMembersLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('id, name, email, designation')
        .eq('role', 'user')
        .order('name');

      if (error) {
        console.error('Error loading members:', error);
        toast.error('Failed to load team members');
        return;
      }
      setTeamMembers((data || []).filter(m => !isRemovedMember(m)));
    } catch (err) {
      console.error('Error loading members:', err);
    } finally {
      setIsMembersLoading(false);
    }
  };

  const stopCamera = useCallback(async () => {
    try {
      if (scannerRef.current) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
      }
    } catch (_) {}
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    try {
      if (scannerRef.current) await stopCamera();

      const scanner = new Html5Qrcode('qr-reader');
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 260, height: 260 } },
        onScanSuccess,
        () => {} // ignore errors (frame decode failures)
      );
      setIsCameraActive(true);
    } catch (err: any) {
      console.error('Camera start error:', err);
      toast.error('Could not access camera. Please allow camera permissions and try again.');
    }
  }, []);

  const onScanSuccess = useCallback(
    async (decodedText: string) => {
      // Cooldown: ignore repeated scans of same code within 3 seconds
      if (lastScannedId.current === decodedText) return;
      lastScannedId.current = decodedText;
      cooldownRef.current = setTimeout(() => {
        lastScannedId.current = null;
      }, 3000);

      if (isProcessing) return;
      setIsProcessing(true);

      try {
        // Parse payload: { userId, name }
        let userId: string;
        let memberName: string;

        try {
          const payload = JSON.parse(decodedText);
          userId = payload.userId;
          memberName = payload.name;
        } catch {
          // Fallback: treat raw text as userId
          userId = decodedText;
          memberName = '';
        }

        if (!userId) {
          throw new Error('Invalid QR code — no user ID found');
        }

        const today = format(new Date(), 'yyyy-MM-dd');

        // Fetch member info from DB to validate
        const { data: memberData, error: memberError } = await supabase
          .from('users')
          .select('id, name, email')
          .eq('id', userId)
          .single();

        if (memberError || !memberData) {
          setFlashState('error');
          const result: ScanResult = {
            memberName: memberName || 'Unknown',
            memberId: userId,
            timestamp: format(new Date(), 'HH:mm:ss'),
            success: false,
            message: 'Member not found in database',
          };
          setLastScan(result);
          setScanResults(prev => [result, ...prev.slice(0, 19)]);
          toast.error('❌ Member not found in database');
          setTimeout(() => setFlashState('idle'), 1500);
          return;
        }

        const resolvedName = memberData.name;

        // Check for duplicate attendance today
        const { data: existing, error: checkError } = await supabase
          .from('attendance_records')
          .select('id, status')
          .eq('user_id', userId)
          .eq('date', today)
          .maybeSingle();

        if (existing) {
          setFlashState('error');
          const result: ScanResult = {
            memberName: resolvedName,
            memberId: userId,
            timestamp: format(new Date(), 'HH:mm:ss'),
            success: false,
            message: `Already marked ${existing.status} today`,
          };
          setLastScan(result);
          setScanResults(prev => [result, ...prev.slice(0, 19)]);
          toast.warning(`⚠️ ${resolvedName} already marked ${existing.status} today`);
          setTimeout(() => setFlashState('idle'), 1500);
          return;
        }

        // Insert attendance record
        const { error: insertError } = await supabase.from('attendance_records').insert([
          {
            user_id: userId,
            user_name: resolvedName,
            date: today,
            status: 'present',
            created_by: user?.id || '',
          },
        ]);

        if (insertError) {
          throw new Error(insertError.message);
        }

        setFlashState('success');
        const result: ScanResult = {
          memberName: resolvedName,
          memberId: userId,
          timestamp: format(new Date(), 'HH:mm:ss'),
          success: true,
          message: `Marked present for ${format(new Date(), 'MMM dd, yyyy')}`,
        };
        setLastScan(result);
        setScanResults(prev => [result, ...prev.slice(0, 19)]);
        toast.success(`✅ ${resolvedName} marked present!`);
        setTimeout(() => setFlashState('idle'), 1500);
      } catch (err: any) {
        setFlashState('error');
        const result: ScanResult = {
          memberName: 'Unknown',
          memberId: '',
          timestamp: format(new Date(), 'HH:mm:ss'),
          success: false,
          message: err.message || 'Scan failed',
        };
        setLastScan(result);
        setScanResults(prev => [result, ...prev.slice(0, 19)]);
        toast.error(`❌ Scan failed: ${err.message}`);
        setTimeout(() => setFlashState('idle'), 1500);
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing, user]
  );

  const handlePrintAll = async () => {
    setIsPrintLoading(true);
    try {
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        toast.error('Pop-up blocked. Please allow pop-ups for this site.');
        return;
      }

      // Generate QR data URLs for all members
      const qrImages: { name: string; designation: string; dataUrl: string }[] = [];
      for (const member of teamMembers) {
        const payload = JSON.stringify({ userId: member.id, name: member.name });
        const dataUrl = await QRCode.toDataURL(payload, {
          width: 200,
          margin: 2,
          color: { dark: '#000000', light: '#ffffff' },
          errorCorrectionLevel: 'H',
        });
        qrImages.push({ name: member.name, designation: member.designation || 'Team Member', dataUrl });
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>AutoArchitects – QR Attendance Cards</title>
            <style>
              * { box-sizing: border-box; margin: 0; padding: 0; }
              body { font-family: 'Segoe UI', sans-serif; background: #fff; padding: 20px; }
              h1 { text-align: center; font-size: 18px; margin-bottom: 20px; color: #111; }
              .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
              .card { border: 1.5px solid #ddd; border-radius: 10px; padding: 14px; text-align: center; page-break-inside: avoid; }
              .card img { width: 140px; height: 140px; display: block; margin: 0 auto 8px; }
              .name { font-weight: 700; font-size: 13px; color: #111; }
              .role { font-size: 11px; color: #555; margin-top: 2px; }
              @media print { body { padding: 10px; } }
            </style>
          </head>
          <body>
            <h1>AutoArchitects ATV Club — Attendance QR Cards</h1>
            <div class="grid">
              ${qrImages
                .map(
                  m => `
                <div class="card">
                  <img src="${m.dataUrl}" alt="${m.name}" />
                  <div class="name">${m.name}</div>
                  <div class="role">${m.designation}</div>
                </div>`
                )
                .join('')}
            </div>
            <script>window.onload = () => window.print();<\/script>
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (err) {
      console.error('Print error:', err);
      toast.error('Failed to generate print sheet');
    } finally {
      setIsPrintLoading(false);
    }
  };

  // ─── Flash overlay colours ──────────────────────────────────────────────
  const flashStyle =
    flashState === 'success'
      ? 'ring-4 ring-green-400 ring-offset-2 ring-offset-zinc-950'
      : flashState === 'error'
      ? 'ring-4 ring-red-500 ring-offset-2 ring-offset-zinc-950'
      : '';

  return (
    <Layout>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-background opacity-10 pointer-events-none" />

        {/* Header */}
        <section className="hero-gradient py-12 text-white relative border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-energy/10 border border-energy/30 text-energy text-xs font-bold uppercase tracking-widest rounded-md mb-2">
                  Telemetry Management
                </span>
                <h1 className="font-display font-black text-4xl uppercase tracking-tight mb-2">
                  QR Attendance
                </h1>
                <p className="text-zinc-300">
                  Scan member QR codes to instantly record attendance
                </p>
              </div>
              <QrCode className="w-12 h-12 text-energy animate-pulse" />
            </div>
          </div>
        </section>

        {/* Today badge */}
        <div className="bg-zinc-950 border-b border-white/5 py-3 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-3">
            <ZapIcon className="w-4 h-4 text-energy" />
            <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Session date:
            </span>
            <Badge className="bg-energy/10 text-energy border-energy/30 font-bold text-xs">
              {format(new Date(), 'EEEE, MMMM dd, yyyy')}
            </Badge>
            <span className="ml-auto text-xs text-zinc-600">
              {scanResults.filter(r => r.success).length} scanned this session
            </span>
          </div>
        </div>

        {/* Main content */}
        <section className="py-8 relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Tabs defaultValue="scanner" className="space-y-6">
              <TabsList className="bg-zinc-900/80 border border-white/5 p-1">
                <TabsTrigger
                  value="scanner"
                  className="data-[state=active]:bg-energy data-[state=active]:text-white font-bold uppercase tracking-wider text-xs px-6"
                >
                  <Camera className="w-4 h-4 mr-2" />
                  Scan Attendance
                </TabsTrigger>
                <TabsTrigger
                  value="generate"
                  className="data-[state=active]:bg-energy data-[state=active]:text-white font-bold uppercase tracking-wider text-xs px-6"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Codes
                </TabsTrigger>
              </TabsList>

              {/* ── Scanner Tab ─────────────────────────────────────────────── */}
              <TabsContent value="scanner">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Camera view */}
                  <div className="lg:col-span-3 space-y-4">
                    <Card className="glass-panel border-white/5 shadow-2xl overflow-hidden">
                      <CardHeader className="border-b border-white/5 pb-4">
                        <CardTitle className="font-display font-black text-xl text-white uppercase tracking-tight flex items-center gap-2">
                          <Scan className="w-5 h-5 text-energy" />
                          Camera Scanner
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* Scanner viewport */}
                        <div
                          className={`relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden bg-zinc-950 border border-white/10 transition-all duration-300 ${flashStyle}`}
                        >
                          {/* html5-qrcode mounts here */}
                          <div
                            id="qr-reader"
                            className="w-full h-full [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_img]:hidden [&_button]:hidden [&_select]:hidden [&_span]:hidden [&_p]:hidden"
                          />

                          {/* Overlay when camera is off */}
                          {!isCameraActive && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950/90 gap-3">
                              <Camera className="w-16 h-16 text-zinc-700" />
                              <p className="text-zinc-500 font-medium text-sm">Camera is off</p>
                            </div>
                          )}

                          {/* Corner scan decorators */}
                          {isCameraActive && (
                            <>
                              <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-energy rounded-tl-lg pointer-events-none" />
                              <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-energy rounded-tr-lg pointer-events-none" />
                              <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-energy rounded-bl-lg pointer-events-none" />
                              <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-energy rounded-br-lg pointer-events-none" />
                              {/* Scanning line animation */}
                              <div className="absolute left-6 right-6 h-0.5 bg-energy/70 animate-bounce top-1/2 pointer-events-none shadow-[0_0_8px_2px_rgba(230,73,0,0.5)]" />
                            </>
                          )}

                          {/* Processing spinner */}
                          {isProcessing && (
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                              <div className="animate-spin w-10 h-10 border-4 border-energy border-t-transparent rounded-full" />
                            </div>
                          )}

                          {/* Flash result overlay */}
                          {flashState !== 'idle' && (
                            <div
                              className={`absolute inset-0 flex flex-col items-center justify-center gap-2 transition-opacity duration-300 ${
                                flashState === 'success'
                                  ? 'bg-green-500/20'
                                  : 'bg-red-500/20'
                              }`}
                            >
                              {flashState === 'success' ? (
                                <CheckCircle2 className="w-16 h-16 text-green-400 drop-shadow-lg" />
                              ) : (
                                <XCircle className="w-16 h-16 text-red-400 drop-shadow-lg" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Camera controls */}
                        <div className="flex gap-3 mt-5 justify-center">
                          {!isCameraActive ? (
                            <Button
                              onClick={startCamera}
                              className="bg-energy hover:bg-energy-light text-white font-bold px-8 hover:shadow-glow transition-all duration-300 hover:scale-[1.03]"
                            >
                              <Camera className="w-4 h-4 mr-2" />
                              Start Camera
                            </Button>
                          ) : (
                            <Button
                              onClick={stopCamera}
                              variant="outline"
                              className="border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold px-8"
                            >
                              <XCircle className="w-4 h-4 mr-2" />
                              Stop Camera
                            </Button>
                          )}
                        </div>

                        {/* Last scan result */}
                        {lastScan && (
                          <div
                            className={`mt-5 p-4 rounded-xl border flex items-start gap-3 transition-all duration-300 ${
                              lastScan.success
                                ? 'bg-green-500/5 border-green-500/20'
                                : 'bg-red-500/5 border-red-500/20'
                            }`}
                          >
                            {lastScan.success ? (
                              <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <p className={`font-bold text-sm ${lastScan.success ? 'text-green-400' : 'text-red-400'}`}>
                                {lastScan.memberName}
                              </p>
                              <p className="text-xs text-zinc-400">{lastScan.message}</p>
                              <p className="text-xs text-zinc-600 mt-0.5">{lastScan.timestamp}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Scan log */}
                  <div className="lg:col-span-2">
                    <Card className="glass-panel border-white/5 shadow-2xl h-full">
                      <CardHeader className="border-b border-white/5 pb-4 flex flex-row items-center justify-between">
                        <CardTitle className="font-display font-black text-lg text-white uppercase tracking-tight">
                          Session Log
                        </CardTitle>
                        {scanResults.length > 0 && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => { setScanResults([]); setLastScan(null); }}
                            className="text-zinc-500 hover:text-white text-xs"
                          >
                            <RefreshCw className="w-3 h-3 mr-1" />
                            Clear
                          </Button>
                        )}
                      </CardHeader>
                      <CardContent className="p-4 max-h-[480px] overflow-y-auto space-y-2">
                        {scanResults.length === 0 ? (
                          <div className="text-center py-12 text-zinc-600">
                            <Scan className="w-10 h-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">No scans yet</p>
                            <p className="text-xs mt-1">Start camera and scan a QR code</p>
                          </div>
                        ) : (
                          scanResults.map((r, i) => (
                            <div
                              key={i}
                              className={`flex items-center gap-3 p-3 rounded-lg border text-sm ${
                                r.success
                                  ? 'bg-green-500/5 border-green-500/15'
                                  : 'bg-red-500/5 border-red-500/15'
                              }`}
                            >
                              {r.success ? (
                                <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400 shrink-0" />
                              )}
                              <div className="flex-1 min-w-0">
                                <p className="font-bold text-white truncate text-xs">{r.memberName}</p>
                                <p className="text-zinc-500 text-xs truncate">{r.message}</p>
                              </div>
                              <span className="text-zinc-600 text-xs shrink-0">{r.timestamp}</span>
                            </div>
                          ))
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* ── Generate Tab ─────────────────────────────────────────────── */}
              <TabsContent value="generate">
                <Card className="glass-panel border-white/5 shadow-2xl mb-6">
                  <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white text-sm">Print All QR Cards</p>
                      <p className="text-zinc-400 text-xs mt-0.5">
                        Opens a printable sheet with all {teamMembers.length} member QR codes
                      </p>
                    </div>
                    <Button
                      onClick={handlePrintAll}
                      disabled={isPrintLoading || teamMembers.length === 0}
                      className="bg-energy hover:bg-energy-light text-white font-bold px-6 hover:shadow-glow transition-all duration-300 shrink-0"
                    >
                      {isPrintLoading ? (
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                      ) : (
                        <Printer className="w-4 h-4 mr-2" />
                      )}
                      {isPrintLoading ? 'Generating...' : 'Print All'}
                    </Button>
                  </CardContent>
                </Card>

                {isMembersLoading ? (
                  <div className="text-center py-20">
                    <div className="relative inline-block mb-4">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-energy/20" />
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-energy border-t-transparent absolute top-0 left-0" />
                    </div>
                    <p className="text-zinc-400">Loading team members…</p>
                  </div>
                ) : teamMembers.length === 0 ? (
                  <div className="text-center py-20 text-zinc-600">
                    <Users className="w-12 h-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg font-medium text-white">No members found</p>
                    <p className="text-sm mt-2">
                      Add team members in the Admin Dashboard first
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {teamMembers.map(member => (
                      <MemberQrCard key={member.id} member={member} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default QrScanner;
