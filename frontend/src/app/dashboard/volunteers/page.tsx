'use client';

import React, { useState } from 'react';
import { useStadium } from '../../../context/StadiumContext';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { 
  Settings, 
  CheckSquare, 
  ShieldAlert, 
  Users, 
  HelpCircle, 
  Plus, 
  Trash2, 
  Check, 
  AlertTriangle,
  Play,
  Volume2
} from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED';
}

export default function VolunteerPortal() {
  const { venue } = useStadium();
  const { speak } = useAccessibility();

  // Kanban tasks state
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Assist Mobility Passenger', description: 'Help guest navigate from Gate B elevator to East VIP deck.', priority: 'HIGH', status: 'OPEN' },
    { id: '2', title: 'Restock Water Stations', description: 'Transport water boxes from Main Storage to Level 2 Concourse stations.', priority: 'MEDIUM', status: 'IN_PROGRESS' },
    { id: '3', title: 'Distribute Recycling Bins', description: 'Distribute biodegradable bins to concessions behind Sec 114.', priority: 'LOW', status: 'OPEN' },
    { id: '4', title: 'Check Gate D Scanner Lane 3', description: 'Hardware monitor check at Gate D.', priority: 'CRITICAL', status: 'COMPLETED' }
  ]);

  // Form input state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('MEDIUM');

  // Incident form state
  const [incCategory, setIncCategory] = useState('MEDICAL');
  const [incSeverity, setIncSeverity] = useState('HIGH');
  const [incLocation, setIncLocation] = useState('');
  const [incDesc, setIncDesc] = useState('');
  
  // AI Incident response simulation display
  const [reportedIncidentPlan, setReportedIncidentPlan] = useState<any | null>(null);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTitle,
      description: newDesc,
      priority: newPriority,
      status: 'OPEN'
    };

    setTasks(prev => [...prev, newTask]);
    setNewTitle('');
    setNewDesc('');
    setNewPriority('MEDIUM');
    speak(`New task card created: ${newTitle}`);
  };

  const handleUpdateStatus = (id: string, nextStatus: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED') => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: nextStatus } : t));
    speak(`Task status updated to ${nextStatus.toLowerCase()}`);
  };

  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incLocation.trim() || !incDesc.trim()) return;

    // Simulate AI evacuation planning
    const mockPlan = {
      riskAssessment: `HIGH RISK: Emergency incident reported at ${incLocation}. Severity is ${incSeverity}. Crowd stampede risk exists in nearby corridors.`,
      actionPlan: [
        `Sound localized alarms at ${incLocation}.`,
        'Alert Stadium Security Command Center.',
        'Deploy nearest 2 volunteers to guide crowd flow.',
        'Clear emergency vehicle access lane.'
      ],
      announcement: `Notice: Operational staff are managing a localized incident at ${incLocation}. Please follow steward directions and stay clear of this zone.`
    };

    setReportedIncidentPlan(mockPlan);
    speak(`Incident dispatch complete. AI Emergency action plan generated.`);
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1400px] mx-auto">
      
      {/* Title */}
      <div>
        <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
          <Settings className="w-5 h-5 text-amber-500" />
          Volunteer Portal
        </h1>
        <p className="text-slate-400 text-xs">
          Manage operations checklists, update Kanban tasks, and dispatch emergency incident alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Tasks board & forms (lg:col-span-8) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          
          {/* Kanban Task Columns */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider">
              Operations Kanban Board
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Column 1: OPEN */}
              <div className="flex flex-col gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-900 min-h-[300px]">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-1 flex items-center justify-between">
                  <span>To Do (Open)</span>
                  <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[8px] font-mono">{tasks.filter(t => t.status === 'OPEN').length}</span>
                </span>
                
                {tasks.filter(t => t.status === 'OPEN').map(t => (
                  <div key={t.id} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex flex-col gap-2 text-xs relative group">
                    <div className="flex items-center justify-between">
                      <span className={`px-1.5 py-0.2 rounded text-[7px] font-black ${
                        t.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-400' : t.priority === 'HIGH' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {t.priority}
                      </span>
                      <button
                        onClick={() => handleUpdateStatus(t.id, 'IN_PROGRESS')}
                        className="text-[9px] font-bold text-amber-500 hover:underline"
                      >
                        Claim Task
                      </button>
                    </div>
                    <strong className="text-slate-200">{t.title}</strong>
                    <p className="text-slate-400 text-[10px] leading-snug">{t.description}</p>
                  </div>
                ))}
              </div>

              {/* Column 2: IN PROGRESS */}
              <div className="flex flex-col gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-900 min-h-[300px]">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-1 flex items-center justify-between">
                  <span>In Progress</span>
                  <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[8px] font-mono">{tasks.filter(t => t.status === 'IN_PROGRESS').length}</span>
                </span>

                {tasks.filter(t => t.status === 'IN_PROGRESS').map(t => (
                  <div key={t.id} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex flex-col gap-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-bold text-blue-400">IN PROGRESS</span>
                      <button
                        onClick={() => handleUpdateStatus(t.id, 'COMPLETED')}
                        className="text-[9px] font-bold text-emerald-400 hover:underline"
                      >
                        Complete
                      </button>
                    </div>
                    <strong className="text-slate-200">{t.title}</strong>
                    <p className="text-slate-400 text-[10px] leading-snug">{t.description}</p>
                  </div>
                ))}
              </div>

              {/* Column 3: COMPLETED */}
              <div className="flex flex-col gap-3 bg-slate-950/60 p-3.5 rounded-xl border border-slate-900 min-h-[300px]">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-900 pb-1.5 mb-1 flex items-center justify-between">
                  <span>Completed</span>
                  <span className="bg-slate-900 px-1.5 py-0.5 rounded text-[8px] font-mono">{tasks.filter(t => t.status === 'COMPLETED').length}</span>
                </span>

                {tasks.filter(t => t.status === 'COMPLETED').map(t => (
                  <div key={t.id} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex flex-col gap-2 text-xs opacity-60">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[8px]">
                      <Check className="w-3.5 h-3.5" />
                      <span>RESOLVED</span>
                    </div>
                    <strong className="text-slate-350 line-through">{t.title}</strong>
                    <p className="text-slate-500 text-[10px] leading-snug">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Task Creator Form */}
          <div className="glass-panel rounded-2xl p-6">
            <h2 className="font-extrabold text-sm uppercase tracking-wider mb-4">
              Add New Operation Card
            </h2>
            <form onSubmit={handleCreateTask} className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 font-bold">Task Title</span>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Restock Gate C flyers"
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <span className="text-slate-500 font-bold">Task Description</span>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Bring box to kiosk"
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                />
              </div>
              <div className="flex items-end gap-3">
                <div className="flex flex-col gap-1.5 flex-1">
                  <span className="text-slate-500 font-bold">Priority</span>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="CRITICAL">CRITICAL</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-amber-500 font-bold p-3 rounded-lg flex items-center justify-center shrink-0"
                  aria-label="Add task"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Side: Incident Dispatch Form (lg:col-span-4) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          
          <div className="glass-panel rounded-2xl p-6 flex flex-col gap-4">
            <h2 className="font-extrabold text-sm uppercase tracking-wider flex items-center gap-2 text-red-500">
              <ShieldAlert className="w-4.5 h-4.5 animate-pulse" />
              Report Concourse Incident
            </h2>

            <form onSubmit={handleReportIncident} className="flex flex-col gap-3.5 text-xs">
              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold">Category</span>
                <select
                  value={incCategory}
                  onChange={(e) => setIncCategory(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                >
                  <option value="MEDICAL">MEDICAL</option>
                  <option value="FIRE">FIRE</option>
                  <option value="PANIC">PANIC</option>
                  <option value="LOST_CHILD">LOST CHILD</option>
                  <option value="SUSPICIOUS_OBJECT">SUSPICIOUS OBJECT</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold">Severity</span>
                <select
                  value={incSeverity}
                  onChange={(e) => setIncSeverity(e.target.value)}
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                >
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold">Location Details</span>
                <input
                  type="text"
                  value={incLocation}
                  onChange={(e) => setIncLocation(e.target.value)}
                  placeholder="e.g. Concourse East, Section 112 Lobby"
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-slate-500 font-bold">Description</span>
                <textarea
                  value={incDesc}
                  onChange={(e) => setIncDesc(e.target.value)}
                  rows={3}
                  placeholder="Describe the nature of the emergency..."
                  className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 font-semibold text-slate-200 focus:outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="bg-red-500 hover:bg-red-400 text-slate-950 font-black py-3 rounded-xl transition-colors text-xs flex items-center justify-center gap-2"
              >
                <AlertTriangle className="w-4.5 h-4.5" />
                Dispatch Emergency Alert
              </button>
            </form>
          </div>

          {/* AI generated Incident response display */}
          {reportedIncidentPlan && (
            <div className="glass-panel rounded-2xl p-6 flex flex-col gap-3 border-l-4 border-l-red-500 text-xs">
              <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest font-mono">AI INCIDENT PLAN</span>
              <p className="bg-red-950/20 p-3 rounded-xl text-red-200 leading-relaxed font-semibold">
                {reportedIncidentPlan.riskAssessment}
              </p>
              
              <div className="flex flex-col gap-1 text-slate-400 mt-2">
                <strong className="text-slate-300">Action Plan Checklist:</strong>
                <ul className="list-disc pl-4 flex flex-col gap-1">
                  {reportedIncidentPlan.actionPlan.map((act: string, idx: number) => (
                    <li key={idx}>{act}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/60 p-3 rounded-xl flex items-start justify-between gap-4 text-slate-350 leading-relaxed italic border border-slate-850 mt-2">
                <p>"{reportedIncidentPlan.announcement}"</p>
                <button
                  onClick={() => speak(reportedIncidentPlan.announcement)}
                  className="p-1.5 border border-slate-800 bg-slate-950 rounded text-slate-500 hover:text-amber-500 shrink-0"
                  aria-label="Speak announcement script"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
