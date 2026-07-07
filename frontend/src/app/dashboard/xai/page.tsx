'use client';

import React, { useState } from 'react';
import { useStadium } from '../../../context/StadiumContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { 
  FileQuestion, 
  Settings, 
  HelpCircle, 
  Info, 
  ArrowRight, 
  TrendingUp, 
  Sparkles, 
  Brain,
  Sliders,
  Volume2
} from 'lucide-react';

interface XaiFactor {
  name: string;
  weight: number;
  description: string;
}

export default function ExplainableAiPage() {
  const { venue } = useStadium();
  const { speak } = useAccessibility();

  const [inputAdvice, setInputAdvice] = useState('Open Gate B relief lanes immediately.');
  const [isExplaining, setIsExplaining] = useState(false);
  const [explanation, setExplanation] = useState<any | null>(null);

  const defaultFactors: XaiFactor[] = [
    { name: 'Live Crowd Telemetry', weight: 40, description: 'Live sensor metrics recording headcount, crowd density, and queue length at gates.' },
    { name: 'Regional Transit Status', weight: 25, description: 'Shuttle arrivals, Metro rail occupancy, and parking capacity logs.' },
    { name: 'Outdoor Weather Forecast', weight: 20, description: 'Temperatures, precipitation ratings, and wind speeds prompting staggered egress.' },
    { name: 'Historical Match Telemetry', weight: 15, description: 'Telemetry profiles from previous FIFA tournaments matching target attendance scales.' }
  ];

  const handleExplain = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputAdvice.trim()) return;

    setIsExplaining(true);
    setExplanation(null);

    // Mocking Gemini explainability analysis
    setTimeout(() => {
      const mockResult = {
        advice: inputAdvice,
        confidence: 94,
        expectedImprovement: 'Improve egress speed by 18% and cut congestion risk.',
        contributingMetrics: [
          { metric: 'Live queue density at Gate A', weightPercentage: 45, state: 'Critical (88% limit)' },
          { metric: 'Meadowlands Rail passenger load', weightPercentage: 35, state: 'Peak arrival flow' },
          { metric: 'Historical match baseline 2025', weightPercentage: 20, state: 'Congestive fit' }
        ],
        summary: `The operations engine proposed "${inputAdvice}" because the current queue density exceeds the yellow safety threshold. Merging this load with backup channels balances concourse velocities.`
      };

      setExplanation(mockResult);
      setIsExplaining(false);
      speak(`AI confidence is ${mockResult.confidence} percent. Expected improvement: ${mockResult.expectedImprovement}`);
    }, 1500);
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1200px] mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-500" />
          Explainable AI (XAI)
        </h1>
        <p className="text-slate-400 text-xs">
          Transparency audit logs detailing decision weights, confidence factors, and telemetry ratios.
        </p>
      </div>

      {/* Grid: Global weights and explainer form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: System Weights (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-amber-500" />
              Operations Decision Model
            </h2>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Below are the standard mathematical weights assigned to raw sensor parameters within the operations logic.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              {defaultFactors.map((f, i) => (
                <div key={i} className="flex flex-col gap-1.5 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-350">{f.name}</span>
                    <span className="text-amber-500 font-mono">{f.weight}%</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${f.weight}%` }}></div>
                  </div>
                  
                  <p className="text-[10px] text-slate-500 leading-normal">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Explainer sandbox (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Query input card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider">
              Explain Recommendation Rationale
            </h2>

            <form onSubmit={handleExplain} className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 font-bold">Input Operational Recommendation</span>
                <input
                  type="text"
                  value={inputAdvice}
                  onChange={(e) => setInputAdvice(e.target.value)}
                  placeholder="e.g. Open Gate B relief lanes"
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 animate-pulse" />
                Query AI Explanation
              </button>
            </form>
          </div>

          {/* Explanation Output */}
          {explanation && (
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 border-l-4 border-l-amber-500 text-xs">
              
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-extrabold text-slate-200">AI Explainer Response</span>
                <div className="flex items-center gap-1.5 text-amber-500 font-bold font-mono">
                  <span>Confidence:</span>
                  <span>{explanation.confidence}%</span>
                </div>
              </div>

              <p className="bg-slate-900/60 p-3 rounded-xl text-slate-400 leading-relaxed">
                {explanation.summary}
              </p>

              <div className="flex flex-col gap-2.5 mt-2">
                <strong className="text-slate-350">Contributing Telemetry Nodes:</strong>
                {explanation.contributingMetrics.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between border-b border-slate-900 pb-1 text-slate-400">
                    <span className="font-semibold">{item.metric} ({item.state})</span>
                    <span className="font-bold text-amber-500 font-mono">+{item.weightPercentage}% weight</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-900 mt-2">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4.5 h-4.5 text-emerald-500" />
                  Impact: {explanation.expectedImprovement}
                </span>
                <button
                  onClick={() => speak(explanation.summary)}
                  className="p-1.5 border border-slate-800 bg-slate-950 rounded text-slate-500 hover:text-amber-500"
                  aria-label="Speak explanation summary"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {isExplaining && (
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center gap-3 aspect-[2/1]">
              <div className="w-6 h-6 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Analyzing logs...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
