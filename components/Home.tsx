import React from 'react';
import { Zap, Camera, Brain, List, Eye, AlertTriangle, PlayCircle, ShieldCheck, Mic } from 'lucide-react';
import { APP_NAME } from '../constants';

interface HomeProps {
  onStartAnalysis: () => void;
  onNavigate: (page: string) => void;
  onStartLive: () => void;
}

const Home: React.FC<HomeProps> = ({ onStartAnalysis, onNavigate, onStartLive }) => {
  return (
    <div className="flex flex-col items-center">
      
      {/* Hero Section */}
      <div className="text-center mt-12 mb-20 max-w-4xl px-4 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-gray-300 mb-8">
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          AI-Powered Emergency Response
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
          Navigate Any <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Crisis</span><br />
          With AI Precision
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Upload a photo of any emergency. Get instant AI analysis with urgency classification and a tactical step-by-step intervention plan to guide you through the critical moments.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button 
            onClick={onStartAnalysis}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-lg shadow-blue-900/20 transition-all hover:scale-105 flex items-center gap-2"
          >
            <Zap className="w-5 h-5 fill-current" />
            Start Analysis
          </button>
          
          <button 
            onClick={onStartLive}
            className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl font-bold text-white transition-all hover:scale-105 flex items-center gap-2"
          >
            <Mic className="w-5 h-5" />
            Live Voice Mode
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto border-t border-white/10 pt-8">
          <div>
            <div className="text-2xl font-bold text-blue-400">&lt; 5s</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Analysis Time</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-400">99.2%</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Detection Accuracy</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-blue-400">24/7</div>
            <div className="text-xs text-gray-500 uppercase tracking-wider mt-1">Availability</div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center">
            <div className="w-6 h-10 rounded-full border border-white/20 flex justify-center p-1">
                <div className="w-1 h-2 bg-white/50 rounded-full animate-bounce mt-1"></div>
            </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full max-w-6xl px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-4">How {APP_NAME} Works</h2>
        <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">Four steps to transform any emergency situation into a clear action plan</p>
        
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { icon: Camera, title: "Capture Crisis", desc: "Upload images or videos of emergency situations using your camera or file browser", color: "text-blue-400 bg-blue-500/10" },
            { icon: Brain, title: "AI Analysis", desc: "Advanced multimodal AI detects hazards, assesses damage, and classifies urgency instantly", color: "text-purple-400 bg-purple-500/10" },
            { icon: List, title: "Action Plan", desc: "Receive step-by-step intervention checklist prioritized by urgency and time", color: "text-blue-400 bg-blue-500/10" },
            { icon: Eye, title: "Reasoning Trace", desc: "Understand WHY each action is recommended with transparent AI reasoning", color: "text-green-400 bg-green-500/10" }
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-colors group">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color} group-hover:scale-110 transition-transform`}>
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-2">{item.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full max-w-4xl px-4 py-12 mb-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-gray-900 to-black border border-white/10 p-10 text-center">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Ready When You Need It Most</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            Every second counts in an emergency. {APP_NAME} is designed to provide immediate, actionable guidance when you need it most.
          </p>
          <button 
            onClick={onStartAnalysis}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-xl font-bold text-white shadow-lg transition-all flex items-center gap-2 mx-auto"
          >
            <Zap className="w-5 h-5 fill-current" />
            Try {APP_NAME} Now
          </button>
        </div>
      </div>

      <footer className="w-full border-t border-white/5 py-8 text-center text-sm text-gray-500">
        <div className="flex justify-center gap-6 mb-4">
          <button onClick={() => onNavigate('help')} className="hover:text-white transition-colors">Help</button>
          <button onClick={() => onNavigate('settings')} className="hover:text-white transition-colors">Settings</button>
          <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
          <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
        </div>
        <p className="mb-2">{APP_NAME} &copy; 2025</p>
        <p>
          Developed by{' '}
          <a 
            href="https://neuralabs.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-400 transition-colors"
          >
            Team Neura Labs
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Home;