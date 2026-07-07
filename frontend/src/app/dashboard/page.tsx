'use client';

import React, { useState, useEffect } from 'react';
import { useStadium } from '../../context/StadiumContext';
import { useAccessibility } from '../../context/AccessibilityContext';
import { 
  ShieldAlert, 
  CheckCircle, 
  Users, 
  Map, 
  Compass, 
  Activity, 
  TrendingUp, 
  Flame, 
  Shuffle, 
  Settings, 
  Thermometer, 
  Volume2, 
  ThumbsUp, 
  ThumbsDown,
  Info
} from 'lucide-react';

interface AlertItem {
  id: string;
  category: 'CROWD' | 'TRANSIT' | 'MEDICAL' | 'SECURITY';
  message: string;
  location: string;
  time: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM';
}

interface RecommendationItem {
  id: string;
  advice: string;
  reasoning: string;
  confidence: number;
  expectedImprovement: string;
  contributingFactors: { name: string; weight: number }[];
  status: 'OPEN' | 'IMPLEMENTED' | 'IGNORED';
}

export default function AICommandCenter() {
  const { venue, stadiumOccupancy, weather, systemHealth } = useStadium();
  const { speak } = useAccessibility();

  // Dynamic feedback storage
  const [feedbacks, setFeedbacks] = useState<Record<string, 'HELPFUL' | 'NOT_HELPFUL'>>({});
  const [recs, setRecs] = useState<RecommendationItem[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);

  // Simulation parameters for Digital Twin
  const [gateDStatus, setGateDStatus] = useState<'NORMAL' | 'WARNING' | 'CRITICAL'>('WARNING');
  const [gateDTimeLeft, setGateDTimeLeft] = useState(18); // minutes left before exceed
  const [lightingMode, setLightingMode] = useState<'ECO' | 'STANDARD'>('ECO');
  const [escalatorStatus, setEscalatorStatus] = useState<'OPERATIONAL' | 'MAINTENANCE'>('OPERATIONAL');

  // Load and refresh telemetry metrics
  useEffect(() => {
    // Custom seed data per venue selection
    if (venue === 'METLIFE_STADIUM') {
      setAlerts([
        { id: '1', category: 'CROWD', message: 'Gate D wait times exceeded 35 minutes.', location: 'Gate D Plaza', time: '18:04', severity: 'HIGH' },
        { id: '2', category: 'MEDICAL', message: 'Heat exhaustion collapse reported in Sec 112.', location: 'Section 112 / East Stand', time: '18:02', severity: 'HIGH' },
        { id: '3', category: 'TRANSIT', message: 'Meadowlands Light Rail delayed by 15m.', location: 'West Transit Loop', time: '17:58', severity: 'MEDIUM' }
      ]);
      setRecs([
        {
          id: 'rec-1',
          advice: 'Deploy 4 additional volunteers to Gate D security scanning lanes.',
          reasoning: 'Gate D waiting lines are spiking due to concentrated rail passenger drop-offs. Live average wait time is 35 minutes.',
          confidence: 94,
          expectedImprovement: 'Reduce Gate D queues by 18% and cut average wait times by 6 minutes.',
          contributingFactors: [
            { name: 'Crowd density', weight: 45 },
            { name: 'Transit arrival', weight: 35 },
            { name: 'Historical matches', weight: 20 }
          ],
          status: 'OPEN'
        },
        {
          id: 'rec-2',
          advice: 'Open Gate B backup lanes to relieve Gate D incoming flow.',
          reasoning: 'Incoming entry rate exceeds safe Gate D capacity limit. Opening adjacent Gate B will balance load.',
          confidence: 89,
          expectedImprovement: 'Improve entry throughput by 22% and lower crowd pushback risk.',
          contributingFactors: [
            { name: 'Queue length', weight: 50 },
            { name: 'Safe limit forecast', weight: 30 },
            { name: 'Weather delay', weight: 20 }
          ],
          status: 'OPEN'
        }
      ]);
      setGateDStatus('WARNING');
      setGateDTimeLeft(18);
    } else if (venue === 'ESTADIO_AZTECA') {
      setAlerts([
        { id: '4', category: 'CROWD', message: 'Concourse North capacity exceeds 92%.', location: 'Gate C Ramp', time: '18:05', severity: 'CRITICAL' },
        { id: '5', category: 'SECURITY', message: 'Lost child reported at Food Court West.', location: 'Food Court West', time: '17:59', severity: 'MEDIUM' }
      ]);
      setRecs([
        {
          id: 'rec-3',
          advice: 'Establish unidirectional walk lanes in Concourse North.',
          reasoning: 'Opposing fan currents are creating severe walking bottlenecks in the north concourse segment.',
          confidence: 91,
          expectedImprovement: 'Increase crowd movement speed by 15% and cut friction bottlenecks.',
          contributingFactors: [
            { name: 'Concourse density', weight: 60 },
            { name: 'Friction metrics', weight: 30 },
            { name: 'Previous matches', weight: 10 }
          ],
          status: 'OPEN'
        }
      ]);
      setGateDStatus('CRITICAL');
      setGateDTimeLeft(9);
    } else {
      setAlerts([
        { id: '6', category: 'TRANSIT', message: 'Rideshare shuttle queues delayed due to rain.', location: 'Lot C Terminal', time: '18:06', severity: 'MEDIUM' }
      ]);
      setRecs([
        {
          id: 'rec-4',
          advice: 'Increase Shuttle frequency to metro terminal.',
          reasoning: 'Heavy rain is discouraging walking exits, overloading rideshare shuttle loops.',
          confidence: 93,
          expectedImprovement: 'Reduce rideshare shuttle wait times by 25%.',
          contributingFactors: [
            { name: 'Heavy rain factor', weight: 55 },
            { name: 'Transit load', weight: 30 },
            { name: 'Peak exit forecast', weight: 15 }
          ],
          status: 'OPEN'
        }
      ]);
      setGateDStatus('NORMAL');
      setGateDTimeLeft(45);
    }
  }, [venue]);

  // Handle recommendation action
  const handleRecAction = (id: string, action: 'IMPLEMENTED' | 'IGNORED') => {
    setRecs(prev => prev.map(r => r.id === id ? { ...r, status: action } : r));
    speak(`Recommendation action updated to ${action}`);
  };

  // Submit Feedback
  const submitFeedback = (id: string, rating: 'HELPFUL' | 'NOT_HELPFUL') => {
    setFeedbacks(prev => ({ ...prev, [id]: rating }));
    speak(`AI recommendation feedback logged as ${rating}`);
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1600px] mx-auto">
      
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <Compass className="w-6 h-6 text-amber-500" />
            AI Command Center
          </h1>
          <p className="text-slate-400 text-xs">
            Unified live operations and digital twin simulation room.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-slate-900 border border-slate-800 px-4 py-2 rounded-xl flex items-center gap-2 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Console Sync: <strong>LIVE (5s)</strong></span>
          </div>
        </div>
      </div>

      {/* Grid Layout: Map, Alerts, Explainable AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Digital Twin Stadium & Map (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Digital Twin Map Console */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Map className="w-5 h-5 text-amber-500" />
                <h2 className="font-extrabold text-sm uppercase tracking-wider">
                  Digital Twin Blueprint Simulation
                </h2>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => setLightingMode(prev => prev === 'ECO' ? 'STANDARD' : 'ECO')}
                  className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-bold hover:border-slate-700"
                >
                  Lighting: {lightingMode}
                </button>
                <button
                  onClick={() => setEscalatorStatus(prev => prev === 'OPERATIONAL' ? 'MAINTENANCE' : 'OPERATIONAL')}
                  className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded text-[10px] font-bold hover:border-slate-700"
                >
                  Escalators: {escalatorStatus}
                </button>
              </div>
            </div>

            {/* Simulated Map Container */}
            <div className="relative aspect-[16/9] w-full bg-slate-950 rounded-xl border border-slate-900 overflow-hidden flex items-center justify-center p-6">
              
              {/* Floating AI Predictive Alert Card */}
              {gateDStatus !== 'NORMAL' && (
                <div className="absolute top-4 left-4 bg-red-950/80 border border-red-800/80 text-red-200 p-3.5 rounded-xl max-w-xs text-xs z-10 neon-glow-red flex flex-col gap-1.5">
                  <div className="flex items-center gap-2 font-black">
                    <ShieldAlert className="w-4 h-4 text-red-500 animate-bounce" />
                    <span>AI PREDICTIVE CRITIC</span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    Gate D will exceed safe occupancy limits in <strong>{gateDTimeLeft} minutes</strong>. Suggested action: Redirect fans.
                  </p>
                </div>
              )}

              {/* Stadium Oval SVG Vector */}
              <div className="w-full max-w-[400px] aspect-[4/3] relative flex items-center justify-center">
                
                {/* Outer Wall Ring */}
                <div className="w-full h-full rounded-full border-4 border-slate-800/60 flex items-center justify-center p-4 relative">
                  
                  {/* Gate Nodes */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="text-[8px] bg-slate-900 border border-slate-700 px-1 rounded font-bold">Gate A</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950"></span>
                  </div>
                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950"></span>
                    <span className="text-[8px] bg-slate-900 border border-slate-700 px-1 rounded font-bold">Gate C</span>
                  </div>
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="text-[8px] bg-slate-900 border border-slate-700 px-1 rounded font-bold">Gate D</span>
                    <span className={`w-2.5 h-2.5 rounded-full border border-slate-950 ${
                      gateDStatus === 'CRITICAL' ? 'bg-red-500 animate-ping' : gateDStatus === 'WARNING' ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'
                    }`}></span>
                  </div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950"></span>
                    <span className="text-[8px] bg-slate-900 border border-slate-700 px-1 rounded font-bold">Gate B</span>
                  </div>

                  {/* Inner ring Concourse */}
                  <div className="w-4/5 h-4/5 rounded-full border border-slate-800 flex items-center justify-center p-4">
                    
                    {/* Inner pitch */}
                    <div className="w-3/4 h-3/4 rounded-full border border-slate-800 flex items-center justify-center bg-slate-950 relative">
                      
                      {/* Soccer Pitch Graphic */}
                      <div className="w-14 h-24 border border-emerald-800/35 relative flex items-center justify-center">
                        <div className="w-full h-0.5 bg-emerald-800/25"></div>
                        <div className="absolute w-8 h-8 rounded-full border border-emerald-800/25"></div>
                      </div>

                      {/* CCTV / Lighting Status Dot Indicators */}
                      <div className="absolute top-2 left-6 flex flex-col items-center">
                        <span className="text-[7px] text-slate-600">CCTV 1</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                      <div className="absolute bottom-2 right-6 flex flex-col items-center">
                        <span className="text-[7px] text-slate-600">CCTV 2</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Utility Status Indicators Legend */}
              <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-900 p-3 rounded-lg text-[9px] grid grid-cols-2 gap-x-4 gap-y-1 z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-emerald-500"></span>
                  <span>CCTV Network: Online</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-amber-500 animate-pulse"></span>
                  <span>Gate D: Congested</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded bg-emerald-500"></span>
                  <span>Lighting: {lightingMode === 'ECO' ? 'Eco Mode' : 'Standard'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded ${escalatorStatus === 'OPERATIONAL' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                  <span>Escalator: {escalatorStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Alerts & AI Recommendations (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Active Alerts Panel */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4 max-h-[300px] overflow-y-auto">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 text-red-500">
              <ShieldAlert className="w-5 h-5 animate-pulse" />
              Active Incident Alerts
            </h2>
            <div className="flex flex-col gap-3">
              {alerts.length === 0 ? (
                <div className="text-slate-500 text-xs py-4 text-center">No active emergencies. Systems healthy.</div>
              ) : (
                alerts.map(a => (
                  <div key={a.id} className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl flex items-start justify-between gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                          a.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : a.severity === 'HIGH' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-400'
                        }`}>
                          {a.severity}
                        </span>
                        <span className="font-bold text-slate-300">{a.location}</span>
                      </div>
                      <p className="text-slate-400 text-[11px] leading-snug">{a.message}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-600 shrink-0">{a.time}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Explainable AI Recommendations with Visual Gauges */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              Explainable AI Recommendations
            </h2>

            <div className="flex flex-col gap-6">
              {recs.length === 0 ? (
                <div className="text-slate-500 text-xs text-center py-6">No pending recommendations.</div>
              ) : (
                recs.map(r => (
                  <div key={r.id} className="border border-slate-900 bg-slate-950/60 p-4 rounded-2xl flex flex-col gap-3 text-xs relative">
                    
                    {/* Status Badge */}
                    <div className="flex items-center justify-between border-b border-slate-900 pb-2">
                      <span className="font-bold text-slate-300">{r.advice}</span>
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        r.status === 'OPEN' ? 'bg-amber-500/10 text-amber-500' : r.status === 'IMPLEMENTED' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}>
                        {r.status}
                      </span>
                    </div>

                    {/* "Why AI Suggested This" explainability gauges */}
                    <div className="bg-slate-900/40 p-3 rounded-xl flex flex-col gap-2.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-500 font-semibold">AI Confidence Level</span>
                        <span className="text-amber-500 font-bold font-mono">{r.confidence}%</span>
                      </div>
                      
                      {/* Bar Gauge */}
                      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                          style={{ width: `${r.confidence}%` }}
                        ></div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mt-1 text-[10px]">
                        <div className="flex flex-col bg-slate-950 p-2 border border-slate-900 rounded-lg">
                          <span className="text-slate-500 uppercase tracking-wider text-[8px] font-bold">Estimated Impact</span>
                          <span className="text-emerald-400 font-bold font-mono mt-0.5">
                            {r.expectedImprovement.match(/\d+%/)?.[0] || '18%'} wait cut
                          </span>
                        </div>
                        <div className="flex flex-col bg-slate-950 p-2 border border-slate-900 rounded-lg">
                          <span className="text-slate-500 uppercase tracking-wider text-[8px] font-bold">Weighted Risk</span>
                          <span className="text-red-400 font-bold font-mono mt-0.5">LOW</span>
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 mt-1 text-[10px]">
                        <span className="text-slate-500 font-semibold">AI Reasoning:</span>
                        <p className="text-slate-400 leading-snug">{r.reasoning}</p>
                      </div>
                    </div>

                    {/* Implement Actions and Feedback Loop */}
                    {r.status === 'OPEN' ? (
                      <div className="flex items-center justify-between gap-3 pt-2">
                        <button
                          onClick={() => handleRecAction(r.id, 'IMPLEMENTED')}
                          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-[10px] flex-1 text-center transition-colors"
                        >
                          Implement Action
                        </button>
                        <button
                          onClick={() => handleRecAction(r.id, 'IGNORED')}
                          className="border border-slate-800 hover:border-slate-700 bg-slate-900 px-3 py-1.5 rounded-lg text-[10px] text-slate-400 transition-colors"
                        >
                          Ignore
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          Action {r.status.toLowerCase()}
                        </span>
                        
                        {/* Feedback loop rating buttons */}
                        <div className="flex items-center gap-2">
                          <span>Rate recommendation:</span>
                          <button
                            onClick={() => submitFeedback(r.id, 'HELPFUL')}
                            className={`p-1 rounded hover:bg-slate-900 ${feedbacks[r.id] === 'HELPFUL' ? 'text-emerald-500' : 'text-slate-500'}`}
                            aria-label="Mark helpful"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => submitFeedback(r.id, 'NOT_HELPFUL')}
                            className={`p-1 rounded hover:bg-slate-900 ${feedbacks[r.id] === 'NOT_HELPFUL' ? 'text-red-500' : 'text-slate-500'}`}
                            aria-label="Mark unhelpful"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
