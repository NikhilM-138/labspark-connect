import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Zap, User, Lock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const AttenderLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  // Default credentials for attender
  const DEFAULT_USERNAME = 'attender';
  const DEFAULT_PASSWORD = 'attender123';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (credentials.username === DEFAULT_USERNAME && credentials.password === DEFAULT_PASSWORD) {
        toast.success("Login successful!");
        navigate('/attender/dashboard');
      } else {
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-md space-y-6">
        <Button
          onClick={() => navigate('/')}
          variant="outline"
          size="sm"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 animate-pulse-glow">
              <Zap className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            IoT Lab Monitor
          </h1>
          <p className="text-muted-foreground">Attender Access Portal</p>
        </div>

        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Attender Login</CardTitle>
            <CardDescription>
              Manage student approvals and slot assignments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="attender"
                    className="pl-10"
                    value={credentials.username}
                    onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    className="pl-10"
                    value={credentials.password}
                    onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="p-3 rounded-lg bg-muted/50 text-sm">
                <p className="font-medium mb-1">Default Credentials:</p>
                <p className="text-muted-foreground">Username: attender</p>
                <p className="text-muted-foreground">Password: attender123</p>
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttenderLogin;
