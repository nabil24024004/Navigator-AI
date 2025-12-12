import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, X, Activity, Volume2 } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

interface LiveVoiceProps {
  onClose: () => void;
}

const LiveVoice: React.FC<LiveVoiceProps> = ({ onClose }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // Model is speaking
  const [error, setError] = useState<string | null>(null);
  
  // Refs for Audio Contexts and Processor
  const inputContextRef = useRef<AudioContext | null>(null);
  const outputContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Audio Playback Queue
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  
  // Gemini Session
  const sessionRef = useRef<Promise<any> | null>(null);

  useEffect(() => {
    connectLiveSession();

    return () => {
      disconnectLiveSession();
    };
  }, []);

  const connectLiveSession = async () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      setError("No API Key found. Cannot start Live session.");
      return;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      
      // Initialize Audio Contexts
      const InputContextClass = (window.AudioContext || (window as any).webkitAudioContext);
      inputContextRef.current = new InputContextClass({ sampleRate: 16000 });
      outputContextRef.current = new InputContextClass({ sampleRate: 24000 });

      // Get Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Connect to Gemini Live
      sessionRef.current = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: handleOnOpen,
          onmessage: handleOnMessage,
          onclose: () => setIsConnected(false),
          onerror: (e) => {
             console.error(e);
             setError("Connection error.");
          }
        },
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
            },
            systemInstruction: 'You are Navigator AI, a calm and helpful emergency assistant. Keep answers brief and actionable.',
        },
      });

    } catch (err) {
      console.error(err);
      setError("Failed to initialize audio or connection.");
    }
  };

  const handleOnOpen = async () => {
    setIsConnected(true);
    if (!inputContextRef.current || !streamRef.current || !sessionRef.current) return;

    // Setup Input Processing
    const source = inputContextRef.current.createMediaStreamSource(streamRef.current);
    sourceNodeRef.current = source;

    // Create ScriptProcessor (bufferSize, inputChannels, outputChannels)
    // Note: ScriptProcessor is deprecated but widely supported for this use case compared to AudioWorklet complexity in simple React apps
    const processor = inputContextRef.current.createScriptProcessor(4096, 1, 1);
    processorRef.current = processor;

    processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);
      const pcmData = float32ToInt16(inputData);
      
      // Send to Gemini
      sessionRef.current?.then(session => {
        session.sendRealtimeInput({
            media: {
                mimeType: 'audio/pcm;rate=16000',
                data: arrayBufferToBase64(pcmData.buffer)
            }
        });
      });
    };

    source.connect(processor);
    processor.connect(inputContextRef.current.destination);
  };

  const handleOnMessage = async (message: LiveServerMessage) => {
    const audioData = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
    if (audioData) {
        setIsSpeaking(true);
        if (!outputContextRef.current) return;
        
        // Decode
        const audioBuffer = await decodeAudio(audioData, outputContextRef.current);
        
        // Play
        playAudioBuffer(audioBuffer);
    }

    if (message.serverContent?.turnComplete) {
        setIsSpeaking(false);
    }
  };

  const playAudioBuffer = (buffer: AudioBuffer) => {
    if (!outputContextRef.current) return;

    const ctx = outputContextRef.current;
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);

    // Schedule
    const currentTime = ctx.currentTime;
    if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
    }
    
    source.start(nextStartTimeRef.current);
    nextStartTimeRef.current += buffer.duration;
    
    activeSourcesRef.current.add(source);
    source.onended = () => {
        activeSourcesRef.current.delete(source);
        if (activeSourcesRef.current.size === 0) {
            setIsSpeaking(false);
        }
    };
  };

  const disconnectLiveSession = () => {
    if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (processorRef.current) {
        processorRef.current.disconnect();
    }
    if (sourceNodeRef.current) {
        sourceNodeRef.current.disconnect();
    }
    if (inputContextRef.current) {
        inputContextRef.current.close();
    }
    if (outputContextRef.current) {
        outputContextRef.current.close();
    }
    // Note: No explicit close() on session object in current SDK, just drop ref
    sessionRef.current = null;
    setIsConnected(false);
  };

  // --- Utils ---

  const float32ToInt16 = (float32: Float32Array) => {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
        let s = Math.max(-1, Math.min(1, float32[i]));
        int16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
    }
    return int16;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const decodeAudio = async (base64: string, ctx: AudioContext) => {
     const binaryString = window.atob(base64);
     const len = binaryString.length;
     const bytes = new Uint8Array(len);
     for (let i = 0; i < len; i++) {
         bytes[i] = binaryString.charCodeAt(i);
     }
     
     // 16-bit PCM to Float32
     const int16 = new Int16Array(bytes.buffer);
     const float32 = new Float32Array(int16.length);
     for(let i=0; i<int16.length; i++) {
         float32[i] = int16[i] / 32768.0;
     }

     const buffer = ctx.createBuffer(1, float32.length, 24000);
     buffer.getChannelData(0).set(float32);
     return buffer;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in">
        <div className="flex flex-col items-center gap-8 p-8 text-center max-w-md w-full">
            
            <div className="relative">
                {/* Visualizer Ring */}
                <div className={`w-32 h-32 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${isSpeaking ? 'border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)] scale-110' : 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.2)]'}`}>
                    {isConnected ? (
                        <div className="flex gap-1 items-center h-8">
                             {[1,2,3,4,5].map(i => (
                                <div key={i} className={`w-1.5 bg-white rounded-full transition-all duration-100 ${isSpeaking ? 'animate-bounce' : 'h-2'}`} style={{ height: isSpeaking ? `${Math.random() * 24 + 8}px` : '4px', animationDelay: `${i * 0.1}s` }} />
                             ))}
                        </div>
                    ) : (
                        <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                </div>
                {/* Mic Status Icon */}
                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-white/10">
                    <Mic className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-gray-500'}`} />
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-white mb-2">Live Assistant</h2>
                <p className="text-gray-400">
                    {error ? <span className="text-red-400">{error}</span> : isConnected ? (isSpeaking ? "Navigator is speaking..." : "Listening...") : "Connecting to Gemini Live..."}
                </p>
            </div>

            <button 
                onClick={onClose}
                className="mt-8 p-4 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 transition-all hover:scale-105"
            >
                <X className="w-6 h-6" />
            </button>
        </div>
    </div>
  );
};

export default LiveVoice;