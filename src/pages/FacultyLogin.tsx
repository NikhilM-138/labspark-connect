import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Zap, Mail, Lock, KeyRound } from 'lucide-react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, DEMO_MODE } from '@/lib/firebase';
import { toast } from 'sonner';

const FacultyLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    otp: ''
  });

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (DEMO_MODE) {
        // Demo mode - allow any email/password
        toast.success("Login successful! (Demo Mode)");
        navigate('/faculty/dashboard');
      } else {
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
        toast.success("Login successful!");
        navigate('/faculty/dashboard');
      }
    } catch (error: any) {
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement OTP login logic
    toast.info("OTP login coming soon!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-2xl bg-primary/10 animate-pulse-glow">
              <Zap className="w-12 h-12 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            IoT Lab Monitor
          </h1>
          <p className="text-muted-foreground">Faculty Access Portal</p>
        </div>

        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Faculty Login</CardTitle>
            <CardDescription>Access the lab monitoring dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="otp">OTP</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="faculty@university.edu"
                        className="pl-10"
                        value={credentials.email}
                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
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

                  <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                    {loading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="otp">
                <form onSubmit={handleOTPLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otp">OTP</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit OTP"
                        className="pl-10"
                        maxLength={6}
                        value={credentials.otp}
                        onChange={(e) => setCredentials({ ...credentials, otp: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button type="submit" className="w-full gradient-primary" disabled={loading}>
                    Verify OTP
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacultyLogin;
