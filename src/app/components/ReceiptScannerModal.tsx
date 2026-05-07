import { useState, useEffect, useRef } from 'react';
import { X, Camera, ScanLine, CheckCircle2 } from 'lucide-react';

interface ReceiptScannerModalProps {
  onClose: () => void;
  onScanComplete: (data: { category: string; description: string; amount: number; type: 'expense' | 'income' }) => void;
}

export function ReceiptScannerModal({ onClose, onScanComplete }: ReceiptScannerModalProps) {
  const [step, setStep] = useState<'camera' | 'scanning' | 'done'>('camera');
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Stop camera stream
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  useEffect(() => {
    // Start camera when on camera step
    if (step === 'camera') {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing camera:", err);
          // If accessing camera fails, silently fallback to mock ui or alert
        });
    }

    return () => {
      stopCamera();
    };
  }, [step]);

  useEffect(() => {
    if (step === 'scanning') {
      const timer = setTimeout(() => {
        setStep('done');
      }, 2500);
      return () => clearTimeout(timer);
    }
    
    if (step === 'done') {
      const timer = setTimeout(() => {
        // Mock scanned data
        onScanComplete({
          category: 'Food',
          description: 'Jollibee Receipt',
          amount: 350,
          type: 'expense'
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [step, onScanComplete]);

  const handleCapture = () => {
    // Stop the camera feed before moving to scanning step
    stopCamera();
    setStep('scanning');
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-['Press_Start_2P'] text-sm text-white">
            RECEIPT SCANNER
          </h2>
          <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors">
            <X size={28} />
          </button>
        </div>

        {step === 'camera' && (
          <div className="space-y-8 flex flex-col items-center">
            <div className="relative w-full aspect-[3/4] border-4 border-dashed border-[#8D6E63] rounded-3xl flex items-center justify-center bg-black overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                <Camera size={100} className="text-white" />
              </div>
              <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/80 to-transparent pt-12 pb-6 px-4">
                <p className="text-white/80 font-['Press_Start_2P'] text-[10px] text-center drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
                  ALIGN RECEIPT WITHIN FRAME
                </p>
              </div>
            </div>
            <button
              onClick={handleCapture}
              className="w-20 h-20 bg-white rounded-full border-8 border-gray-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
            >
              <div className="w-16 h-16 bg-white rounded-full border-2 border-gray-400" />
            </button>
          </div>
        )}

        {step === 'scanning' && (
          <div className="flex flex-col items-center justify-center h-96 space-y-8">
            <div className="relative">
              <ScanLine size={64} className="text-[#FFD966] animate-pulse" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FFD966]/50 to-transparent h-2 w-full animate-[scan_2s_ease-in-out_infinite]" />
            </div>
            <p className="font-['Press_Start_2P'] text-[10px] text-[#FFD966] animate-pulse">
              ANALYZING RECEIPT...
            </p>
          </div>
        )}

        {step === 'done' && (
          <div className="flex flex-col items-center justify-center h-96 space-y-6">
            <CheckCircle2 size={80} className="text-[#81C784] animate-bounce" />
            <div className="text-center space-y-2">
              <p className="font-['Press_Start_2P'] text-[12px] text-[#81C784]">
                SUCCESS!
              </p>
              <p className="text-xs text-white/80">
                Receipt logged successfully.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
