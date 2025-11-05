import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Power, Thermometer, Activity, Clock, LogOut } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { database, DEMO_MODE } from '@/lib/firebase';
import { getSocketData, type SocketData } from '@/lib/mockData';
import { toast } from 'sonner';

const StudentDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const studentId = location.state?.studentId || '4NI23EC065';
  
  const [socketData, setSocketData] = useState<SocketData>({
    socket_id: 'S1',
    student: studentId,
    voltage: '0V',
    current: '0A',
    temperature: '0°C',
    status: 'OFF',
    power: '0W'
  });
  
  const [sessionStart, setSessionStart] = useState(new Date());

  useEffect(() => {
    if (DEMO_MODE) {
      // Use mock data in demo mode
      const mockData = getSocketData('S1');
      setSocketData({ ...mockData, student: studentId });
      
      // Simulate real-time updates
      const interval = setInterval(() => {
        const updated = getSocketData('S1');
        setSocketData({ ...updated, student: studentId });
      }, 3000);
      
      return () => clearInterval(interval);
    }
    
    // Listen to real-time socket data from Firebase
    const socketRef = ref(database, `sockets/${socketData.socket_id}`);
    
    const unsubscribe = onValue(socketRef, (snapshot) => {
      if (snapshot.exists()) {
        setSocketData(snapshot.val());
      }
    });

    return () => unsubscribe();
  }, [socketData.socket_id]);

  const handleLogout = () => {
    toast.success("Logged out successfully. Socket disabled.");
    navigate('/student');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ON':
        return 'bg-success';
      case 'OFF':
        return 'bg-muted';
      default:
        return 'bg-destructive';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Student Dashboard</h1>
            <p className="text-muted-foreground">ID: {studentId}</p>
          </div>
          <Button onClick={handleLogout} variant="outline">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>

        {/* Socket Status */}
        <Card className="glass-card border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  Socket {socketData.socket_id}
                </CardTitle>
                <CardDescription>Your assigned workstation</CardDescription>
              </div>
              <Badge className={`${getStatusColor(socketData.status)} text-white px-4 py-2`}>
                {socketData.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <div className="flex items-center gap-2 text-primary mb-2">
                  <Zap className="h-5 w-5" />
                  <span className="text-sm font-medium">Voltage</span>
                </div>
                <p className="text-2xl font-bold">{socketData.voltage}</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-secondary/10 to-secondary/5 border border-secondary/20">
                <div className="flex items-center gap-2 text-secondary mb-2">
                  <Activity className="h-5 w-5" />
                  <span className="text-sm font-medium">Current</span>
                </div>
                <p className="text-2xl font-bold">{socketData.current}</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20">
                <div className="flex items-center gap-2 text-warning mb-2">
                  <Thermometer className="h-5 w-5" />
                  <span className="text-sm font-medium">Temperature</span>
                </div>
                <p className="text-2xl font-bold">{socketData.temperature}</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20">
                <div className="flex items-center gap-2 text-accent mb-2">
                  <Power className="h-5 w-5" />
                  <span className="text-sm font-medium">Power</span>
                </div>
                <p className="text-2xl font-bold">{socketData.power}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Session Info */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Session Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Session Started</span>
                <span className="text-sm">{sessionStart.toLocaleTimeString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                <span className="text-sm font-medium">Status</span>
                <Badge variant={socketData.status === 'ON' ? 'default' : 'secondary'}>
                  {socketData.status === 'ON' ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;
