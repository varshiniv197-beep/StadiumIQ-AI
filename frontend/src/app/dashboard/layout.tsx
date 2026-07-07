'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useStadium, Venue, UserRoleType } from '../../context/StadiumContext';
import { useAccessibility, FontSizeTier } from '../../context/AccessibilityContext';
import { 
  Tv, 
  MessageSquare, 
  Map, 
  Users, 
  HelpCircle,
  Play,
  MapPin,
  FileText,
  Settings,
  Shield,
  Activity,
  LogOut,
  Bell,
  Sun,
  Accessibility,
  Eye,
  FileQuestion,
  User,
  ChevronsUpDown,
  Check
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { 
    venue, 
    setVenue, 
    currentRole, 
    setCurrentRole, 
    countdown, 
    activeAlertsCount,
    systemHealth,
    weather,
    stadiumOccupancy
  } = useStadium();

  const { 
    highContrast, 
    toggleHighContrast, 
    fontSize, 
    setFontSize 
  } = useAccessibility();

  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [showVenueSelect, setShowVenueSelect] = useState(false);
  const [showAlertTray, setShowAlertTray] = useState(false);
  const [showAccessMenu, setShowAccessMenu] = useState(false);

  const sidebarLinks = [
    { href: '/dashboard', label: 'AI Command Center', icon: <Tv className="w-5 h-5" /> },
    { href: '/dashboard/assistant', label: 'Multilingual Assistant', icon: <MessageSquare className="w-5 h-5" /> },
    { href: '/dashboard/navigation', label: 'Indoor Navigation', icon: <Map className="w-5 h-5" /> },
    { href: '/dashboard/crowd', label: 'Crowd Intelligence', icon: <Users className="w-5 h-5" /> },
    { href: '/dashboard/scenario', label: 'Scenario Simulator', icon: <Play className="w-5 h-5" /> },
    { href: '/dashboard/journey', label: 'Personalized Fan Journey', icon: <MapPin className="w-5 h-5" /> },
    { href: '/dashboard/executive', label: 'Executive Analytics', icon: <FileText className="w-5 h-5" /> },
    { href: '/dashboard/sustainability', label: 'Sustainability Monitor', icon: <Activity className="w-5 h-5" /> },
    { href: '/dashboard/volunteers', label: 'Volunteer Portal', icon: <Settings className="w-5 h-5" /> },
    { href: '/dashboard/xai', label: 'Explainable AI Page', icon: <FileQuestion className="w-5 h-5" /> }
  ];

  const roles: UserRoleType[] = [
    'FAN',
    'ORGANIZER',
    'VOLUNTEER',
    'VENUE_STAFF',
    'SECURITY_OFFICER',
    'TRANSPORT_COORDINATOR',
    'SUSTAINABILITY_MANAGER'
  ];

  const venues: { id: Venue; name: string; country: string }[] = [
    { id: 'METLIFE_STADIUM', name: 'MetLife Stadium', country: 'USA (New York)' },
    { id: 'ESTADIO_AZTECA', name: 'Estadio Azteca', country: 'Mexico (Mexico City)' },
    { id: 'BC_PLACE', name: 'BC Place', country: 'Canada (Vancouver)' }
  ];

  const fontSizes: { id: FontSizeTier; label: string }[] = [
    { id: 'normal', label: 'Normal (100%)' },
    { id: 'large', label: 'Large (125%)' },
    { id: 'xl', label: 'Extra Large (150%)' },
    { id: 'xxl', label: 'WCAG Maximum (200%)' }
  ];

  return (
    <div className="h-screen flex flex-col bg-slate-950 text-slate-100 overflow-hidden">
      
      {/* 1. Header Bar */}
      <header className="border-b border-slate-900 bg-slate-950 px-6 py-3 flex items-center justify-between z-40 shrink-0">
        
        {/* Logo and Venue Switcher */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 font-black px-2 py-0.5 rounded text-xs">STADIUMIQ</span>
            <span className="font-bold tracking-tight text-md hidden md:inline">Operations Center</span>
          </Link>

          {/* Venue Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowVenueSelect(!showVenueSelect)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold"
              aria-expanded={showVenueSelect}
            >
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              <span>{venues.find(v => v.id === venue)?.name}</span>
              <ChevronsUpDown className="w-3 h-3 text-slate-500" />
            </button>

            {showVenueSelect && (
              <div className="absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 p-1">
                {venues.map(v => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setVenue(v.id);
                      setShowVenueSelect(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-slate-800 transition-colors"
                  >
                    <div>
                      <div className="font-bold">{v.name}</div>
                      <div className="text-[10px] text-slate-500">{v.country}</div>
                    </div>
                    {venue === v.id && <Check className="w-3.5 h-3.5 text-amber-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Global Live Widgets */}
        <div className="hidden lg:flex items-center gap-6 text-[11px] font-medium text-slate-400">
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Occupancy</span>
            <span className="text-amber-500 font-bold font-mono">{stadiumOccupancy}%</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Countdown</span>
            <span className="font-mono font-bold text-slate-200">{countdown}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Sys Health</span>
            <span className={`font-bold flex items-center gap-1 ${
              systemHealth === 'HEALTHY' ? 'text-emerald-500' : systemHealth === 'DEGRADED' ? 'text-yellow-500' : 'text-red-500'
            }`}>
              <Activity className="w-3 h-3" />
              {systemHealth}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">Weather</span>
            <span className="font-bold text-slate-200 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-500" />
              {weather.temp}°C, {weather.condition}
            </span>
          </div>
        </div>

        {/* User Role Switcher & Accessibility Control panel */}
        <div className="flex items-center gap-3">
          
          {/* Role testing dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleSelect(!showRoleSelect)}
              className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-semibold"
            >
              <User className="w-3.5 h-3.5 text-amber-500" />
              <span>Role: <strong className="text-slate-200">{currentRole}</strong></span>
              <ChevronsUpDown className="w-3 h-3 text-slate-500" />
            </button>

            {showRoleSelect && (
              <div className="absolute right-0 mt-2 w-56 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 p-1 max-h-64 overflow-y-auto">
                <div className="px-3 py-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 mb-1">
                  Test User Roles
                </div>
                {roles.map(r => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRole(r);
                      setShowRoleSelect(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs hover:bg-slate-800 transition-colors"
                  >
                    <span>{r.replace('_', ' ')}</span>
                    {currentRole === r && <Check className="w-3.5 h-3.5 text-amber-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Options Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowAccessMenu(!showAccessMenu)}
              className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-lg text-slate-400 hover:text-amber-500"
              aria-label="Accessibility options"
            >
              <Accessibility className="w-4 h-4" />
            </button>

            {showAccessMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50 p-4 flex flex-col gap-4">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800 pb-2">
                  Accessibility Adjustments
                </h4>
                
                {/* Contrast Toggle */}
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">High Contrast Mode</span>
                  <button
                    onClick={toggleHighContrast}
                    className={`px-3 py-1 rounded font-bold text-[10px] ${
                      highContrast ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {highContrast ? 'ON' : 'OFF'}
                  </button>
                </div>

                {/* Text Resizing */}
                <div className="flex flex-col gap-1.5 text-xs">
                  <span className="font-semibold">Text Resize</span>
                  <div className="grid grid-cols-2 gap-1">
                    {fontSizes.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setFontSize(f.id)}
                        className={`p-1.5 border rounded text-[10px] text-center font-bold ${
                          fontSize === f.id ? 'border-amber-500 bg-amber-500/10 text-amber-500' : 'border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {f.label.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Alerts Bell */}
          <button
            onClick={() => setShowAlertTray(!showAlertTray)}
            className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-lg text-slate-400 hover:text-amber-500 relative"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500"></span>
          </button>
        </div>
      </header>

      {/* 2. Main Body Container */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Sidebar Nav */}
        <aside className="w-64 border-r border-slate-900 bg-slate-950 shrink-0 hidden md:flex flex-col justify-between p-4 overflow-y-auto">
          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-2">
              Operations Navigation
            </span>
            {sidebarLinks.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-amber-500/10 text-amber-500 border-l-2 border-amber-500' 
                      : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200'
                  }`}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="border-t border-slate-900 pt-4 flex flex-col gap-2">
            <div className="flex items-center gap-3 px-3 py-1 text-slate-400 text-xs">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>FIFA Security Active</span>
            </div>
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-500/5 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Exit Console</span>
            </Link>
          </div>
        </aside>

        {/* Dynamic Main View */}
        <main className="flex-1 bg-slate-950/20 overflow-y-auto relative">
          {children}
        </main>
      </div>
    </div>
  );
}
