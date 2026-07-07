'use client';

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  Activity, 
  Sliders, 
  HelpCircle,
  Clock,
  ArrowRight,
  TrendingDown,
  Info,
  CheckCircle
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

interface ZoneData {
  zone: string;
  current: number;
  capacity: number;
  wait: number;
  level: number;
  status: 'OPTIMAL' | 'CONGESTED' | 'CRITICAL';
}

export default function AICrowdIntelligence() {
  const [attendance, setAttendance] = useState(55000);
  const [activeAlerts, setActiveAlerts] = useState<string[]>([]);
  const [zones, setZones] = useState<ZoneData[]>([]);
  const [forecastData, setForecastData] = useState<any[]>([]);

  // Recalculate crowd logs based on attendance slider
  useEffect(() => {
    const calculatedZones: ZoneData[] = [
      { zone: 'Gate A (Concourse West)', current: Math.round(attendance * 0.15), capacity: 10000, wait: Math.round((attendance * 0.15) / 100 * 2.5), level: 0, status: 'OPTIMAL' },
      { zone: 'Gate B (VIP East)', current: Math.round(attendance * 0.08), capacity: 6000, wait: Math.round((attendance * 0.08) / 80 * 1.5), level: 0, status: 'OPTIMAL' },
      { zone: 'Gate C (East Entry)', current: Math.round(attendance * 0.22), capacity: 15000, wait: Math.round((attendance * 0.22) / 120 * 3), level: 0, status: 'OPTIMAL' },
      { zone: 'Gate D (North Plaza)', current: Math.round(attendance * 0.35), capacity: 18000, wait: Math.round((attendance * 0.35) / 140 * 4), level: 0, status: 'OPTIMAL' },
      { zone: 'VIP Lounge (Level 3)', current: Math.round(attendance * 0.05), capacity: 4000, wait: 0, level: 0, status: 'OPTIMAL' }
    ];

    // Compute status levels
    const finalZones: ZoneData[] = calculatedZones.map(z => {
      const level = Number((z.current / z.capacity).toFixed(2));
      const status = (level > 0.85 ? 'CRITICAL' : level > 0.65 ? 'CONGESTED' : 'OPTIMAL') as 'OPTIMAL' | 'CONGESTED' | 'CRITICAL';
      return { ...z, level, status };
    });

    setZones(finalZones);

    // Dynamic AI Alerts based on attendance scale
    const alertsList = [];
    if (attendance > 65000) {
      alertsList.push('CRITICAL BOTTLENECK: Gate D Plaza wait time exceeds 30m. Recommend opening backup Gate B relief lanes.');
    }
    if (attendance > 72000) {
      alertsList.push('CROWD PRESSURE WARNING: Concourse North is at 94% density. Instructing stewards to enforce unidirectional egress.');
    }
    if (attendance < 40000) {
      alertsList.push('SYSTEM ALERT: Entry flows are within nominal limits. Standard staffing applies.');
    }
    setActiveAlerts(alertsList);

    // Generate Recharts forecast chart array
    const chartData = [
      { name: 'Current', 'Gate A': finalZones[0].current, 'Gate C': finalZones[2].current, 'Gate D': finalZones[3].current },
      { name: '10m', 'Gate A': Math.round(finalZones[0].current * 1.05), 'Gate C': Math.round(finalZones[2].current * 1.08), 'Gate D': Math.round(finalZones[3].current * 1.12) },
      { name: '20m', 'Gate A': Math.round(finalZones[0].current * 1.08), 'Gate C': Math.round(finalZones[2].current * 1.14), 'Gate D': Math.round(finalZones[3].current * 1.25) },
      { name: '30m', 'Gate A': Math.round(finalZones[0].current * 1.12), 'Gate C': Math.round(finalZones[2].current * 1.20), 'Gate D': Math.round(finalZones[3].current * 1.34) },
      { name: '60m', 'Gate A': Math.round(finalZones[0].current * 0.90), 'Gate C': Math.round(finalZones[2].current * 0.85), 'Gate D': Math.round(finalZones[3].current * 0.70) } // outflow
    ];
    setForecastData(chartData);

  }, [attendance]);

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1400px] mx-auto">
      
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-500" />
          AI Crowd Intelligence
        </h1>
        <p className="text-slate-400 text-xs">
          Predictive flow metrics, queue waiting predictions, and exit bottleneck warnings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Panel: Sandbox slider & Alerts (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Stress test simulator control card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4.5 h-4.5 text-amber-500" />
              Crowd Stress Test Sandbox
            </h2>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Slide the attendance count to test how stadium security scanning gates, queue corridors, and wait-time algorithms handle high capacity loads.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Simulated Attendance</span>
                <span className="text-amber-500 font-mono text-sm">{attendance.toLocaleString()} Fans</span>
              </div>
              <input
                type="range"
                min="10000"
                max="80000"
                step="2000"
                value={attendance}
                onChange={(e) => setAttendance(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
              />
              <div className="flex justify-between text-[9px] text-slate-600 font-bold uppercase tracking-wider">
                <span>10k (Low)</span>
                <span>45k (Nominal)</span>
                <span>80k (Cap Limit)</span>
              </div>
            </div>
          </div>

          {/* AI Advisor Alerts card */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 text-red-500">
              <ShieldAlert className="w-4.5 h-4.5 animate-pulse" />
              AI Safety Dispatcher
            </h2>
            <div className="flex flex-col gap-3">
              {activeAlerts.length === 0 ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs bg-emerald-950/30 border border-emerald-900/50 p-4 rounded-xl">
                  <CheckCircle className="w-4.5 h-4.5 shrink-0" />
                  <span>No overcrowding hazards. All entry lanes operating optimally.</span>
                </div>
              ) : (
                activeAlerts.map((a, i) => (
                  <div key={i} className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl text-xs flex items-start gap-2.5 leading-relaxed text-red-200">
                    <ShieldAlert className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                    <p>{a}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Graphs Panel: Telemetry list & Recharts Forecast (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Live Telemetry lists */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider">
              Gate Queues & Sensor Metrics
            </h2>

            <div className="flex flex-col gap-3">
              {zones.map((z, idx) => (
                <div key={idx} className="p-4 bg-slate-900/50 border border-slate-850 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="font-bold text-slate-300">{z.zone}</span>
                    <span className="text-[11px] text-slate-500">
                      Processing: <strong>{z.current.toLocaleString()}</strong> / {z.capacity.toLocaleString()} max capacity
                    </span>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{z.wait > 0 ? `${z.wait} min wait` : 'No Queue'}</span>
                    </div>

                    {/* Progress Bar and status tags */}
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                        <div 
                          className={`h-full rounded-full ${
                            z.status === 'CRITICAL' ? 'bg-red-500' : z.status === 'CONGESTED' ? 'bg-yellow-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${z.level * 100}%` }}
                        ></div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                        z.status === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : z.status === 'CONGESTED' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'
                      }`}>
                        {z.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recharts 60m Queue Forecast graph */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4.5 h-4.5 text-amber-500" />
              60-Minute Queue Forecast Projections
            </h2>

            <div className="w-full h-80 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }}
                    labelStyle={{ color: '#94a3b8', fontWeight: 'bold' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Line type="monotone" dataKey="Gate A" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="Gate C" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="Gate D" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
