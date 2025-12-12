import React, { useState } from 'react';
import { ReasoningNode } from '../types';
import { BrainCircuit, ChevronDown, ChevronUp, ArrowRight, Eye, Zap, Lightbulb } from 'lucide-react';

interface ReasoningTraceProps {
  trace: ReasoningNode[];
}

const ReasoningTrace: React.FC<ReasoningTraceProps> = ({ trace }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <BrainCircuit className="w-5 h-5 text-gray-400" />
          <span className="font-bold text-gray-200">View AI Reasoning Trace</span>
        </div>
        {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
      </button>

      {isOpen && (
        <div className="p-6 pt-0 space-y-4">
          {trace.map((node, index) => (
            <div key={index} className="bg-black/20 rounded-2xl p-5 border border-white/5">
               <div className="flex items-start gap-4 mb-4">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold mt-0.5">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                      {/* Evidence */}
                      <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-blue-400 mb-1 uppercase tracking-wider">
                              <Eye className="w-3 h-3" /> Evidence
                          </div>
                          <p className="text-gray-300 text-sm">{node.evidence}</p>
                          <div className="mt-1 text-blue-500/30 text-xs">→</div>
                      </div>

                      {/* Inference */}
                      <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1 uppercase tracking-wider">
                              <Lightbulb className="w-3 h-3" /> Inference
                          </div>
                          <p className="text-gray-300 text-sm">{node.inference}</p>
                          <div className="mt-1 text-purple-500/30 text-xs">→</div>
                      </div>

                      {/* Action */}
                      <div>
                          <div className="flex items-center gap-2 text-xs font-bold text-white mb-1 uppercase tracking-wider">
                              <Zap className="w-3 h-3" /> Recommended Action
                          </div>
                          <p className="text-white font-semibold text-sm">{node.action}</p>
                      </div>
                  </div>
               </div>

               {/* Confidence Bar */}
               <div className="flex items-center gap-3 mt-4">
                  <span className="text-[10px] text-gray-500 uppercase font-bold">Confidence</span>
                  <div className="flex-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: `${node.confidence * 100}%` }} />
                  </div>
                  <span className="text-xs font-mono text-gray-400">{(node.confidence * 100).toFixed(0)}%</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReasoningTrace;