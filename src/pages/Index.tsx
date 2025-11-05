import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, GraduationCap, Users, UserCog } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const roles = [
    {
      title: 'Student',
      description: 'Scan barcode to access your assigned socket',
      icon: GraduationCap,
      path: '/student',
      gradient: 'from-primary to-primary/70'
    },
    {
      title: 'Faculty',
      description: 'Monitor and control lab sockets in real-time',
      icon: Users,
      path: '/faculty',
      gradient: 'from-secondary to-secondary/70'
    },
    {
      title: 'Attender',
      description: 'Manage student approvals and slot assignments',
      icon: UserCog,
      path: '/attender',
      gradient: 'from-accent to-accent/70'
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="p-4 rounded-2xl bg-primary/10 animate-pulse-glow">
              <Zap className="w-16 h-16 text-primary" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            IoT Lab Monitor
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring and control system for laboratory socket management
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.path}
                onClick={() => navigate(role.path)}
                className="glass-card border-primary/20 hover:border-primary/40 cursor-pointer transition-all hover:scale-105 hover:shadow-xl group"
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.gradient} p-2.5 mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary font-medium">
                    Click to access →
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Index;
