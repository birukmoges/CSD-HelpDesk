import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AppearanceContext from '../AppearanceContext';

import {
  LightOceanTheme,
  DarkNebulaTheme,
  EarthyForestTheme,
  SunsetGlowTheme,
  LavenderMistTheme,
  CloudySkyTheme,
} from './themes';

const themes = {
  Light: LightOceanTheme,
  Dark: DarkNebulaTheme,
  Forest: EarthyForestTheme,
  Sunset: SunsetGlowTheme,
  Lavender: LavenderMistTheme,
  Cloudy: CloudySkyTheme,
};
const ClientHome = () => {
  const {
    themeName: contextThemeName,
    setThemeName,
  } = useContext(AppearanceContext);

  const [themeName, setLocalThemeName] = useState(contextThemeName);

  useEffect(() => {
    fetchGlobalSettings();
  }, []); // Empty dependency array to run the effect only once
  const fetchGlobalSettings = async () => {
    try {
      const globalSettingsResponse = await axios.get('http://localhost:3000/Appearance/', {
        withCredentials: true,
      });
      if (globalSettingsResponse.data.uniqueThemes.length > 0) {
        setLocalThemeName(globalSettingsResponse.data.uniqueThemes[0]);
        setThemeName(globalSettingsResponse.data.uniqueThemes[0]);
      }
    } catch (error) {
      console.error('Error fetching global appearance settings:', error);
    }
  };

  const selectedTheme = themes[themeName];
    
  return (
    <div 
      className="bg-cover bg-center h-screen flex justify-center items-center" 
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1524749292158-7540c2494485?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" // Your background image URL
      }}
    >
      <div className='max-w-[1640px] mx-auto px-4 py-12 text-center bg-white bg-opacity-50 rounded-lg p-8'>
        <h1 className={`text-${selectedTheme.colors.primary} font-bold text-4xl mb-8`}>
          Welcome to Your CSD Help Desk
        </h1>
        <p className={`text-${selectedTheme.colors.text} text-xl mb-4`}>
          We're here to assist you with all your inquiries, concerns, and feedback.
        </p>
        <p className={`text-${selectedTheme.colors.text} text-lg mb-4`}>
          Navigate through various categories to find answers, create tickets, or get in touch with our support team.
        </p>
      </div>
    </div>
  );
};

export default ClientHome;
