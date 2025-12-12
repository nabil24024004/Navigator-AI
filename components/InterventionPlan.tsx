import React, { useState } from 'react';
import { PlanStep } from '../types';
import { Check, Clock, GripVertical, ChevronRight } from 'lucide-react';

interface InterventionPlanProps {
  plan: PlanStep[];
}

const InterventionPlan: React.FC<InterventionPlanProps> = ({ plan }) => {
  const [steps, setSteps] = useState<PlanStep[]>(plan);

  const toggleStep = (id: string) => {
    setSteps(prev => prev.map(step => 
      step.id === id ? { ...step, completed: !step.completed } : step
    ));
  };

  const markAllComplete = () => {
    setSteps(prev => prev.map(s => ({...s, completed: true})));
  }

  const completedCount = steps.filter(s => s.completed).length;

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Tactical Intervention Plan</h2>
        <div className="text-xs font-bold text-gray-400">{completedCount} of {steps.length} completed</div>
      </div>
      
      {/* Progress Bar Line */}
      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden mb-8">
        <div 
          className="h-full bg-white transition-all duration-500 ease-out"
          style={{ width: `${(completedCount / steps.length) * 100}%` }}
        />
      </div>

      <div className="space-y-3 mb-8">
        {steps.map((step) => (
          <div 
            key={step.id}
            onClick={() => toggleStep(step.id)}
            className={`
              group cursor-pointer border rounded-xl p-4 transition-all duration-200 flex items-center gap-4
              ${step.completed 
                ? 'bg-white/5 border-transparent opacity-50' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
              }
            `}
          >
            {/* Drag Handle */}
            <GripVertical className="w-5 h-5 text-gray-700" />
            
            {/* Check Circle */}
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
              ${step.completed ? 'bg-white border-white' : 'border-gray-500 group-hover:border-gray-300'}
            `}>
              {step.completed && <Check className="w-3.5 h-3.5 text-black" />}
            </div>

            {/* Priority Badge */}
            <div className={`
                w-8 h-6 rounded flex items-center justify-center text-xs font-bold
                ${step.priority === 1 ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                  step.priority === 2 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                  'bg-blue-500/20 text-blue-500 border border-blue-500/30'}
            `}>
                P{step.priority}
            </div>

            {/* Content */}
            <div className="flex-1">
                <div className="font-bold text-gray-200 text-sm md:text-base">{step.title}</div>
            </div>

            {/* Time */}
            <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-black/20 px-2 py-1 rounded">
                <Clock className="w-3 h-3" />
                {step.estimated_time_min} min
            </div>

            {/* Arrow */}
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </div>
        ))}
      </div>

      <button 
        onClick={markAllComplete}
        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-gray-300 transition-colors border border-white/5"
      >
        Mark All as Complete
      </button>
    </div>
  );
};

export default InterventionPlan;