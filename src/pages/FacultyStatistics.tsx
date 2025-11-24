import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Clock, TrendingUp, Users } from 'lucide-react';
import { ref, onValue } from 'firebase/database';
import { database } from '@/lib/firebase';

const FacultyStatistics = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    energyToday: 0,
    activeSessions: 0,
    energySaved: 0,
    totalStudents: 0
  });

  useEffect(() => {
    // Listen to statistics from Firebase
    const statsRef = ref(database, 'statistics');
    const unsubscribe = onValue(statsRef, (snapshot) => {
      if (snapshot.exists()) {
        setStats(snapshot.val());
      }
    });

    // Count active sessions from sockets
    const socketsRef = ref(database, 'sockets');
    const socketsUnsubscribe = onValue(socketsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const activeCount = Object.values(data).filter(
          (socket: any) => socket.status === 'ON'
        ).length;
        setStats(prev => ({ ...prev, activeSessions: activeCount }));
      }
    });

    // Count total students from slot history
    const historyRef = ref(database, 'slot_history');
    const historyUnsubscribe = onValue(historyRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const uniqueStudents = new Set(
          Object.values(data).map((entry: any) => entry.studentId)
        );
        setStats(prev => ({ ...prev, totalStudents: uniqueStudents.size }));
      }
    });

    return () => {
      unsubscribe();
      socketsUnsubscribe();
      historyUnsubscribe();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/dashboard')} variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Lab Statistics</h1>
            <p className="text-muted-foreground">Energy usage and performance metrics</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Zap className="h-4 w-4 text-primary" />
                Energy Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.energyToday.toFixed(1)} kWh</p>
              <p className="text-sm text-muted-foreground mt-1">Real-time from Firebase</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-secondary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4 text-secondary" />
                Active Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.activeSessions}</p>
              <p className="text-sm text-muted-foreground mt-1">Currently in use</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <TrendingUp className="h-4 w-4 text-success" />
                Energy Saved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.energySaved}%</p>
              <p className="text-sm text-muted-foreground mt-1">vs. last month</p>
            </CardContent>
          </Card>

          <Card className="glass-card border-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4 text-accent" />
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalStudents}</p>
              <p className="text-sm text-muted-foreground mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Weekly Energy Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart placeholder - Integrate with Chart.js or Recharts
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Batch-wise Usage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Chart placeholder - Integrate with Chart.js or Recharts
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FacultyStatistics;
