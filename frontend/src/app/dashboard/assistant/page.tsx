'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAccessibility } from '../../../context/AccessibilityContext';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Volume2, 
  FileText, 
  RefreshCw, 
  Mic, 
  MicOff, 
  Globe, 
  CornerDownRight, 
  Sparkles,
  Info,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export default function MultilingualAssistant() {
  const { speak, ttsEnabled, toggleTts } = useAccessibility();

  // Chat message state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init',
      sender: 'ai',
      text: 'Hello! I am StadiumIQ AI, your official FIFA World Cup 2026 Tournament Assistant. How can I help you find amenities, seats, or transport services today?',
      timestamp: '18:10'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Audio Speech Recognition (STT) state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  const languages = ['English', 'Spanish', 'French', 'Arabic', 'Portuguese', 'Hindi', 'Japanese', 'German'];

  const promptTemplates = [
    { label: 'Nearest Restroom', text: 'Where is the nearest wheelchair-accessible restroom from Section 112?' },
    { label: 'Nearest Food Court', text: 'Which food courts serve vegan options, and how do I walk there?' },
    { label: 'Emergency Help', text: 'What is the emergency evacuation procedure for the East Stand?' },
    { label: 'Weather Forecast', text: 'What is the current weather forecast and will it delay metro services?' },
    { label: 'Transit Details', text: 'Where is the rideshare pick-up zone, and what transit option is fastest?' }
  ];

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Speech Recognition hook
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = false;
        rec.interimResults = false;
        rec.lang = 'en-US';

        rec.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
          setIsListening(false);
        };

        rec.onerror = () => {
          setIsListening(false);
        };

        rec.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  // Helper mock responses
  const getMockResponse = (text: string, lang: string): string => {
    const isSpanish = lang === 'Spanish';
    const isGerman = lang === 'German';
    const lower = text.toLowerCase();

    if (lower.includes('restroom') || lower.includes('baño') || lower.includes('toilet')) {
      if (isSpanish) return 'Los baños más cercanos se encuentran inmediatamente detrás de la Sección 112 (Concurso Este) y la Sección 124 (Concurso Oeste). Ambos tienen rampas de accesibilidad.';
      if (isGerman) return 'Die nächsten WCs befinden sich direkt hinter Sektor 112 (Ostseite) und Sektor 124 (Westseite). Beide bieten rollstuhlgerechte Rampen.';
      return 'The nearest restrooms are located immediately behind Section 112 (Concourse East) and Section 124 (Concourse West). Both are equipped with wheelchair-accessible ramps.';
    }
    if (lower.includes('food') || lower.includes('eat') || lower.includes('vegan') || lower.includes('comida')) {
      if (isSpanish) return 'Las zonas principales están en Food Court Este (Sección 114) con opciones veganas y sin gluten.';
      return 'Major concessions are open at Food Court East (behind Section 114). Vegan and Gluten-free options are available at Stand 12.';
    }
    if (lower.includes('emergency') || lower.includes('evacuate') || lower.includes('evacuación')) {
      if (isSpanish) return 'Mantenga la calma. Ante una alarma de evacuación, camine tranquilamente hacia las salidas más despejadas en la Puerta E o F.';
      return 'Please remain calm. In case of an emergency evacuation, follow instructions from stewards and exit through the nearest clear gates (Gate E or Gate F).';
    }
    if (lower.includes('weather') || lower.includes('rain') || lower.includes('lluvia')) {
      return 'Current weather: 32°C, Sunny. No delays reported. Shuttles are operating on time.';
    }

    // Default chat responder
    if (isSpanish) return `Entendido. Estoy procesando su solicitud sobre "${text}". Todos los sistemas de transporte del estadio están en funcionamiento óptimo.`;
    return `Understood. I am processing your tournament request regarding "${text}". All transit loops and stadium entry systems are currently reporting on-time operations.`;
  };

  const handleSendMessage = (textToSend: string) => {
    if (!textToSend.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);

    // Simulate Streaming response
    setTimeout(() => {
      const responseText = getMockResponse(textToSend, selectedLanguage);
      const words = responseText.split(' ');
      let currentWordIndex = 0;
      let streamedText = '';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsGenerating(false);

      const streamTimer = setInterval(() => {
        if (currentWordIndex < words.length) {
          streamedText += (currentWordIndex === 0 ? '' : ' ') + words[currentWordIndex];
          setMessages(prev => prev.map(m => m.id === aiMsg.id ? { ...m, text: streamedText } : m));
          currentWordIndex++;
        } else {
          clearInterval(streamTimer);
          // Speak output if TTS is enabled
          speak(responseText);
        }
      }, 50);

    }, 1200);
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const regenerateResponse = () => {
    const lastUserMessage = [...messages].reverse().find(m => m.sender === 'user');
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.text);
    }
  };

  const exportChatToPdf = () => {
    window.print();
  };

  return (
    <div className="p-6 flex flex-col gap-6 max-w-[1200px] mx-auto h-[calc(100vh-65px)]">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-xl font-black tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            GenAI Multilingual Assistant
          </h1>
          <p className="text-slate-400 text-xs">
            Ask stadium questions, ticket policies, facility locations, and emergency protocols in any language.
          </p>
        </div>

        {/* Language selector and options */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-xs">
            <Globe className="w-4 h-4 text-amber-500" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="bg-transparent font-bold text-slate-200 border-0 focus:ring-0 cursor-pointer text-xs"
            >
              {languages.map(l => (
                <option key={l} value={l} className="bg-slate-900">{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={exportChatToPdf}
            className="p-2 border border-slate-800 hover:border-slate-700 bg-slate-900 rounded-lg text-slate-400 hover:text-amber-500 flex items-center gap-1.5 text-xs font-bold"
            aria-label="Export chat log"
          >
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Export PDF</span>
          </button>
        </div>
      </div>

      {/* Main chat layout: Presets sidebar & Chat container */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* Left Side: Preset Templates (hidden on mobile) */}
        <div className="w-80 glass-panel rounded-2xl p-4 hidden lg:flex flex-col gap-3 shrink-0">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-1">
            Operations Presets
          </span>
          {promptTemplates.map((template, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(template.text)}
              className="p-3 bg-slate-900/50 border border-slate-800 hover:border-amber-500/20 hover:bg-slate-900 rounded-xl text-left text-xs leading-relaxed transition-all flex items-start gap-2 group"
            >
              <CornerDownRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-slate-300 group-hover:text-amber-500 transition-colors mb-0.5">{template.label}</div>
                <div className="text-slate-500 text-[10px] line-clamp-2">{template.text}</div>
              </div>
            </button>
          ))}
        </div>

        {/* Right Side: Chat Dialog Panel */}
        <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden">
          
          {/* Scrollable messages canvas */}
          <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6">
            {messages.map((m) => {
              const isAi = m.sender === 'ai';
              return (
                <div 
                  key={m.id}
                  className={`flex flex-col gap-1.5 max-w-[85%] ${isAi ? 'self-start' : 'self-end'}`}
                >
                  {/* Sender title */}
                  <span className={`text-[10px] font-bold tracking-wider uppercase ${isAi ? 'text-amber-500' : 'text-slate-500 self-end'}`}>
                    {isAi ? 'StadiumIQ Advisor' : 'You'}
                  </span>
                  
                  {/* Bubble wrapper */}
                  <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    isAi 
                      ? 'bg-slate-900 border border-slate-800 rounded-tl-none' 
                      : 'bg-amber-500 text-slate-950 font-semibold rounded-tr-none'
                  }`}>
                    <p className="whitespace-pre-wrap">{m.text}</p>

                    {/* Action utility bar (only on AI bubbles) */}
                    {isAi && m.text.length > 0 && (
                      <div className="flex items-center gap-3 border-t border-slate-800/80 mt-3 pt-2 text-[10px] text-slate-500">
                        <button
                          onClick={() => copyToClipboard(m.id, m.text)}
                          className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                          aria-label="Copy response text"
                        >
                          {copiedId === m.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === m.id ? 'Copied' : 'Copy'}</span>
                        </button>
                        <button
                          onClick={() => speak(m.text)}
                          className="flex items-center gap-1 hover:text-slate-300 transition-colors"
                          aria-label="Read response aloud"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>Speak</span>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Timestamp */}
                  <span className={`text-[9px] text-slate-600 ${isAi ? 'self-start' : 'self-end'}`}>{m.timestamp}</span>
                </div>
              );
            })}

            {/* AI Generation Skeleton */}
            {isGenerating && (
              <div className="flex flex-col gap-1.5 self-start max-w-[80%]">
                <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">
                  StadiumIQ Advisor
                </span>
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none flex items-center gap-2">
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce"></div>
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={chatBottomRef}></div>
          </div>

          {/* Bottom input area */}
          <div className="border-t border-slate-900 p-4 bg-slate-950/80 flex flex-col gap-3 shrink-0">
            <div className="flex items-center gap-3">
              
              {/* Text Input Bar */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder={`Ask in ${selectedLanguage} (e.g. "Where is the nearest restroom?")...`}
                className="flex-1 bg-slate-900 border border-slate-800 focus:border-amber-500/50 rounded-xl px-4 py-3 text-xs text-slate-200 placeholder-slate-600 focus:ring-0 focus:outline-none"
              />

              {/* Speech Voice Dictator */}
              <button
                onClick={toggleListening}
                className={`p-3 rounded-xl border transition-all ${
                  isListening 
                    ? 'bg-red-500/20 border-red-500 text-red-500 animate-pulse' 
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-amber-500 hover:border-slate-700'
                }`}
                aria-label={isListening ? 'Stop listening' : 'Start voice commands'}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              {/* Send Button */}
              <button
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim() || isGenerating}
                className="bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black p-3 rounded-xl transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Options utility tray */}
            <div className="flex items-center justify-between text-[10px] text-slate-600 px-1">
              <span className="flex items-center gap-1">
                <Info className="w-3.5 h-3.5" />
                Speech Engine: {isListening ? 'Listening dictation...' : 'Ready'}
              </span>
              <button
                onClick={regenerateResponse}
                disabled={messages.length < 2 || isGenerating}
                className="hover:text-slate-400 flex items-center gap-1 disabled:opacity-40"
              >
                <RefreshCw className="w-3 h-3" />
                Regenerate last response
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
