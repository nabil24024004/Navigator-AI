import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Mic, X, Image as ImageIcon, MicOff, AlertCircle, Info, RefreshCw } from 'lucide-react';

interface UploaderProps {
  onAnalyze: (image: string, context: string) => void;
  isAnalyzing: boolean;
}

const Uploader: React.FC<UploaderProps> = ({ onAnalyze, isAnalyzing }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);
  
  // Camera State
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const textInputRef = useRef<HTMLInputElement>(null);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    // Check for Chrome-like browser
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    if (!isChrome) {
      setShowBrowserWarning(true);
    }

    // Cleanup on unmount
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      stopCamera();
    };
  }, []);

  // Initialize camera when isOpen becomes true
  useEffect(() => {
    if (isCameraOpen) {
      startCameraStream();
    } else {
      stopCamera();
    }
  }, [isCameraOpen]);

  const startCameraStream = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setCameraError("Could not access camera. Please check permissions.");
      // Fallback: try to close and maybe warn user
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw video frame to canvas
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setImagePreview(dataUrl);
        setIsCameraOpen(false);
      }
    }
  };

  const startListening = () => {
    if (typeof window === 'undefined') return;
    
    // Type assertion for browser compatibility
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari.");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceError(null);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setContext((prev) => {
          const trimmed = prev.trim();
          return trimmed ? `${trimmed} ${transcript}` : transcript;
        });
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition status:', event.error);
        setIsListening(false);
        
        if (event.error === 'network') {
          setVoiceError("Voice recognition requires a strong internet connection. Please type your emergency instead.");
          // Focus the input so user can type immediately
          setTimeout(() => textInputRef.current?.focus(), 100);
        } else if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          setVoiceError("Microphone permission denied.");
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setVoiceError("Voice input failed. Please type instead.");
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.error("Failed to initialize speech recognition", e);
      setVoiceError("Could not start voice input.");
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = () => {
    if (imagePreview) {
      onAnalyze(imagePreview, context);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-fade-in flex flex-col items-center">
      
      {/* Camera Modal Overlay */}
      {isCameraOpen && (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col">
          {/* Main Viewfinder */}
          <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
             {cameraError ? (
                <div className="text-center p-6">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-white mb-4">{cameraError}</p>
                    <button 
                       onClick={() => setIsCameraOpen(false)}
                       className="px-6 py-2 bg-white/10 rounded-lg text-white"
                    >
                       Close
                    </button>
                </div>
             ) : (
                <video 
                   ref={videoRef} 
                   autoPlay 
                   playsInline 
                   muted
                   className="absolute min-w-full min-h-full object-cover"
                />
             )}
             <canvas ref={canvasRef} className="hidden" />
          </div>
          
          {/* Controls */}
          {!cameraError && (
             <div className="h-32 bg-gradient-to-t from-black via-black/80 to-transparent flex items-center justify-around px-8 pb-4 absolute bottom-0 left-0 right-0">
                 <button 
                   onClick={() => setIsCameraOpen(false)}
                   className="p-4 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors backdrop-blur-md"
                 >
                   <X className="w-6 h-6" />
                 </button>
                 
                 <button 
                   onClick={handleCapture}
                   className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center relative active:scale-95 transition-transform shadow-lg shadow-black/50"
                 >
                   <div className="w-16 h-16 bg-white rounded-full"></div>
                 </button>
                 
                 {/* Placeholder for symmetry or switch camera future feature */}
                 <div className="w-14"></div>
             </div>
          )}
        </div>
      )}

      {showBrowserWarning && (
        <div className="w-full mb-6 p-3 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center justify-center gap-2 text-blue-200 text-sm">
          <Info className="w-4 h-4 shrink-0" />
          <span>For best performance, use Google Chrome</span>
          <button onClick={() => setShowBrowserWarning(false)} className="ml-2 text-blue-400 hover:text-white"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="text-center mb-6 md:mb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Analyze Emergency</h1>
        <p className="text-gray-400 text-sm md:text-base">Upload an image and describe the situation for AI-powered analysis</p>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-5 md:p-10 mb-6 md:mb-8 shadow-2xl shadow-black/50">
        {/* Image Input Area */}
        <div className="relative group mb-6 md:mb-8">
          {!imagePreview ? (
            <div 
              className="w-full min-h-[340px] md:min-h-0 md:aspect-[2/1] rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-black/40 hover:bg-black/60 transition-all flex flex-col items-center justify-center p-6 md:p-8 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-4 md:mb-6 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)] shrink-0">
                <Upload className="w-8 h-8 md:w-10 md:h-10" />
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2 text-center">Upload Image or Video</h3>
              <p className="text-gray-500 text-xs md:text-sm mb-6 text-center max-w-[240px] md:max-w-none">Drag and drop or tap to browse</p>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button 
                  onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }} 
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto text-sm whitespace-nowrap"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} 
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors w-full sm:w-auto text-sm whitespace-nowrap"
                >
                  <ImageIcon className="w-4 h-4" />
                  Choose File
                </button>
              </div>
            </div>
          ) : (
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black group">
              <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
              <button 
                onClick={clearImage}
                className="absolute top-3 right-3 p-2 bg-black/60 hover:bg-red-500/80 rounded-full text-white backdrop-blur-md transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </div>

        {/* Context & Info footer inside card */}
        <div className="flex flex-wrap justify-center gap-4 text-[10px] md:text-xs text-gray-500 font-mono uppercase tracking-wider">
           <span className="flex items-center gap-1.5"><ImageIcon className="w-3 h-3" /> Images</span>
           <span className="flex items-center gap-1.5"><div className="w-3 h-3 border border-gray-500 rounded-sm flex items-center justify-center text-[8px]">▶</div> Videos</span>
           <span>Max 50MB</span>
        </div>
      </div>

      {/* Context Input with Voice to Text */}
      <div className="w-full max-w-xl mb-6 md:mb-8">
        <div className={`bg-black/40 border rounded-xl p-1.5 flex items-center transition-colors relative ${isListening ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
            <input 
              ref={textInputRef}
              type="text" 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={isListening ? "Listening..." : "Describe the situation (optional)..."}
              className="flex-1 bg-transparent border-none text-sm px-3 md:px-4 py-3 text-white placeholder-gray-600 focus:ring-0 focus:outline-none min-w-0"
            />
            <button 
                onClick={toggleListening}
                className={`p-3 rounded-lg transition-all shrink-0 ${isListening ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title={isListening ? "Stop listening" : "Start voice input"}
            >
                {isListening ? <MicOff className="w-5 h-5 animate-pulse" /> : <Mic className="w-5 h-5" />}
            </button>
        </div>
        {voiceError && (
            <div className="flex items-start gap-2 mt-3 text-red-400 text-xs px-2 animate-fade-in bg-red-900/10 p-2 rounded-lg border border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{voiceError}</span>
            </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleAnalyzeClick}
        disabled={!imagePreview || isAnalyzing}
        className={`w-full max-w-xl py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg transition-all active:scale-95 touch-manipulation
          ${!imagePreview || isAnalyzing 
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 md:hover:scale-[1.01]'
          }`}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ANALYZING...
          </div>
        ) : (
          "Start Analysis"
        )}
      </button>
    </div>
  );
};

export default Uploader;