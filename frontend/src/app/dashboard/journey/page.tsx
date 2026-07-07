'use client';

import React, { useState } from 'react';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { 
  MapPin, 
  Car, 
  Coffee, 
  Accessibility, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  Volume2, 
  Info,
  Calendar,
  Compass,
  CheckCircle2
} from 'lucide-react';

interface ItineraryStep {
  stage: string;
  time: string;
  description: string;
  tip: string;
}

export default function FanJourneyPlanner() {
  const { speak } = useAccessibility();

  // Inputs state
  const [seat, setSeat] = useState('Section 112, Row D');
  const [transport, setTransport] = useState('Metro');
  const [food, setFood] = useState('Burgers & Fries');
  const [accessibility, setAccessibility] = useState('None');
  const [language, setLanguage] = useState('English');

  const [isGenerating, setIsGenerating] = useState(false);
  const [journeySteps, setJourneySteps] = useState<ItineraryStep[] | null>(null);
  const [suggestedGate, setSuggestedGate] = useState('');
  const [accessibilityAdvice, setAccessibilityAdvice] = useState('');

  const handleGenerateJourney = () => {
    setIsGenerating(true);
    setJourneySteps(null);

    // Mocking Gemini generative itinerary latency
    setTimeout(() => {
      let gate = 'Gate C';
      let accessMsg = 'Standard escalator access routes are operational.';

      if (accessibility === 'Wheelchair') {
        gate = 'Gate C (Designated Access Gate)';
        accessMsg = 'TACTICAL ADVICE: Proceed through security lane 6 (wide access). Take the East Elevator behind Section 106 to Level 2. Wheelchair deck seating 112-A is located directly adjacent.';
      } else if (accessibility === 'Stroller') {
        gate = 'Gate C Plaza';
        accessMsg = 'Stroller storage lockers are available at the main gate guest services kiosk.';
      }

      const steps: ItineraryStep[] = [
        {
          stage: 'Hotel Departure',
          time: '16:00',
          description: `Depart your hotel and board the ${transport} express service towards Meadowlands Arena.`,
          tip: 'Have your digital transit pass loaded and ready on your wallet app.'
        },
        {
          stage: 'Stadium Arrival',
          time: '17:15',
          description: `Arrive at the stadium perimeter. Follow signage directs directly towards ${gate}.`,
          tip: 'Stadium security strictly permits clear bags only. Expect bag check lines.'
        },
        {
          stage: 'Gate Access Scan',
          time: '17:35',
          description: `Enter security scanning lane. If using wheelchair access, report to Wide Lane 6.`,
          tip: 'Ticket barcodes must be scanned from your official World Cup App.'
        },
        {
          stage: 'Food & Beverage Stop',
          time: '17:55',
          description: `Head to Food Court East (located immediately behind Section 114) and pick up ${food}.`,
          tip: 'Concessions are cash-free; pay using credit or mobile payment interfaces.'
        },
        {
          stage: 'Seat Location',
          time: '18:15',
          description: `Locate Section 112, Row D. Pre-match anthems and laser showcases begin in 15 minutes.`,
          tip: 'Need assistance? Ask any nearby volunteer in a high-visibility yellow vest.'
        },
        {
          stage: 'Exit & Rideshare',
          time: '21:00',
          description: 'Exit via Gate C. Proceed directly to Rideshare Zone B in Lot C to request your return transport.',
          tip: 'Stay seated inside the stadium for 15 minutes post-match to bypass the main gate rush.'
        }
      ];

      setSuggestedGate(gate);
      setAccessibilityAdvice(accessMsg);
      setJourneySteps(steps);
      setIsGenerating(false);

      speak(`Personalized match day planner compiled for seat ${seat}. Best entry gate is ${gate}.`);
    }, 1500);
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1200px] mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          AI Fan Journey Planner
        </h1>
        <p className="text-slate-400 text-xs">
          Generate a custom chronological itinerary from your hotel to your seat, matching your transport and physical needs.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Form: Preferences (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
              <Compass className="w-4.5 h-4.5 text-amber-500" />
              Journey Preferences
            </h2>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 font-bold">Seat Location (Ticket Details)</span>
                <input
                  type="text"
                  value={seat}
                  onChange={(e) => setSeat(e.target.value)}
                  placeholder="e.g. Section 112, Row D"
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 font-bold">Preferred Transit Mode</span>
                <select
                  value={transport}
                  onChange={(e) => setTransport(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                >
                  <option value="Metro">Light Rail Metro Express</option>
                  <option value="Shuttle Bus">FIFA Shuttle Bus</option>
                  <option value="Taxi">Official Taxi Line</option>
                  <option value="Rideshare">Uber / Lyft Rideshare</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 font-bold">Food Preferences</span>
                <select
                  value={food}
                  onChange={(e) => setFood(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                >
                  <option value="Burgers & Fries">Classic Burgers & Fries</option>
                  <option value="Tacos & Nachos">Mexican Tacos & Nachos</option>
                  <option value="Vegan Falafel Wrap">Vegan Falafel Wrap & Salad</option>
                  <option value="Gluten-free Pizza">Gluten-free Pepperoni Pizza</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 font-bold">Accessibility Requirements</span>
                <select
                  value={accessibility}
                  onChange={(e) => setAccessibility(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                >
                  <option value="None">None (Standard Escalators)</option>
                  <option value="Wheelchair">Wheelchair Access (Elevators / Ramps)</option>
                  <option value="Stroller">Stroller / Pram Storage Lockers</option>
                  <option value="Assistance Dog">Assistance / Guide Dog Ramps</option>
                </select>
              </div>

              <button
                onClick={handleGenerateJourney}
                disabled={isGenerating}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black py-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-2 mt-2 disabled:opacity-50"
              >
                {isGenerating ? 'Generating Itinerary...' : 'Compile Personalized Journey'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel: Itinerary Output (lg:col-span-7) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {journeySteps ? (
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-6">
              
              {/* Summary info cards */}
              <div className="flex flex-col md:flex-row gap-4 border-b border-slate-900 pb-4">
                <div className="flex flex-col bg-slate-900/60 p-3 rounded-xl border border-slate-850 flex-1 text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Suggested Entry Gate</span>
                  <span className="text-amber-500 font-black mt-1 text-sm">{suggestedGate}</span>
                </div>
                <div className="flex flex-col bg-slate-900/60 p-3 rounded-xl border border-slate-850 flex-1 text-xs">
                  <span className="text-slate-500 font-bold uppercase tracking-wider text-[8px]">Total Transit Time</span>
                  <span className="text-slate-200 font-black mt-1 text-sm">~1h 45m</span>
                </div>
              </div>

              {/* Accessibility Advice Banner */}
              {accessibility !== 'None' && (
                <div className="bg-blue-950/20 border border-blue-900/50 p-4 rounded-xl text-xs text-blue-200 flex items-start gap-2.5 leading-relaxed">
                  <Accessibility className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                  <p>{accessibilityAdvice}</p>
                </div>
              )}

              {/* Timeline list */}
              <div className="flex flex-col gap-6 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-900">
                {journeySteps.map((step, idx) => (
                  <div key={idx} className="flex gap-4 relative pl-8 text-xs leading-relaxed">
                    
                    {/* Circle Node */}
                    <div className="absolute left-1.5 top-1.5 w-6 h-6 rounded-full bg-slate-950 border-2 border-amber-500 flex items-center justify-center font-bold text-[9px] text-amber-500">
                      {idx + 1}
                    </div>

                    <div className="flex flex-col gap-1.5 bg-slate-900/40 border border-slate-850 p-4 rounded-xl flex-1">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1.5">
                        <span className="font-extrabold text-slate-200">{step.stage}</span>
                        <span className="text-[10px] font-mono text-amber-500 font-bold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {step.time}
                        </span>
                      </div>
                      <p className="text-slate-400">{step.description}</p>
                      <p className="text-[10px] text-slate-500 italic mt-0.5">Tip: {step.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isGenerating ? (
            <div className="glass-panel rounded-2xl p-8 flex flex-col items-center justify-center gap-4 aspect-[2/1]">
              <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Creating Personal Itinerary using Gemini...</span>
            </div>
          ) : (
            <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center gap-4 text-center aspect-[2/1]">
              <Calendar className="w-12 h-12 text-slate-700" />
              <h3 className="font-extrabold text-sm text-slate-400">No itinerary compiled yet.</h3>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                Input your ticket seat and transport choices, and click the button to generate your personal timeline.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
