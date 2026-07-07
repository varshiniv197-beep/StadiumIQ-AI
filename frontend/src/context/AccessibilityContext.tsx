'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type FontSizeTier = 'normal' | 'large' | 'xl' | 'xxl';

interface AccessibilityContextType {
  highContrast: boolean;
  fontSize: FontSizeTier;
  ttsEnabled: boolean;
  screenReaderAnnouncement: string;
  toggleHighContrast: () => void;
  setFontSize: (size: FontSizeTier) => void;
  toggleTts: () => void;
  announce: (message: string) => void;
  speak: (text: string) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSize, setFontSizeState] = useState<FontSizeTier>('normal');
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [screenReaderAnnouncement, setScreenReaderAnnouncement] = useState('');

  // Apply high contrast class to body
  useEffect(() => {
    const root = window.document.documentElement;
    if (highContrast) {
      root.classList.add('theme-high-contrast');
    } else {
      root.classList.remove('theme-high-contrast');
    }
  }, [highContrast]);

  const toggleHighContrast = () => {
    setHighContrast(prev => !prev);
    announce(highContrast ? 'High contrast mode deactivated.' : 'High contrast mode activated.');
  };

  const setFontSize = (size: FontSizeTier) => {
    setFontSizeState(size);
    announce(`Font size adjusted to ${size}.`);
  };

  const toggleTts = () => {
    setTtsEnabled(prev => !prev);
    announce(ttsEnabled ? 'Text to speech assistance muted.' : 'Text to speech assistance enabled.');
  };

  const announce = (message: string) => {
    setScreenReaderAnnouncement(message);
    // Clear announcement after reader registers it
    setTimeout(() => setScreenReaderAnnouncement(''), 1000);
  };

  const speak = (text: string) => {
    if (!ttsEnabled || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        fontSize,
        ttsEnabled,
        screenReaderAnnouncement,
        toggleHighContrast,
        setFontSize,
        toggleTts,
        announce,
        speak
      }}
    >
      <div className={`font-size-${fontSize}`}>
        {children}
        {/* Hidden screen reader live container */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only absolute w-1 h-1 p-0 -m-1 overflow-hidden clip-rect-0 border-0"
        >
          {screenReaderAnnouncement}
        </div>
      </div>
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};
