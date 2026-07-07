'use client';

import React from 'react';
import { useStadium } from '../../../context/StadiumContext';
import { 
  Activity, 
  Sun, 
  Droplet, 
  Trash2, 
  Leaf, 
  Lightbulb, 
  TrendingDown, 
  Thermometer, 
  Sparkles 
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';

export default function SustainabilityMonitor() {
  const { venue } = useStadium();

  // Simulated metrics per venue
  const getMetrics = () => {
    if (venue === 'METLIFE_STADIUM') {
      return { energy: 7800, water: 45000, waste: 1800, recycling: 76, carbon: 3100, solar: 2400, foodWaste: 350 };
    } else if (venue === 'ESTADIO_AZTECA') {
      return { energy: 6200, water: 38000, waste: 1400, recycling: 82, carbon: 2400, solar: 1800, foodWaste: 280 };
    } else {
      return { energy: 4100, water: 22000, waste: 900, recycling: 88, carbon: 1500, solar: 3100, foodWaste: 150 };
    }
  };

  const metrics = getMetrics();

  // Simulated data for Recharts Energy comparison
  const solarGenData = [
    { name: '12:00', GridConsumption: 1200, SolarGeneration: 400 },
    { name: '14:00', GridConsumption: 1500, SolarGeneration: 800 },
    { name: '16:00', GridConsumption: 1800, SolarGeneration: 1100 },
    { name: '18:00', GridConsumption: 2400, SolarGeneration: 900 },
    { name: '20:00', GridConsumption: 3500, SolarGeneration: 200 }
  ];

  const aiAdvice = [
    {
      title: 'LED Pitch-Lighting Dimming Sequence',
      description: 'Dim concourse and auxiliary display board lighting by 20% during match play.',
      savings: '$320 / match',
      carbonOffset: '128 kg CO2',
      type: 'ENERGY'
    },
    {
      title: 'HVAC Temperature Correction',
      description: 'Increase standard target temperature in unoccupied corporate suites to 24°C.',
      savings: '$640 / match',
      carbonOffset: '256 kg CO2',
      type: 'ENERGY'
    },
    {
      title: 'Water pressure throttling',
      description: 'Throttling greywater pump pressure by 5% during peak half-time flushes.',
      savings: '$110 / match',
      carbonOffset: '8 kg CO2',
      type: 'WATER'
    }
  ];

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1400px] mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Leaf className="w-5 h-5 text-emerald-500" />
          Sustainability Monitor
        </h1>
        <p className="text-slate-400 text-xs">
          AI sustainability parameters tracking carbon offsets, water pressures, waste recycling ratios, and solar generation savings.
        </p>
      </div>

      {/* Grid: 4 Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Solar Gen Offset */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Solar Generation</span>
            <Sun className="w-4 h-4 text-yellow-500 animate-spin [animation-duration:10s]" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-200 font-mono">{metrics.solar}</span>
            <span className="text-[10px] text-slate-500 font-bold">kWh</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
            <div className="h-full bg-yellow-500" style={{ width: `${(metrics.solar/metrics.energy)*100}%` }}></div>
          </div>
        </div>

        {/* Card 2: Carbon Footprint */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Carbon Footprint</span>
            <Leaf className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-200 font-mono">{metrics.carbon}</span>
            <span className="text-[10px] text-slate-500 font-bold">kg CO2</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>12% lower than match average</span>
          </div>
        </div>

        {/* Card 3: Water Pressure */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Water Consumption</span>
            <Droplet className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-200 font-mono">{metrics.water.toLocaleString()}</span>
            <span className="text-[10px] text-slate-500 font-bold">Liters</span>
          </div>
          <div className="w-full bg-slate-900 h-1 rounded overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
          </div>
        </div>

        {/* Card 4: Waste Recycling */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Recycling Ratio</span>
            <Trash2 className="w-4 h-4 text-teal-500" />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-slate-200 font-mono">{metrics.recycling}%</span>
            <span className="text-[10px] text-slate-500 font-bold">recycled</span>
          </div>
          <div className="text-[10px] text-slate-500 font-semibold">
            Target: 80% recycling rate
          </div>
        </div>
      </div>

      {/* Grid: Graph and AI Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Recharts Grid Energy Offset Graph (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4.5 h-4.5 text-amber-500" />
              Power consumption vs Solar Offset
            </h2>

            <div className="w-full h-80 bg-slate-950/40 p-4 rounded-xl border border-slate-900">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={solarGenData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={10} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px' }} />
                  <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="GridConsumption" fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={2} />
                  <Line type="monotone" dataKey="SolarGeneration" stroke="#eab308" strokeWidth={2.5} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: AI Energy Optimizer panel (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              AI Energy Optimizer
            </h2>

            <p className="text-[11px] text-slate-500 leading-relaxed">
              Google Gemini analyzes stadium outdoor climates and passenger density levels to optimize electrical grid demand.
            </p>

            <div className="flex flex-col gap-4 mt-2">
              {aiAdvice.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-900/50 border border-slate-850 rounded-xl flex flex-col gap-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-950 pb-1.5">
                    <span className="font-extrabold text-slate-200">{item.title}</span>
                    <span className="bg-emerald-500/10 text-emerald-400 font-bold px-1.5 py-0.5 rounded text-[8px] font-mono shrink-0">
                      {item.carbonOffset}
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">{item.description}</p>
                  
                  <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 font-semibold">
                    <span>Est. Savings: <strong className="text-slate-350">{item.savings}</strong></span>
                    <span className="flex items-center gap-1 text-emerald-500">
                      <TrendingDown className="w-3 h-3" />
                      Climate offset
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
