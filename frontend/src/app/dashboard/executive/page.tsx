'use client';

import React, { useState } from 'react';
import { useStadium } from '../../../context/StadiumContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { 
  FileText, 
  TrendingUp, 
  Activity, 
  ShieldAlert, 
  Users, 
  Sun, 
  Clipboard, 
  Download, 
  Clock, 
  Award,
  Sparkles,
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

interface OperationsBrief {
  risks: string[];
  weatherForecast: string;
  expectedAttendance: number;
  peakEntryTime: string;
  volunteerShortages: string;
  transitDelays: string;
  securityAlerts: string;
  recommendedActions: string[];
  summary: string;
}

export default function ExecutiveAnalytics() {
  const { venue } = useStadium();
  const { speak } = useAccessibility();

  const [isGenerating, setIsGenerating] = useState(false);
  const [brief, setBrief] = useState<OperationsBrief | null>(null);

  // Mocked historical data for Recharts
  const historicalMatchData = [
    { name: 'Match 1', Attendance: 45000, WaitTime: 12, Incidents: 4, CarbonSaved: 1200 },
    { name: 'Match 2', Attendance: 52000, WaitTime: 18, Incidents: 6, CarbonSaved: 1400 },
    { name: 'Match 3', Attendance: 61000, WaitTime: 22, Incidents: 3, CarbonSaved: 1800 },
    { name: 'Match 4', Attendance: 74500, WaitTime: 35, Incidents: 8, CarbonSaved: 2200 }
  ];

  const handleGenerateBriefing = () => {
    setIsGenerating(true);
    setBrief(null);

    // Mocking Gemini generative briefing delay
    setTimeout(() => {
      const mockBrief: OperationsBrief = {
        risks: [
          'High thermal index (32°C) expected to increase dehydration incidents in East Stands.',
          'Meadowlands light rail shuttle experiencing a localized 15m signal check delay.',
          'Gate D security scanner 3 operates at reduced speed, bottlenecking peak entry flows.'
        ],
        weatherForecast: 'Mostly Sunny, High of 32°C. Humidity at 55%. Winds at 8 km/h.',
        expectedAttendance: 74500,
        peakEntryTime: '17:45 - 18:30 (Egress peak starts at 21:00)',
        volunteerShortages: 'Nominal. Zone B requires 3 general path monitors (currently filled by standby squads).',
        transitDelays: 'Rail transit loop experiencing a 15-minute wait time spike. Alternate rideshare hubs are active.',
        securityAlerts: 'Scanner Lane 3 at Gate D is undergoing hardware check; operating at 80% throughput.',
        recommendedActions: [
          'Divert incoming transit announcements to suggest Light Rail over Shuttle Bus.',
          'Open backup scan lanes at Gate B to relieve Gate D pressure.',
          'Trigger Hydration Warning notices on the Fan Application.'
        ],
        summary: `Operations are stable overall, with active bottlenecks being managed at Gate D and Shuttle Transit routes.`
      };

      setBrief(mockBrief);
      setIsGenerating(false);
      speak(`Operational brief generated for ${venue.replace('_', ' ')}. expected attendance is ${mockBrief.expectedAttendance}.`);
    }, 1800);
  };

  const exportPdf = () => {
    window.print();
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1400px] mx-auto">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            Executive Analytics
          </h1>
          <p className="text-slate-400 text-xs">
            CEO Tournament Cockpit. Monitor key revenue indicators, safety ratios, and generate operational briefs.
          </p>
        </div>

        <button
          onClick={handleGenerateBriefing}
          disabled={isGenerating}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black px-5 py-2.5 rounded-xl transition-all text-xs flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              Compiling Brief...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Generate Daily Brief
            </>
          )}
        </button>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-xl">
            <Award className="w-6 h-6 text-amber-500" />
          </div>
          <div className="flex flex-col text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Overall Safety Score</span>
            <span className="text-xl font-black text-slate-200 mt-0.5">96.4%</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-xl">
            <Users className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="flex flex-col text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Volunteer Efficiency</span>
            <span className="text-xl font-black text-slate-200 mt-0.5">92.1%</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-xl">
            <Activity className="w-6 h-6 text-blue-500" />
          </div>
          <div className="flex flex-col text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Transit Efficacy</span>
            <span className="text-xl font-black text-slate-200 mt-0.5">88.5%</span>
          </div>
        </div>

        <div className="glass-panel p-6 rounded-2xl flex items-center gap-4">
          <div className="bg-slate-900 p-3 rounded-xl">
            <Sun className="w-6 h-6 text-yellow-500" />
          </div>
          <div className="flex flex-col text-xs">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Sustainability Index</span>
            <span className="text-xl font-black text-slate-200 mt-0.5">89.4%</span>
          </div>
        </div>
      </div>

      {/* Daily Briefing Output (if compiled) */}
      {brief && (
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6 relative overflow-hidden border-l-4 border-l-amber-500">
          
          <div className="flex items-center justify-between border-b border-slate-900 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h2 className="font-extrabold text-sm uppercase tracking-wider">
                Daily Operational Briefing: {venue.replace('_', ' ')}
              </h2>
            </div>
            <button
              onClick={exportPdf}
              className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-950 rounded-lg text-slate-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed text-slate-400">
            {/* Column 1: Core Parameters */}
            <div className="flex flex-col gap-3">
              <div className="flex flex-col bg-slate-950 p-3 border border-slate-900 rounded-xl">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Expected Attendance</span>
                <span className="text-sm font-black text-slate-200 mt-1">{brief.expectedAttendance.toLocaleString()} Fans</span>
              </div>
              <div className="flex flex-col bg-slate-950 p-3 border border-slate-900 rounded-xl">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Weather Forecast</span>
                <span className="text-xs font-bold text-slate-200 mt-1">{brief.weatherForecast}</span>
              </div>
              <div className="flex flex-col bg-slate-950 p-3 border border-slate-900 rounded-xl">
                <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Peak Entry Slots</span>
                <span className="text-xs font-bold text-slate-200 mt-1">{brief.peakEntryTime}</span>
              </div>
            </div>

            {/* Column 2: Safety & Transit Risks */}
            <div className="flex flex-col gap-4">
              <div>
                <strong className="text-red-400 font-bold uppercase tracking-widest text-[9px] block mb-1">Critical Risks & Shortages</strong>
                <ul className="list-disc pl-4 flex flex-col gap-1.5">
                  {brief.risks.map((risk, i) => <li key={i}>{risk}</li>)}
                </ul>
              </div>
              <div className="border-t border-slate-900 pt-2">
                <strong className="text-yellow-400 font-bold uppercase tracking-widest text-[9px] block mb-1">Transit & Security Status</strong>
                <p>Transit delay: {brief.transitDelays}</p>
                <p className="mt-1">Security Alert: {brief.securityAlerts}</p>
              </div>
            </div>

            {/* Column 3: Recommended Actions */}
            <div className="flex flex-col bg-amber-950/10 border border-amber-900/30 p-4 rounded-xl">
              <strong className="text-amber-500 font-bold uppercase tracking-widest text-[9px] block mb-2">AI Recommended Actions</strong>
              <div className="flex flex-col gap-3">
                {brief.recommendedActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <span className="bg-amber-500/10 text-amber-500 w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-slate-350 leading-snug">{action}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Historical Match Comparison Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Attendance & Incident rates */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4.5 h-4.5 text-amber-500" />
            Attendance vs Incident Rates
          </h2>

          <div className="w-full h-72 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={historicalMatchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="Attendance" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.08} strokeWidth={2} />
                <Area type="monotone" dataKey="Incidents" stroke="#ef4444" fill="#ef4444" fillOpacity={0.05} strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Concourse Wait Times comparison */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
          <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4.5 h-4.5 text-amber-500" />
            Average Gate Wait Times (min)
          </h2>

          <div className="w-full h-72 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historicalMatchData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                <Bar dataKey="WaitTime" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
