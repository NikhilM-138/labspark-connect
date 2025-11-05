import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Zap, Clock, TrendingUp, Users } from 'lucide-react';

const FacultyStatistics = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button onClick={() => navigate('/faculty')} variant="outline" size="icon">
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
              <p className="text-3xl font-bold">42.5 kWh</p>
              <p className="text-sm text-muted-foreground mt-1">↑ 12% from yesterday</p>
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
              <p className="text-3xl font-bold">8</p>
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
              <p className="text-3xl font-bold">18%</p>
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
              <p className="text-3xl font-bold">156</p>
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
