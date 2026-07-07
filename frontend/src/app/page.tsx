'use client';

import React from 'react';
import Link from 'next/link';
import { useStadium } from '../context/StadiumContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { 
  Shield, 
  Map, 
  Users, 
  Zap, 
  HeartHandshake, 
  Globe, 
  Cpu, 
  Activity, 
  ArrowRight,
  Eye,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function LandingPage() {
  const { countdown } = useStadium();
  const { toggleHighContrast, highContrast } = useAccessibility();

  const features = [
    {
      icon: <Map className="w-8 h-8 text-amber-500" />,
      title: 'Smart Indoor Navigation',
      description: 'AI-generated pathways mapping standard, least crowded, and wheelchair accessible paths.'
    },
    {
      icon: <Users className="w-8 h-8 text-emerald-500" />,
      title: 'Crowd Intelligence',
      description: 'Predictive density heatmaps and automated queue optimization systems.'
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: 'Real-Time Decision Support',
      description: 'Gemini-driven operations advice responding to weather delays, transit loads, and crowd rushes.'
    },
    {
      icon: <HeartHandshake className="w-8 h-8 text-blue-500" />,
      title: 'Volunteer Assistant Portal',
      description: 'Dynamic task dispatching and AI-generated incident response timelines.'
    },
    {
      icon: <Globe className="w-8 h-8 text-teal-500" />,
      title: 'Sustainability Tracker',
      description: 'Monitoring carbon offset, waste recycling ratios, and solar generation savings.'
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: 'Emergency Management',
      description: 'Evacuation mapping overlay systems and multi-language announcements generator.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* 1. Header Navigation */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500 text-slate-950 p-2 rounded-lg font-bold tracking-wider text-sm">
            STADIUMIQ
          </div>
          <span className="font-bold tracking-tight text-xl text-slate-200">
            AI Operations Console
          </span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <a href="#features" className="hover:text-amber-500 transition-colors">Core Features</a>
          <a href="#stats" className="hover:text-amber-500 transition-colors">Analytics</a>
          <a href="#about" className="hover:text-amber-500 transition-colors">Tournament Scope</a>
        </nav>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleHighContrast}
            className="p-2 border border-slate-800 rounded-lg text-slate-400 hover:text-amber-500 hover:border-slate-700 transition-colors flex items-center gap-2 text-xs"
            aria-label="Toggle contrast settings"
          >
            <Eye className="w-4 h-4" />
            {highContrast ? 'Standard Contrast' : 'High Contrast'}
          </button>
          <Link 
            href="/dashboard"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
          >
            Launch Command Center
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative flex-1 py-20 px-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <div className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-semibold self-start">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            FIFA World Cup 2026 Ready
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-slate-100 to-amber-500">
            AI-Powered Smart Stadium Operations.
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed max-w-xl">
            StadiumIQ AI streamlines tournament operations, crowd logistics, public transit systems, and emergency evacuation matrices to ensure maximum safety and fan experience.
          </p>

          {/* Countdown Clock */}
          <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col gap-3 max-w-md">
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">
              Match Kickoff Countdown
            </span>
            <div className="text-2xl md:text-3xl font-mono font-black text-amber-500 tracking-wider">
              {countdown}
            </div>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <Link 
              href="/dashboard"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 text-md"
            >
              Enter Operations Console
            </Link>
            <a 
              href="#features"
              className="border border-slate-800 hover:border-slate-700 bg-slate-900/40 px-6 py-4 rounded-xl transition-colors text-slate-300 font-semibold"
            >
              Explore AI Features
            </a>
          </div>
        </div>

        {/* CSS-Animated Stadium Blueprint */}
        <div className="relative flex justify-center lg:justify-end">
          <div className="w-full max-w-[450px] aspect-square rounded-full border-4 border-dashed border-slate-800 flex items-center justify-center p-8 animate-[spin_100s_linear_infinite]">
            <div className="w-full h-full rounded-full border-4 border-slate-700/60 flex items-center justify-center relative">
              <div className="w-3/4 h-3/4 rounded-full border-2 border-amber-500/40 bg-slate-950 flex items-center justify-center relative">
                {/* Center Pitch */}
                <div className="w-16 h-28 border border-emerald-500/30 flex items-center justify-center">
                  <div className="w-full h-0.5 bg-emerald-500/30"></div>
                  <div className="absolute w-8 h-8 rounded-full border border-emerald-500/30"></div>
                </div>
                {/* Evacuation and Crowd Particles */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500 animate-ping"></div>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 animate-ping"></div>
              </div>
            </div>
            {/* Outer Gate Tags */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Gate A</div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Gate C</div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Gate D</div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 bg-slate-900 border border-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">Gate B</div>
          </div>
        </div>
      </section>

      {/* 2.5 The Challenge & Our Solution Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="flex flex-col gap-6">
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              The Tournament Challenge
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Coordinating a World Cup Venue
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Managing a FIFA World Cup venue requires coordinating thousands of spectators, volunteers, security personnel, transport services, and emergency responders simultaneously. Decisions must be made in real time while maintaining safety, accessibility, operational efficiency, and sustainability.
            </p>
            <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col gap-4">
              <h4 className="font-bold text-slate-200 text-sm">Who Benefits:</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm text-slate-400">
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500" /> Fans</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500" /> Volunteers</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500" /> Security Teams</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500" /> Venue Staff</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500" /> Organizers</div>
                <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-amber-500" /> Transport Hubs</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              Our Solution
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Unified Command Intelligence
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              StadiumIQ AI transforms fragmented stadium operations into a unified AI-powered command center. Using Generative AI and live operational telemetry, the platform predicts congestion, recommends actions, assists multilingual visitors, optimizes resources, and supports informed decision-making across tournament venues.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl text-center">
                <div className="text-2xl font-black text-emerald-400">30% Less</div>
                <div className="text-xs text-slate-400 font-medium">Queue Wait Times</div>
              </div>
              <div className="bg-slate-900/60 border border-slate-800/80 p-5 rounded-2xl text-center">
                <div className="text-2xl font-black text-emerald-400">20% Faster</div>
                <div className="text-xs text-slate-400 font-medium">Emergency Response</div>
              </div>
            </div>
          </div>
        </div>

        {/* Problem -> Solution Cards Table */}
        <div className="mt-16 bg-slate-900/30 border border-slate-900 rounded-3xl p-8 lg:p-12">
          <h3 className="text-2xl font-black text-center mb-8 tracking-tight">
            How StadiumIQ AI Resolves Stadium Challenges
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/60">
              <div className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2">Problem: Long Queues</div>
              <div className="text-slate-100 font-extrabold mb-1">AI Crowd Prediction</div>
              <p className="text-xs text-slate-400">Live congestion forecasts anticipate entry gate bottlenecks before they occur.</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/60">
              <div className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2">Problem: Navigation Confusion</div>
              <div className="text-slate-100 font-extrabold mb-1">Indoor AI Navigation</div>
              <p className="text-xs text-slate-400">Generates wheelchair-accessible and least-crowded pathways dynamically.</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/60">
              <div className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2">Problem: Language Barriers</div>
              <div className="text-slate-100 font-extrabold mb-1">Gemini Multilingual Assistant</div>
              <p className="text-xs text-slate-400">Instant multi-lingual translation support for international match visitors.</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/60">
              <div className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2">Problem: Emergency Coordination</div>
              <div className="text-slate-100 font-extrabold mb-1">AI Incident Command</div>
              <p className="text-xs text-slate-400">Generates structured evacuation scripts and response workflows on telemetry triggers.</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/60">
              <div className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2">Problem: Transit Congestion</div>
              <div className="text-slate-100 font-extrabold mb-1">AI Transport Optimizer</div>
              <p className="text-xs text-slate-400">Reroutes shuttle dispatches and adjusts metro schedules based on live stadium egress load.</p>
            </div>
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800/60">
              <div className="text-red-400 font-bold text-xs uppercase tracking-wider mb-2">Problem: Stadium Efficacy</div>
              <div className="text-slate-100 font-extrabold mb-1">AI Carbon & Energy Tracker</div>
              <p className="text-xs text-slate-400">Recommends automated HVAC offset configurations to reduce resource waste.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Section */}
      <section id="features" className="py-24 bg-slate-900/40 border-y border-slate-900 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto flex flex-col gap-4 mb-16">
            <span className="text-amber-500 text-xs font-bold uppercase tracking-widest">
              Platform Features
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Enterprise Tournament Intelligence
            </h2>
            <p className="text-slate-400">
               StadiumIQ AI integrates raw stadium telemetry with Google Gemini to optimize safety, logistics, and carbon efficiency.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div 
                key={i} 
                className="bg-slate-950/70 border border-slate-800 p-8 rounded-2xl flex flex-col gap-4 hover:border-amber-500/20 transition-all duration-300 group"
              >
                <div className="bg-slate-900 p-4 rounded-xl self-start group-hover:scale-105 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-extrabold text-lg tracking-tight group-hover:text-amber-500 transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Statistics Section */}
      <section id="stats" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-12 grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          <div className="flex flex-col gap-2">
            <span className="text-4xl font-black text-amber-500 font-mono">3</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Venues Managed</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl font-black text-amber-500 font-mono">220,000+</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Total Safe Capacity</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl font-black text-amber-500 font-mono">5s</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Telemetry Polling</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-4xl font-black text-amber-500 font-mono">40%</span>
            <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Carbon Savings Advice</span>
          </div>
        </div>
      </section>

      {/* 5. Call To Action */}
      <section className="py-24 bg-gradient-to-b from-slate-950 to-slate-900 border-t border-slate-900 text-center px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          <Cpu className="w-16 h-16 text-amber-500 mx-auto animate-pulse" />
          <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
            Ready to Deploy for FIFA World Cup 2026?
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Switch between Organizer, Volunteer, Security, and Transit roles to test complete simulation scenarios.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/dashboard"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-8 py-4 rounded-xl transition-colors text-md shadow-lg shadow-amber-500/10"
            >
              Launch Operations Center
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-12 px-6 text-center text-xs text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">STADIUMIQ</div>
            <span>© 2026 FIFA Tournament Operations Platform. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Service</a>
            <a href="#" className="hover:underline">Security Standards</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
