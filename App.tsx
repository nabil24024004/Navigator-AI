import React, { useState } from 'react';
import { IncidentResponse } from './types';
import { analyzeIncident } from './services/geminiService';
import { APP_NAME } from './constants';
import { Zap, HelpCircle, Settings as SettingsIcon, ArrowLeft, CheckCircle2 } from 'lucide-react';

// Screens
import Home from './components/Home';
import Uploader from './components/Uploader';
import InterventionPlan from './components/InterventionPlan';
import ReasoningTrace from './components/ReasoningTrace';
import UrgencyBanner from './components/UrgencyBanner';
import Settings from './components/Settings';
import Help from './components/Help';
import EmergencyButton from './components/EmergencyButton';

type View = 'home' | 'upload' | 'results' | 'settings' | 'help';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [incident, setIncident] = useState<IncidentResponse | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);

  const navigate = (view: View) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentView(view);
  };

  const handleAnalyze = async (image: string, context: string) => {
    setUploadedImage(image);
    setIsAnalyzing(true);
    // Move to results view early to show loading state if desired, but Uploader handles loading nicely.
    // We stay on upload until done.
    
    try {
      const result = await analyzeIncident(image, context);
      setIncident(result);
      navigate('results');
    } catch (e) {
      console.error(e);
      alert("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setIncident(null);
    setUploadedImage(null);
    navigate('upload');
  };

  return (
    <div className="min-h-screen font-sans text-gray-100 bg-background antialiased selection:bg-blue-500/30 pb-20">
      
      {/* Global Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-xl border-b border-white/5 bg-black/80">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('home')}>
            <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)] transition-shadow">
              <Zap className="w-4 h-4 text-blue-500 fill-current" />
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all">{APP_NAME}</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-1 md:gap-6">
            <button 
               onClick={() => navigate('home')} 
               className={`text-sm font-semibold transition-colors hidden md:block ${currentView === 'home' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
                Home
            </button>
            <button 
               onClick={() => navigate('upload')} 
               className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${currentView === 'upload' || currentView === 'results' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' : 'text-gray-400 hover:text-white'}`}
            >
                Analyze
            </button>
            <button 
               onClick={() => navigate('help')} 
               className={`text-sm font-semibold transition-colors hidden md:flex items-center gap-2 ${currentView === 'help' ? 'text-white' : 'text-gray-400 hover:text-white'}`}
            >
               <HelpCircle className="w-4 h-4" /> Help
            </button>
            <button 
               onClick={() => navigate('settings')} 
               className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${currentView === 'settings' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
               <SettingsIcon className="w-4 h-4" /> <span className="hidden md:inline">Settings</span>
            </button>
          </nav>
        </div>
      </header>

      {/* View Content */}
      <main className="max-w-5xl mx-auto pt-8 md:pt-12 px-4 md:px-6">
        
        {/* Back Button Logic */}
        {currentView !== 'home' && (
           <div className="mb-6">
             <button 
                onClick={() => navigate('home')}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
             >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
             </button>
           </div>
        )}

        {currentView === 'home' && (
          <Home onStartAnalysis={() => navigate('upload')} onNavigate={navigate} />
        )}

        {currentView === 'upload' && (
          <Uploader onAnalyze={handleAnalyze} isAnalyzing={isAnalyzing} />
        )}

        {currentView === 'help' && <Help />}
        
        {currentView === 'settings' && <Settings />}

        {currentView === 'results' && incident && (
          <div className="animate-slide-up space-y-8 max-w-3xl mx-auto">
             
             {/* Header */}
             <div className="text-center">
                 <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">Analyze Emergency</h1>
                 <p className="text-gray-400 text-sm">Analysis based on uploaded media</p>
             </div>

             {/* Image Preview & Status */}
             <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-2">
                 {uploadedImage && (
                    <div className="relative aspect-video rounded-2xl overflow-hidden bg-black mb-2">
                        <img src={uploadedImage} alt="Analyzed Scene" className="w-full h-full object-contain" />
                    </div>
                 )}
                 <div className="bg-black/40 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                     <div className="flex items-center gap-2 text-green-500">
                         <CheckCircle2 className="w-5 h-5" />
                         <span className="font-bold text-sm">Analysis Complete</span>
                     </div>
                     <div className="flex flex-wrap gap-2 justify-center">
                         {incident.analysis.objects.map((obj, i) => (
                             <div key={i} className="px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-xs text-gray-300 font-mono flex items-center gap-2">
                                 <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                 {obj.label} <span className="opacity-50">{(obj.confidence * 100).toFixed(0)}%</span>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>

             {/* Urgency */}
             <UrgencyBanner level={incident.urgency} />

             {/* Plan */}
             <InterventionPlan plan={incident.plan} />

             {/* Reasoning */}
             <ReasoningTrace trace={incident.reasoning_trace} />

             {/* Reset Action */}
             <button 
                onClick={resetAnalysis}
                className="w-full py-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 rounded-2xl text-white font-bold transition-all"
             >
                Analyze New Emergency
             </button>
          </div>
        )}

      </main>

      {/* Floating Emergency Button - Show everywhere except results where it is in the banner, or handle globally */}
      {/* Design choice: If results page has big banner, floating button might be redundant or extra safety. Let's keep it but maybe smaller on results? */}
      {/* Actually screenshot 3 has the banner. I will hide floating button on results page to avoid clutter */}
      {currentView !== 'results' && currentView !== 'home' && <EmergencyButton />}
    </div>
  );
}

export default App;