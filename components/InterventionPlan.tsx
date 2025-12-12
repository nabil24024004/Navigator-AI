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
    <div className="bg-white/5 border border-white/10 rounded-3xl p-5 md:p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg md:text-xl font-bold text-white">Tactical Intervention Plan</h2>
        <div className="text-xs font-bold text-gray-400">{completedCount} of {steps.length} completed</div>
      </div>
      
      {/* Progress Bar Line */}
      <div className="h-1 w-full bg-gray-800 rounded-full overflow-hidden mb-6 md:mb-8">
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
              group cursor-pointer border rounded-xl p-3 md:p-4 transition-all duration-200 flex items-start md:items-center gap-3 md:gap-4
              ${step.completed 
                ? 'bg-white/5 border-transparent opacity-50' 
                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10'
              }
            `}
          >
            {/* Drag Handle - Hidden on small mobile */}
            <div className="hidden md:block pt-1 md:pt-0">
               <GripVertical className="w-5 h-5 text-gray-700" />
            </div>
            
            {/* Check Circle */}
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 mt-0.5 md:mt-0
              ${step.completed ? 'bg-white border-white' : 'border-gray-500 group-hover:border-gray-300'}
            `}>
              {step.completed && <Check className="w-3.5 h-3.5 text-black" />}
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                
                {/* Priority & Title Group */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1 md:mb-0">
                        <div className={`
                            w-8 h-5 md:h-6 rounded flex items-center justify-center text-[10px] md:text-xs font-bold shrink-0
                            ${step.priority === 1 ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 
                              step.priority === 2 ? 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/30' : 
                              'bg-blue-500/20 text-blue-500 border border-blue-500/30'}
                        `}>
                            P{step.priority}
                        </div>
                        <div className="font-bold text-gray-200 text-sm md:text-base leading-tight">{step.title}</div>
                    </div>
                </div>

                {/* Meta Info Group (Time) */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pl-10 md:pl-0">
                   <div className="flex items-center gap-1.5 text-xs text-gray-500 font-mono bg-black/20 px-2 py-1 rounded shrink-0">
                      <Clock className="w-3 h-3" />
                      {step.estimated_time_min} min
                   </div>
                   
                   {/* Mobile Arrow */}
                   <ChevronRight className="w-4 h-4 text-gray-600 md:hidden" />
                </div>
            </div>

            {/* Desktop Arrow */}
            <ChevronRight className="w-4 h-4 text-gray-600 hidden md:block" />
          </div>
        ))}
      </div>

      <button 
        onClick={markAllComplete}
        className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-gray-300 transition-colors border border-white/5 active:scale-95"
      >
        Mark All as Complete
      </button>
    </div>
  );
};

export default InterventionPlan;