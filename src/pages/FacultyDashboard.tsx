import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Zap, Power, Thermometer, Activity, AlertTriangle, 
  ExternalLink, LogOut, BarChart3, PowerOff 
} from 'lucide-react';
import { ref, onValue, set } from 'firebase/database';
import { database, auth } from '@/lib/firebase';
import { toast } from 'sonner';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [sockets, setSockets] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Listen to all sockets
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

    return () => unsubscribe();
  }, []);

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

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/faculty');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Faculty Dashboard</h1>
            <p className="text-muted-foreground">Real-time lab monitoring & control</p>
          </div>
          <div className="flex gap-3">
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
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

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
      </div>
    </div>
  );
};

export default FacultyDashboard;
