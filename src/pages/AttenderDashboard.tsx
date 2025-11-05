import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { LogOut, Users, CheckCircle, XCircle, Camera } from 'lucide-react';
import { ref, onValue, set } from 'firebase/database';
import { database, DEMO_MODE } from '@/lib/firebase';
import { toast } from 'sonner';

interface PendingApproval {
  studentId: string;
  timestamp: Date;
  manualScan?: boolean;
}

const AttenderDashboard = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);
  const [groupSize, setGroupSize] = useState<number>(1);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    if (DEMO_MODE) {
      // Demo mode - use local state
      return;
    }
    
    // Load assignment history from Firebase
    const historyRef = ref(database, 'slot_history');
    const unsubscribe = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const historyArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setHistory(historyArray);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleScan = (studentId: string) => {
    // Manual scan bypasses approval
    toast.success(`Student ${studentId} scanned directly - No approval needed`);
    allocateSlot(studentId);
    setShowScanner(false);
  };

  const handleApproval = (studentId: string, approved: boolean) => {
    if (approved) {
      allocateSlot(studentId);
      toast.success(`Approved ${studentId}`);
    } else {
      toast.error(`Rejected ${studentId}`);
    }
    setPendingApprovals(prev => prev.filter(p => p.studentId !== studentId));
  };

  const allocateSlot = async (studentId: string) => {
    try {
      // Get next available slot based on ascending USN
      const nextSlot = `S${history.length + 1}`;
      
      const newHistory = {
        id: Date.now().toString(),
        studentId,
        slot: nextSlot,
        timestamp: new Date().toISOString(),
        groupSize
      };
      
      if (DEMO_MODE) {
        // Demo mode - update local state
        setHistory(prev => [...prev, newHistory]);
      } else {
        await set(ref(database, `sockets/${nextSlot}`), {
          socket_id: nextSlot,
          student: studentId,
          voltage: '0V',
          current: '0A',
          temperature: '0°C',
          status: 'OFF',
          power: '0W'
        });

        await set(ref(database, `slot_history/${Date.now()}`), newHistory);
      }

      toast.success(`Slot ${nextSlot} allocated to ${studentId}`);
    } catch (error) {
      toast.error("Failed to allocate slot");
    }
  };

  const handleLogout = () => {
    navigate('/attender');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Attender Dashboard</h1>
            <p className="text-muted-foreground">Student approval & slot management</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Scanner Section */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Manual Scan
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showScanner ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="groupSize">Group Size</Label>
                    <Input
                      id="groupSize"
                      type="number"
                      min="1"
                      value={groupSize}
                      onChange={(e) => setGroupSize(parseInt(e.target.value))}
                      className="mt-2"
                    />
                  </div>
                </div>
                <Button onClick={() => setShowScanner(true)} className="gradient-primary">
                  <Camera className="mr-2 h-4 w-4" />
                  Scan Student ID
                </Button>
              </div>
            ) : (
              <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
            )}
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-warning" />
              Pending Approvals ({pendingApprovals.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingApprovals.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending approvals</p>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((approval) => (
                  <div
                    key={approval.studentId}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card"
                  >
                    <div>
                      <p className="font-semibold">{approval.studentId}</p>
                      <p className="text-sm text-muted-foreground">
                        {approval.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-success border-success hover:bg-success/10"
                        onClick={() => handleApproval(approval.studentId, true)}
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive border-destructive hover:bg-destructive/10"
                        onClick={() => handleApproval(approval.studentId, false)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Assignment History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Slot Assignment History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No assignments yet</p>
              ) : (
                history.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div>
                      <p className="font-medium">{item.studentId}</p>
                      <p className="text-sm text-muted-foreground">
                        Group Size: {item.groupSize}
                      </p>
                    </div>
                    <Badge>{item.slot}</Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttenderDashboard;
