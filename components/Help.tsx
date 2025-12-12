import React from 'react';
import { Camera, Brain, List, Phone, ChevronDown, HelpCircle, ShieldAlert } from 'lucide-react';

const Help: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
          <HelpCircle className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-4xl font-bold mb-3">How to Use Navigator AI</h1>
        <p className="text-gray-400">Learn how to get the most out of Navigator AI during emergency situations</p>
      </div>

      <h2 className="text-2xl font-bold text-center mb-8">Step-by-Step Guide</h2>
      
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {[
          { icon: Camera, title: "1. Capture the Scene", desc: "Take a photo or video of the emergency situation. You can use your device's camera directly or upload an existing file." },
          { icon: Brain, title: "2. AI Analysis", desc: "Our multimodal AI (powered by Gemini 3 Pro) analyzes the visual data to identify hazards, assess damage, and classify urgency." },
          { icon: List, title: "3. Get Your Plan", desc: "Receive a prioritized, step-by-step intervention plan. Each action is explained with reasoning so you understand why it's important." },
          { icon: Phone, title: "4. Take Action", desc: "Follow the checklist, mark steps as complete, and use the emergency call button if professional help is needed." }
        ].map((item, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 mb-12 flex items-start gap-4">
        <ShieldAlert className="w-8 h-8 text-yellow-500 shrink-0" />
        <div>
          <h3 className="font-bold text-white mb-1">Important Safety Notice</h3>
          <p className="text-sm text-gray-400">Navigator AI is a guidance tool designed to help you respond to emergencies. It is not a replacement for professional emergency services. <span className="text-white font-bold">Always call 999 (or your local emergency number) for life-threatening situations.</span> Your safety is the top priority.</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
      <div className="space-y-3">
        {[
          "What types of emergencies can Navigator AI help with?",
          "How accurate is the AI analysis?",
          "Does this work offline?",
          "Is my data private?",
          "What is the Reasoning Trace?"
        ].map((q, i) => (
          <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors">
            <span className="font-bold text-sm text-gray-200">{q}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        ))}
      </div>

      <div className="text-center mt-12">
         <p className="text-gray-500 mb-4">Ready to try Navigator AI?</p>
         <button className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white transition-colors">
            Start Analysis
         </button>
      </div>
    </div>
  );
};

export default Help;