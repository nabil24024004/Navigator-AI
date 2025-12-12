import React, { useRef, useState, useEffect } from 'react';
import { Camera, Upload, Mic, X, Image as ImageIcon, MicOff, AlertCircle } from 'lucide-react';

interface UploaderProps {
  onAnalyze: (image: string, context: string) => void;
  isAnalyzing: boolean;
}

const Uploader: React.FC<UploaderProps> = ({ onAnalyze, isAnalyzing }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Cleanup on unmount only
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

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
        // Log as warning instead of error to avoid cluttering console with expected network/no-speech issues
        console.warn('Speech recognition status:', event.error);
        
        setIsListening(false);
        
        switch (event.error) {
          case 'network':
            setVoiceError("Network error. Please check connection or try a different browser.");
            break;
          case 'not-allowed':
          case 'permission-denied':
            setVoiceError("Microphone permission denied.");
            break;
          case 'no-speech':
            // Don't show visible error for silence, just reset UI
            break;
          case 'aborted':
            // Intentional stop, no error
            break;
          default:
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
      
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Analyze Emergency</h1>
        <p className="text-gray-400">Upload an image and describe the situation for AI-powered analysis</p>
      </div>

      <div className="w-full bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-8">
        {/* Image Input Area */}
        <div className="relative group mb-8">
          {!imagePreview ? (
            <div 
              className="w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/50 bg-black/40 hover:bg-black/60 transition-all flex flex-col items-center justify-center p-6"
            >
              <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center mb-6 text-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <Upload className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold mb-2">Upload Image or Video</h3>
              <p className="text-gray-500 text-sm mb-8">Drag and drop or click to browse</p>
              
              <div className="flex gap-4">
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold flex items-center gap-2 transition-colors"
                >
                  <Camera className="w-4 h-4" />
                  Take Photo
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()} 
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl font-semibold flex items-center gap-2 transition-colors"
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
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-red-500/80 rounded-full text-white backdrop-blur-md transition-colors"
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
        <div className="flex justify-center gap-6 text-xs text-gray-500 font-mono uppercase tracking-wider">
           <span className="flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Images</span>
           <span className="flex items-center gap-2"><div className="w-3 h-3 border border-gray-500 rounded-sm flex items-center justify-center text-[8px]">▶</div> Videos</span>
           <span>Max 50MB</span>
        </div>
      </div>

      {/* Context Input with Voice to Text */}
      <div className="w-full max-w-xl mb-8">
        <div className={`bg-black/40 border rounded-xl p-1 flex items-center transition-colors relative ${isListening ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10'}`}>
            <input 
              type="text" 
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder={isListening ? "Listening..." : "Describe the situation (optional)..."}
              className="flex-1 bg-transparent border-none text-sm px-4 py-3 text-white placeholder-gray-600 focus:ring-0 focus:outline-none"
            />
            <button 
                onClick={toggleListening}
                className={`p-3 rounded-lg transition-all ${isListening ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                title={isListening ? "Stop listening" : "Start voice input"}
            >
                {isListening ? <MicOff className="w-4 h-4 animate-pulse" /> : <Mic className="w-4 h-4" />}
            </button>
        </div>
        {voiceError && (
            <div className="flex items-center gap-2 mt-2 text-red-400 text-xs px-2 animate-fade-in">
                <AlertCircle className="w-3 h-3" />
                <span>{voiceError}</span>
            </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleAnalyzeClick}
        disabled={!imagePreview || isAnalyzing}
        className={`w-full max-w-xl py-4 rounded-xl font-bold text-lg tracking-wide shadow-lg transition-all
          ${!imagePreview || isAnalyzing 
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20 scale-[1.01]'
          }`}
      >
        {isAnalyzing ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ANALYZING HAZARD...
          </div>
        ) : (
          "Start Analysis"
        )}
      </button>
    </div>
  );
};

export default Uploader;