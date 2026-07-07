'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type Venue = 'METLIFE_STADIUM' | 'ESTADIO_AZTECA' | 'BC_PLACE';
export type UserRoleType = 'FAN' | 'ORGANIZER' | 'VOLUNTEER' | 'VENUE_STAFF' | 'SECURITY_OFFICER' | 'TRANSPORT_COORDINATOR' | 'SUSTAINABILITY_MANAGER';

interface WeatherInfo {
  temp: number;
  condition: string;
  wind: number;
}

interface StadiumContextType {
  venue: Venue;
  setVenue: (venue: Venue) => void;
  currentRole: UserRoleType;
  setCurrentRole: (role: UserRoleType) => void;
  countdown: string;
  activeAlertsCount: number;
  activeIncidentsCount: number;
  stadiumOccupancy: number;
  systemHealth: 'HEALTHY' | 'DEGRADED' | 'CRITICAL';
  weather: WeatherInfo;
  triggerLocalUpdate: () => void;
}

const StadiumContext = createContext<StadiumContextType | undefined>(undefined);

export const StadiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venue, setVenueState] = useState<Venue>('METLIFE_STADIUM');
  const [currentRole, setCurrentRoleState] = useState<UserRoleType>('ORGANIZER');
  const [countdown, setCountdown] = useState('02d 14h 45m 12s');
  const [activeAlertsCount, setActiveAlertsCount] = useState(3);
  const [activeIncidentsCount, setActiveIncidentsCount] = useState(2);
  const [stadiumOccupancy, setStadiumOccupancy] = useState(84);
  const [systemHealth, setSystemHealth] = useState<'HEALTHY' | 'DEGRADED' | 'CRITICAL'>('HEALTHY');
  const [weather, setWeather] = useState<WeatherInfo>({ temp: 32, condition: 'Sunny', wind: 8 });

  // 1. Dynamic Match Countdown Timer
  useEffect(() => {
    let days = 2;
    let hours = 14;
    let minutes = 45;
    let seconds = 12;

    const timer = setInterval(() => {
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
        if (minutes < 0) {
          minutes = 59;
          hours--;
          if (hours < 0) {
            hours = 23;
            days--;
            if (days < 0) {
              days = 0;
              hours = 0;
              minutes = 0;
              seconds = 0;
              clearInterval(timer);
            }
          }
        }
      }

      const pad = (n: number) => String(n).padStart(2, '0');
      setCountdown(`${pad(days)}d ${pad(hours)}h ${pad(minutes)}m ${pad(seconds)}s`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 2. Local Status Simulator (Updates status values every 5 seconds)
  const triggerLocalUpdate = () => {
    // Generate small fluctuations to simulate real-time sensors
    setStadiumOccupancy(prev => {
      const delta = Math.floor(Math.random() * 3) - 1;
      return Math.min(100, Math.max(10, prev + delta));
    });

    setWeather(prev => {
      const tempDelta = Number((Math.random() * 0.4 - 0.2).toFixed(1));
      return {
        ...prev,
        temp: Number((prev.temp + tempDelta).toFixed(1))
      };
    });
  };

  useEffect(() => {
    const statusInterval = setInterval(() => {
      triggerLocalUpdate();
    }, 5000);

    return () => clearInterval(statusInterval);
  }, []);

  const setVenue = (v: Venue) => {
    setVenueState(v);
    // Custom parameters per venue
    if (v === 'METLIFE_STADIUM') {
      setStadiumOccupancy(84);
      setWeather({ temp: 32, condition: 'Sunny', wind: 8 });
      setActiveAlertsCount(3);
      setActiveIncidentsCount(2);
      setSystemHealth('HEALTHY');
    } else if (v === 'ESTADIO_AZTECA') {
      setStadiumOccupancy(91);
      setWeather({ temp: 24, condition: 'Partly Cloudy', wind: 12 });
      setActiveAlertsCount(4);
      setActiveIncidentsCount(1);
      setSystemHealth('DEGRADED');
    } else {
      setStadiumOccupancy(72);
      setWeather({ temp: 18, condition: 'Rainy', wind: 15 });
      setActiveAlertsCount(2);
      setActiveIncidentsCount(0);
      setSystemHealth('HEALTHY');
    }
  };

  const setCurrentRole = (role: UserRoleType) => {
    setCurrentRoleState(role);
  };

  return (
    <StadiumContext.Provider
      value={{
        venue,
        setVenue,
        currentRole,
        setCurrentRole,
        countdown,
        activeAlertsCount,
        activeIncidentsCount,
        stadiumOccupancy,
        systemHealth,
        weather,
        triggerLocalUpdate
      }}
    >
      {children}
    </StadiumContext.Provider>
  );
};

export const useStadium = () => {
  const context = useContext(StadiumContext);
  if (!context) {
    throw new Error('useStadium must be used within a StadiumProvider');
  }
  return context;
};
