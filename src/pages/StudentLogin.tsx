import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarcodeScanner } from '@/components/BarcodeScanner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);

  const handleScan = async (studentId: string) => {
    try {
      // Here you would validate the student and send to attender for approval
      toast.success(`Student ID ${studentId} scanned! Waiting for approval...`);
      
      // Simulate approval process - in real app, this would be handled by attender
      setTimeout(() => {
        navigate('/student/dashboard', { state: { studentId } });
      }, 2000);
    } catch (error) {
      toast.error("Failed to process student ID");
      console.error(error);
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
          <p className="text-muted-foreground">Student Access Portal</p>
        </div>

        {!showScanner ? (
          <Card className="glass-card border-primary/20">
            <CardHeader>
              <CardTitle>Welcome Student</CardTitle>
              <CardDescription>
                Scan your student ID barcode to access your assigned socket
              </CardDescription>
            </CardHeader>
            <CardContent>
              <button
                onClick={() => setShowScanner(true)}
                className="w-full p-8 rounded-xl border-2 border-dashed border-primary/40 hover:border-primary/60 hover:bg-primary/5 transition-all group"
              >
                <Zap className="w-12 h-12 mx-auto mb-3 text-primary group-hover:scale-110 transition-transform" />
                <p className="font-semibold text-lg">Tap to Scan Barcode</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Position your student ID in front of camera
                </p>
              </button>
            </CardContent>
          </Card>
        ) : (
          <BarcodeScanner onScan={handleScan} onClose={() => setShowScanner(false)} />
        )}
      </div>
    </div>
  );
};

export default StudentLogin;
