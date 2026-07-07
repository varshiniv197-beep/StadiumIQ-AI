'use client';

import React, { useState } from 'react';
import { 
  Map, 
  Compass, 
  MapPin, 
  ArrowRight, 
  Activity, 
  Footprints, 
  Accessibility, 
  Users, 
  Zap, 
  Home, 
  Volume2,
  Droplet,
  Heart,
  Coffee,
  Bus,
  Shield
} from 'lucide-react';

type RouteType = 'BEST' | 'LEAST_CROWDED' | 'WHEELCHAIR' | 'FAMILY' | 'FASTEST';

interface AmenityPin {
  id: string;
  name: string;
  category: 'RESTROOM' | 'MEDICAL' | 'FOOD' | 'WATER' | 'TRANSIT';
  x: number;
  y: number;
}

export default function SmartIndoorNavigation() {
  const [routeType, setRouteType] = useState<RouteType>('BEST');
  const [destination, setDestination] = useState('Section 112');
  const [startPoint, setStartPoint] = useState('Gate C');
  
  // Highlight Toggles
  const [highlightCategory, setHighlightCategory] = useState<string | null>(null);

  const routeDetails = {
    BEST: {
      color: 'stroke-amber-500',
      description: 'Standard optimal route avoiding high-friction security queues.',
      steps: [
        'Enter through Gate C security lane 2.',
        'Walk straight past the Main Info desk (15 meters).',
        'Ascend Escalator B to Level 2 Concourse.',
        'Turn left and walk past Food Court East.',
        'Arrive at Section 112 entrance corridor.'
      ],
      distance: '180m',
      time: '3 minutes'
    },
    LEAST_CROWDED: {
      color: 'stroke-emerald-500',
      description: 'Diverts via Concourse South to bypass Gate D entrance backups (currently at 84% load).',
      steps: [
        'Enter through Gate C lane 5 (low congestion).',
        'Turn right immediately into Concourse South.',
        'Follow corridor south to Section 118 elevator lobby.',
        'Walk through Level 2 crossover to avoid food court lines.',
        'Arrive at Section 112 from the backside.'
      ],
      distance: '240m',
      time: '4.5 minutes'
    },
    WHEELCHAIR: {
      color: 'stroke-blue-500',
      description: 'Zero-step route utilizing ramps, elevators, and wide corridors.',
      steps: [
        'Enter via Gate C mobility designated entrance.',
        'Take the East Elevator adjacent to Section 106 to Level 2.',
        'Follow the tactile guidance lines along the wide Concourse deck.',
        'Wheelchair-accessible seating located at Deck 112-A.',
        'Wheelchair restrooms available next to entry lobby.'
      ],
      distance: '190m',
      time: '4 minutes'
    },
    FAMILY: {
      color: 'stroke-yellow-500',
      description: 'Avoids escalators, passes by baby-changing rooms and drinking fountains.',
      steps: [
        'Enter Gate C family scan portal.',
        'Stop at water fountain and family restrooms behind Sec 104.',
        'Take Elevator East to Concourse level 2.',
        'Proceed along the child-safe boundary rail.',
        'Arrive at Section 112.'
      ],
      distance: '200m',
      time: '4 minutes'
    },
    FASTEST: {
      color: 'stroke-red-500',
      description: 'Direct escalator sequence; note this path contains stairs and high foot traffic.',
      steps: [
        'Scan ticket at Gate C. Proceed immediately.',
        'Take the central speed-escalator straight to level 2.',
        'Cut directly through Food Court East concourse.',
        'Enter Section 112 entry portal.'
      ],
      distance: '150m',
      time: '2 minutes'
    }
  };

  const amenities: AmenityPin[] = [
    { id: '1', name: 'Mobility Restroom A', category: 'RESTROOM', x: 200, y: 80 },
    { id: '2', name: 'Section 112 Restroom', category: 'RESTROOM', x: 300, y: 70 },
    { id: '3', name: 'Primary Medical Station 1', category: 'MEDICAL', x: 100, y: 150 },
    { id: '4', name: 'Food Court East Concessions', category: 'FOOD', x: 320, y: 160 },
    { id: '5', name: 'Water Fountain Sec 104', category: 'WATER', x: 150, y: 220 },
    { id: '6', name: 'Meadowlands Shuttle Terminal', category: 'TRANSIT', x: 200, y: 280 }
  ];

  // SVG coordinates for routes
  const getPathCoords = (type: RouteType) => {
    switch (type) {
      case 'BEST':
        return 'M 200 250 L 200 180 L 150 140 L 260 140 L 300 80';
      case 'LEAST_CROWDED':
        return 'M 200 250 L 280 250 L 340 180 L 340 100 L 300 80';
      case 'WHEELCHAIR':
        return 'M 200 250 L 120 250 L 80 180 L 80 120 L 200 80 L 300 80';
      case 'FAMILY':
        return 'M 200 250 L 200 220 L 150 220 L 120 160 L 250 160 L 300 80';
      case 'FASTEST':
        return 'M 200 250 L 200 150 L 300 80';
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1400px] mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Compass className="w-5 h-5 text-amber-500" />
          Smart Indoor Navigation
        </h1>
        <p className="text-slate-400 text-xs">
          Interactive route mapping for wheelchair, family-friendly, and congestion-avoiding journeys.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Control Panel (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          {/* Destination Form Selector */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider">
              Route Planner Settings
            </h2>
            
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1.5 text-xs">
                <span className="text-slate-500 font-bold">Start Location</span>
                <select
                  value={startPoint}
                  onChange={(e) => setStartPoint(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:ring-0 focus:outline-none"
                >
                  <option value="Gate C">Gate C Plaza (East Entry)</option>
                  <option value="Gate D">Gate D Plaza (North Entry)</option>
                  <option value="Metro Loop">Metro West Loop Terminal</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5 text-xs">
                <span className="text-slate-500 font-bold">Destination</span>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:ring-0 focus:outline-none"
                >
                  <option value="Section 112">Section 112 (East Stand)</option>
                  <option value="Food Court East">Food Court East Concessions</option>
                  <option value="Medical Room 1">Medical Station 1</option>
                  <option value="VIP Suite 4">VIP Executive Suite 4</option>
                </select>
              </div>
            </div>

            {/* Route Type select buttons */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-900">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                AI Optimization Metrics
              </span>
              <div className="flex flex-col gap-1.5">
                {(['BEST', 'LEAST_CROWDED', 'WHEELCHAIR', 'FAMILY', 'FASTEST'] as RouteType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => setRouteType(type)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl border text-xs font-bold transition-all ${
                      routeType === type 
                        ? 'border-amber-500 bg-amber-500/10 text-amber-500' 
                        : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <span className="capitalize">{type.replace('_', ' ')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Turn-by-Turn Instruction Panel */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-slate-900 pb-2">
              <h2 className="font-extrabold text-sm uppercase tracking-wider">
                Travel Directions
              </h2>
              <div className="text-[10px] font-bold font-mono text-slate-500">
                {routeDetails[routeType].distance} | {routeDetails[routeType].time}
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic leading-relaxed">
              {routeDetails[routeType].description}
            </p>

            <div className="flex flex-col gap-3 mt-2">
              {routeDetails[routeType].steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs">
                  <span className="bg-slate-900 text-amber-500 w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-slate-400 leading-snug mt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Indoor Map Rendering (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            
            {/* Map Action Filters */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-900 pb-4">
              <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                <Map className="w-5 h-5 text-amber-500" />
                Live Map Blueprint
              </h2>

              {/* Amenity overlays filters */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {[
                  { key: 'RESTROOM', label: 'Restrooms', icon: <Volume2 className="w-3 h-3" /> },
                  { key: 'MEDICAL', label: 'Medical', icon: <Heart className="w-3 h-3" /> },
                  { key: 'FOOD', label: 'Food Kiosks', icon: <Coffee className="w-3 h-3" /> },
                  { key: 'WATER', label: 'Water', icon: <Droplet className="w-3 h-3" /> },
                  { key: 'TRANSIT', label: 'Transit', icon: <Bus className="w-3 h-3" /> }
                ].map(item => (
                  <button
                    key={item.key}
                    onClick={() => setHighlightCategory(highlightCategory === item.key ? null : item.key)}
                    className={`px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all flex items-center gap-1 ${
                      highlightCategory === item.key 
                        ? 'border-amber-500 bg-amber-500 text-slate-950' 
                        : 'border-slate-800 bg-slate-900 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Stadium map SVG canvas drawing paths */}
            <div className="w-full aspect-[4/3] bg-slate-950 rounded-xl border border-slate-900 relative flex items-center justify-center p-6 overflow-hidden">
              
              <svg className="w-full h-full max-w-[500px] max-h-[400px]" viewBox="0 0 400 300">
                {/* Stadium Outer Blueprint Oval */}
                <ellipse cx="200" cy="150" rx="180" ry="120" fill="none" stroke="#1e293b" strokeWidth="4" />
                
                {/* Stadium Inner Deck Oval */}
                <ellipse cx="200" cy="150" rx="140" ry="90" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4 4" />
                
                {/* Stadium Center Field pitch */}
                <rect x="150" y="110" width="100" height="80" fill="none" stroke="#047857" strokeWidth="2" opacity="0.3" />
                
                {/* Midfield line and circle */}
                <line x1="200" y1="110" x2="200" y2="190" stroke="#047857" strokeWidth="2" opacity="0.3" />
                <circle cx="200" cy="150" r="20" fill="none" stroke="#047857" strokeWidth="2" opacity="0.3" />

                {/* Animated Path overlays based on chosen Route */}
                <path
                  d={getPathCoords(routeType)}
                  fill="none"
                  className={`${routeDetails[routeType].color} stroke-[4] stroke-linecap-round`}
                  strokeDasharray="8 6"
                >
                  {/* Dashed line runner animation */}
                  <animate 
                    attributeName="stroke-dashoffset" 
                    values="100;0" 
                    dur="5s" 
                    repeatCount="indefinite" 
                  />
                </path>

                {/* Highlighted Pin Nodes */}
                {amenities.map(a => {
                  const isHighlighted = highlightCategory === a.category;
                  return (
                    <g key={a.id} className={`transition-all duration-300 ${isHighlighted ? 'scale-125 opacity-100' : highlightCategory ? 'opacity-20 scale-95' : 'opacity-80'}`}>
                      <circle
                        cx={a.x}
                        cy={a.y}
                        r="8"
                        className={
                          a.category === 'RESTROOM' ? 'fill-blue-500' :
                          a.category === 'MEDICAL' ? 'fill-red-500' :
                          a.category === 'FOOD' ? 'fill-yellow-500' :
                          a.category === 'WATER' ? 'fill-cyan-500' : 'fill-purple-500'
                        }
                      />
                      <circle cx={a.x} cy={a.y} r="12" fill="none" className="stroke-slate-100 stroke-[1.5] animate-ping" />
                      <text x={a.x} y={a.y - 12} textAnchor="middle" className="fill-slate-300 text-[8px] font-bold font-sans">
                        {a.name}
                      </text>
                    </g>
                  );
                })}

                {/* End Point node flag marker */}
                <g transform="translate(300, 80)">
                  <path d="M 0 0 L 10 -15 L -10 -15 Z" className="fill-red-500 stroke-slate-900" />
                  <circle cx="0" cy="0" r="4" className="fill-slate-100" />
                  <text x="0" y="-20" textAnchor="middle" className="fill-slate-100 font-extrabold text-[9px]">
                    {destination}
                  </text>
                </g>

                {/* Start Point marker */}
                <g transform="translate(200, 250)">
                  <circle cx="0" cy="0" r="6" className="fill-amber-500 stroke-slate-900" />
                  <circle cx="0" cy="0" r="10" className="stroke-amber-500 fill-none stroke-[2] animate-ping" />
                  <text x="0" y="16" textAnchor="middle" className="fill-amber-500 font-extrabold text-[9px]">
                    {startPoint}
                  </text>
                </g>
              </svg>

              {/* Float map type information card */}
              <div className="absolute top-4 right-4 bg-slate-950/90 border border-slate-900 p-3 rounded-lg text-[9px] flex flex-col gap-1.5 z-10 max-w-xs leading-relaxed">
                <span className="font-extrabold text-amber-500 border-b border-slate-900 pb-1">MAP LEGEND</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-amber-500 border-t-2 border-dashed border-amber-500"></span>
                  <span>Active Route Path Overlay</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                  <span>Medical Aid Stations</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  <span>Wheelchair Restrooms</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
