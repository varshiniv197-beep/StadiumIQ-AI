'use client';

import React, { useState } from 'react';
import { useStadium } from '../../../context/StadiumContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { 
  Play, 
  ShieldAlert, 
  Activity, 
  HelpCircle, 
  Volume2, 
  BookOpen, 
  CheckSquare, 
  Users, 
  Zap, 
  RefreshCw,
  FolderOpen,
  ArrowRight
} from 'lucide-react';

interface SimulationResult {
  riskAssessment: string;
  actionPlan: string[];
  resourceAllocation: string;
  evacuationStrategy: string;
  announcements: { language: string; text: string }[];
}

interface LearningLog {
  id: string;
  eventName: string;
  recommendation: string;
  humanAction: string;
  outcome: string;
  lessonsLearned: string;
  timestamp: string;
}

export default function AIScenarioSimulator() {
  const { venue } = useStadium();
  const { speak } = useAccessibility();

  const [selectedScenario, setSelectedScenario] = useState('FIRE_ALERT');
  const [isSimulating, setIsSimulating] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);
  
  // Announcement language tab state
  const [activeLangTab, setActiveLangTab] = useState(0);

  // Completed Action Plan checklist
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const [learningLogs, setLearningLogs] = useState<LearningLog[]>([
    {
      id: 'log-1',
      eventName: 'Stampede Risk (SIMULATION)',
      recommendation: 'Open backup Gates E and F immediately to divert flow from Gate D.',
      humanAction: 'Implemented fully',
      outcome: 'Succeeded in lowering Concourse North pressure from 92% to 64% within 12 minutes.',
      lessonsLearned: 'Keep exit corridors free of concession carts during peak outflow periods.',
      timestamp: '2026-07-06 14:32'
    },
    {
      id: 'log-2',
      eventName: 'Heavy Rain (SIMULATION)',
      recommendation: 'Increase Metro shuttle loops; advise fans via app to stagger departures.',
      humanAction: 'Modified (Increased shuttle loops but skipped staggering app advice)',
      outcome: 'Slight congestion at Metro platform gates. Wait times rose to 18m.',
      lessonsLearned: 'App staggering notices are critical to balance transit platform queues.',
      timestamp: '2026-07-05 10:15'
    }
  ]);

  const scenarios = [
    { id: 'HEAVY_RAIN', label: 'Heavy Rain & Storm Delay', severity: 'MEDIUM' },
    { id: 'FIRE_ALERT', label: 'Fire Alert in Concourse', severity: 'CRITICAL' },
    { id: 'MEDICAL_EMERGENCY', label: 'Section 112 Medical Emergency', severity: 'HIGH' },
    { id: 'VIP_ARRIVAL', label: 'VIP Convoy Arrival logistics', severity: 'LOW' },
    { id: 'STAMPEDE_RISK', label: 'Egress Corridor Bottleneck', severity: 'CRITICAL' },
    { id: 'POWER_OUTAGE', label: 'Localized Concourse Power Outage', severity: 'HIGH' }
  ];

  const handleTriggerSimulation = () => {
    setIsSimulating(true);
    setResult(null);
    setCompletedSteps({});

    // Mocking Gemini generative response latency
    setTimeout(() => {
      let mockRes: SimulationResult = {
        riskAssessment: 'HIGH RISK: Simulated Power Outage in Concourse East has deactivated lighting systems and entry scanners. Minor fan panic risks and queuing congestion surges are predicted.',
        actionPlan: [
          'Activate auxiliary battery back-up power generators.',
          'Dispatch Sector East security units with flashlights to guide fans.',
          'Instruct ticketing staff to switch to manual offline scanner devices.',
          'Re-route backup volunteers to direct pedestrian flows to Gate C.'
        ],
        resourceAllocation: 'Reallocate 8 general volunteers from West Stand to East Stand Concourse. Redirect 2 mobile safety stewards to sector gates.',
        evacuationStrategy: 'Evacuate sector sections 102-108 through Gate C. Keep Gate D clear for transit vehicles.',
        announcements: [
          { language: 'English', text: 'Attention fans: We are experiencing a localized power outage in Concourse East. Auxiliary systems are active. Please follow the instructions of security stewards.' },
          { language: 'Spanish', text: 'Atención aficionados: Estamos experimentando un corte de energía localizado en el Concurso Este. Los sistemas auxiliares están activos.' },
          { language: 'French', text: 'Attention: Panne de courant localisée dans le Hall Est. Veuillez suivre les instructions des stewards.' }
        ]
      };

      if (selectedScenario === 'FIRE_ALERT') {
        mockRes = {
          riskAssessment: 'CRITICAL RISK: Active fire alert simulated at Concourse North. High structural risk and severe crowd push-back stampede risks at Gate D Plaza.',
          actionPlan: [
            'Trigger localized sector sirens and activate sprinklers.',
            'Deploy security squads to open all Gate D emergency egress barriers.',
            'Broadcast emergency evacuation statements in all stadiums.',
            'Dispatch Medical Response Team 1 to Sector D plaza.'
          ],
          resourceAllocation: 'Reallocate 12 volunteers from East Stand concessions to guide exits. Move 4 security officers to North plaza.',
          evacuationStrategy: 'Evacuate Concourse North stand out via Gates E and F immediately. Complete avoidance of tunnels.',
          announcements: [
            { language: 'English', text: 'Attention: A fire alert has occurred in the North Concourse. Please follow staff directions and evacuate immediately using the nearest exit Gates E or F.' },
            { language: 'Spanish', text: 'Atención: Se ha producido una alerta de incendio en el Concurso Norte. Evacúe inmediatamente por las Puertas E o F.' },
            { language: 'French', text: 'Attention: Alerte incendie dans le Hall Nord. Veuillez évacuer immédiatement par les portes E ou F.' }
          ]
        };
      } else if (selectedScenario === 'HEAVY_RAIN') {
        mockRes = {
          riskAssessment: 'MODERATE RISK: Heavy downpour will cause slippery walking surfaces, transit delays (Metro loop delay expected +12m), and overcrowding inside covered corridors.',
          actionPlan: [
            'Deploy cleaning staff with mops and warning boards to high-traffic concourse entrances.',
            'Contact regional transit operations to double Meadowlands Rail frequency.',
            'Advise fans to remain inside stadium suites to stagger peak exit loads.'
          ],
          resourceAllocation: 'Shift 6 volunteers from open taxi stands to undercover entry corridors. Deploy 2 cleaning personnel to Concourse East.',
          evacuationStrategy: 'Use standard gates. Avoid stairwells; direct fans towards covered ramps.',
          announcements: [
            { language: 'English', text: 'Notice: Heavy rain is causing regional travel delays. Metro rail service frequencies have been increased. Please travel carefully.' },
            { language: 'Spanish', text: 'Aviso: La lluvia intensa está provocando retrasos en el transporte. Las frecuencias del metro se han incrementado.' }
          ]
        };
      }

      setResult(mockRes);
      setIsSimulating(false);

      // Append simulation log to Learning Center
      const newLog: LearningLog = {
        id: `log-${Date.now()}`,
        eventName: `${scenarios.find(s => s.id === selectedScenario)?.label}`,
        recommendation: mockRes.actionPlan.join(' | '),
        humanAction: 'Implemented',
        outcome: 'AI recommended evacuations and volunteer shifts completed within safety parameters.',
        lessonsLearned: 'Keep standby manual scanners charged; add extra battery packs in Sector East.',
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16)
      };

      setLearningLogs(prev => [newLog, ...prev]);
      speak(`Simulation complete. Risk assessment: ${mockRes.riskAssessment}`);
    }, 1800);
  };

  const handleStepCheck = (idx: number) => {
    setCompletedSteps(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1400px] mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500 animate-pulse" />
          AI Scenario Simulator
        </h1>
        <p className="text-slate-400 text-xs">
          Stress-test safety procedures and generate real-time AI crisis management plans.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Controls (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Play className="w-4.5 h-4.5 text-amber-500" />
              Configure Scenario
            </h2>

            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-xs">
                <span className="text-slate-500 font-bold">Select Scenario Template</span>
                <select
                  value={selectedScenario}
                  onChange={(e) => setSelectedScenario(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                >
                  {scenarios.map(s => (
                    <option key={s.id} value={s.id} className="bg-slate-900">
                      {s.label} ({s.severity})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleTriggerSimulation}
                disabled={isSimulating}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating AI Response...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Trigger AI Simulation
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Simulation Results (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* AI Simulation Results Output cards */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Card 1: Risk Assessment & Evac */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
                <div>
                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest">AI ASSESSMENT</span>
                  <h3 className="font-extrabold text-sm text-slate-200 mt-0.5">Risk & Evacuation Strategy</h3>
                </div>

                <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-400">
                  <p className="bg-red-950/20 border border-red-900/40 p-3 rounded-xl text-red-200">
                    {result.riskAssessment}
                  </p>
                  
                  <div className="flex flex-col gap-1">
                    <strong className="text-slate-300">Evacuation Plan:</strong>
                    <p>{result.evacuationStrategy}</p>
                  </div>
                  
                  <div className="flex flex-col gap-1 border-t border-slate-900 pt-2">
                    <strong className="text-slate-300">Resource Routing:</strong>
                    <p>{result.resourceAllocation}</p>
                  </div>
                </div>
              </div>

              {/* Card 2: Interactive Action Checklists */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
                <div>
                  <span className="text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">OPERATIONS COMMANDS</span>
                  <h3 className="font-extrabold text-sm text-slate-200 mt-0.5">Tactical Action Plan</h3>
                </div>

                <div className="flex flex-col gap-3">
                  {result.actionPlan.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleStepCheck(idx)}
                      className="flex items-start gap-2.5 text-left text-xs text-slate-400 hover:text-slate-200"
                    >
                      <CheckSquare className={`w-4 h-4 shrink-0 mt-0.5 ${completedSteps[idx] ? 'text-emerald-500 fill-emerald-500/10' : 'text-slate-600'}`} />
                      <span className={completedSteps[idx] ? 'line-through text-slate-600' : ''}>{step}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Card 3: Announcement Studio scripts (Col span full) */}
              <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 md:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                  <div>
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest font-mono">ANNOUNCEMENT STUDIO</span>
                    <h3 className="font-extrabold text-sm text-slate-200 mt-0.5">Multi-Language Public Broadcast</h3>
                  </div>

                  {/* Language selector tabs */}
                  <div className="flex items-center gap-1">
                    {result.announcements.map((ann, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveLangTab(idx)}
                        className={`px-2 py-1 rounded text-[10px] font-bold ${
                          activeLangTab === idx ? 'bg-slate-900 text-amber-500 border border-slate-800' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {ann.language}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Announcement text output */}
                <div className="bg-slate-900/60 p-4 rounded-xl flex items-start justify-between gap-4 text-xs">
                  <p className="text-slate-300 leading-relaxed font-mono italic">
                    "{result.announcements[activeLangTab]?.text}"
                  </p>
                  <button
                    onClick={() => speak(result.announcements[activeLangTab]?.text)}
                    className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg text-slate-400 hover:text-amber-500 shrink-0"
                    aria-label="Speak broadcast script"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loader Skeleton */}
          {isSimulating && (
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center gap-4 aspect-[2/1]">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin" />
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Running Gemini Risk Predictor Model...</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Learning Center Log History Section */}
      <div className="glass-panel rounded-2xl p-6 mt-6 flex flex-col gap-4">
        <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-500" />
          AI Learning Center (Post-Mortem Analytics)
        </h2>

        <p className="text-xs text-slate-500 leading-relaxed">
          The operations engine logs all simulated events. These logs evaluate the difference between the AI recommendation and the operator action to refine future logistical weighting filters.
        </p>

        <div className="flex flex-col gap-4 mt-2">
          {learningLogs.map(log => (
            <div key={log.id} className="p-4 bg-slate-900/30 border border-slate-850 rounded-2xl flex flex-col gap-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                <span className="font-extrabold text-slate-200">{log.eventName}</span>
                <span className="text-[10px] font-mono text-slate-650">{log.timestamp}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-400 leading-relaxed">
                <div>
                  <div className="font-bold text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">AI Recommendation:</div>
                  <p>{log.recommendation}</p>
                </div>
                <div>
                  <div className="font-bold text-slate-500 text-[10px] uppercase tracking-wider mb-0.5">Final Outcome & Lessons:</div>
                  <p>{log.outcome}</p>
                  <p className="text-[11px] text-amber-500/80 mt-1 italic">Lesson: {log.lessonsLearned}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
