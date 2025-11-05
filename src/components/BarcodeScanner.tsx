import { useState, useEffect, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface BarcodeScannerProps {
  onScan: (data: string) => void;
  onClose?: () => void;
}

export const BarcodeScanner = ({ onScan, onClose }: BarcodeScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

  useEffect(() => {
    if (scanning) {
      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        preferredCamera: { facingMode: "environment" } // Use back camera
      };

      scannerRef.current = new Html5QrcodeScanner("barcode-reader", config, false);
      
      scannerRef.current.render(
        (decodedText) => {
          toast.success("Barcode scanned successfully!");
          onScan(decodedText);
          stopScanning();
        },
        (error) => {
          // Suppress errors during scanning
          console.log(error);
        }
      );
    }

    return () => {
      stopScanning();
    };
  }, [scanning]);

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.clear();
      scannerRef.current = null;
    }
    setScanning(false);
  };

  const startScanning = async () => {
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } 
      });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      setScanning(true);
      toast.info("Camera access granted. Position barcode in the frame.");
    } catch (error) {
      toast.error("Camera permission denied. Please allow camera access.");
      console.error("Camera error:", error);
    }
  };

  if (!scanning) {
    return (
      <Card className="p-8 text-center space-y-4 glass-card">
        <Camera className="w-16 h-16 mx-auto text-primary" />
        <h3 className="text-xl font-semibold">Scan Student Barcode</h3>
        <p className="text-muted-foreground">
          Click below to activate your camera and scan the student ID barcode
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={startScanning} size="lg" className="gradient-primary">
            <Camera className="mr-2 h-5 w-5" />
            Start Scanner
          </Button>
          {onClose && (
            <Button onClick={onClose} variant="outline" size="lg">
              Cancel
            </Button>
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 space-y-4 glass-card">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Scanning...</h3>
        <Button onClick={stopScanning} variant="ghost" size="icon">
          <XCircle className="h-5 w-5" />
        </Button>
      </div>
      <div id="barcode-reader" className="rounded-lg overflow-hidden"></div>
      <p className="text-sm text-muted-foreground text-center">
        Position the barcode within the frame
      </p>
    </Card>
  );
};
