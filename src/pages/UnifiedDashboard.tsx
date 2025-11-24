import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { 
  Zap, Power, Thermometer, Activity, AlertTriangle, 
  ExternalLink, BarChart3, PowerOff, ArrowLeft, Camera, Users 
} from 'lucide-react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '@/lib/firebase';
import { toast } from 'sonner';

const UnifiedDashboard = () => {
  const navigate = useNavigate();

  // Check authentication
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem('labControlAuth');
    if (!isAuthenticated) {
      navigate('/lab-control');
    }
  }, [navigate]);
  const [sockets, setSockets] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showScanner, setShowScanner] = useState(false);
  const [groupSize, setGroupSize] = useState<number>(1);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    // Listen to sockets from Firebase
    const socketsRef = ref(database, 'sockets');
    const unsubscribe = onValue(socketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const socketsArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setSockets(socketsArray);
      }
    });

    // Listen to slot history
    const historyRef = ref(database, 'slot_history');
    const historyUnsubscribe = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const historyArray = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        setHistory(historyArray);
      }
    });

    return () => {
      unsubscribe();
      historyUnsubscribe();
    };
  }, []);

  const handleScan = (studentId: string) => {
    toast.success(`Student ${studentId} scanned - Allocating slot...`);
    allocateSlot(studentId);
    setShowScanner(false);
  };

  const allocateSlot = async (studentId: string) => {
    try {
      const nextSlot = `S${history.length + 1}`;
      
      const newHistory = {
        id: Date.now().toString(),
        studentId,
        slot: nextSlot,
        timestamp: new Date().toISOString(),
        groupSize
      };
      
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

      toast.success(`Slot ${nextSlot} allocated to ${studentId}`);
    } catch (error) {
      toast.error("Failed to allocate slot");
    }
  };

  const toggleSocket = async (socketId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';
    try {
      await set(ref(database, `sockets/${socketId}/status`), newStatus);
      toast.success(`Socket ${socketId} turned ${newStatus}`);
    } catch (error) {
      toast.error("Failed to toggle socket");
    }
  };

  const disableAllSockets = async () => {
    try {
      for (const socket of sockets) {
        await set(ref(database, `sockets/${socket.id}/status`), 'OFF');
      }
      toast.success("All sockets disabled");
    } catch (error) {
      toast.error("Failed to disable sockets");
    }
  };

  const openEweLink = () => {
    window.open('ewelink://', '_blank');
    toast.info("Opening eWeLink app...");
  };

  const handleLogout = () => {
    sessionStorage.removeItem('labControlAuth');
    toast.success("Logged out successfully");
    navigate('/lab-control');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/')} variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Lab Control Dashboard</h1>
              <p className="text-muted-foreground">Real-time monitoring, control & student management</p>
            </div>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Button onClick={() => navigate('/faculty/statistics')} variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Statistics
            </Button>
            <Button onClick={openEweLink} variant="outline">
              <ExternalLink className="mr-2 h-4 w-4" />
              eWeLink
            </Button>
            <Button onClick={disableAllSockets} variant="destructive">
              <PowerOff className="mr-2 h-4 w-4" />
              Disable All
            </Button>
            <Button onClick={handleLogout} variant="secondary">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Scanner Section */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              Scan Student ID
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
                  Start Scanning
                </Button>
              </div>
            ) : (
              <BarcodeScanner 
                onScan={handleScan} 
                onClose={() => setShowScanner(false)}
                autoStart={true}
                validatePrefix="4NI"
              />
            )}
          </CardContent>
        </Card>

        {/* Alerts */}
        {alerts.length > 0 && (
          <Card className="border-warning/50 bg-warning/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                Active Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {alerts.map((alert, i) => (
                  <div key={i} className="p-3 rounded-lg bg-warning/10 border border-warning/20">
                    {alert.message}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sockets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sockets.map((socket) => (
            <Card key={socket.id} className="glass-card border-primary/20 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Socket {socket.id}
                  </CardTitle>
                  <Switch
                    checked={socket.status === 'ON'}
                    onCheckedChange={() => toggleSocket(socket.id, socket.status)}
                  />
                </div>
                <Badge variant={socket.status === 'ON' ? 'default' : 'secondary'}>
                  {socket.status}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Student:</span>
                    <span className="font-medium">{socket.student || 'Unassigned'}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-1 text-xs text-primary mb-1">
                        <Zap className="h-3 w-3" />
                        Voltage
                      </div>
                      <p className="text-sm font-bold">{socket.voltage}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-secondary/10 border border-secondary/20">
                      <div className="flex items-center gap-1 text-xs text-secondary mb-1">
                        <Activity className="h-3 w-3" />
                        Current
                      </div>
                      <p className="text-sm font-bold">{socket.current}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-warning/10 border border-warning/20">
                      <div className="flex items-center gap-1 text-xs text-warning mb-1">
                        <Thermometer className="h-3 w-3" />
                        Temp
                      </div>
                      <p className="text-sm font-bold">{socket.temperature}</p>
                    </div>
                    <div className="p-2 rounded-lg bg-accent/10 border border-accent/20">
                      <div className="flex items-center gap-1 text-xs text-accent mb-1">
                        <Power className="h-3 w-3" />
                        Power
                      </div>
                      <p className="text-sm font-bold">{socket.power || '0W'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Assignment History */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Slot Assignment History
            </CardTitle>
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

export default UnifiedDashboard;
