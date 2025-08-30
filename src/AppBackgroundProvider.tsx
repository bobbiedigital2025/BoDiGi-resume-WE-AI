import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface BackgroundServiceContextProps {
  isAdmin: boolean;
  aiStatus: string;
  // Add more global states/services as needed
}

const BackgroundServiceContext = createContext<BackgroundServiceContextProps | undefined>(undefined);

export const useBackgroundService = () => {
  const context = useContext(BackgroundServiceContext);
  if (!context) throw new Error('useBackgroundService must be used within AppBackgroundProvider');
  return context;
};

interface Props {
  children: ReactNode;
}

export const AppBackgroundProvider: React.FC<Props> = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false); // Replace with real admin check
  const [aiStatus, setAiStatus] = useState('idle');

  useEffect(() => {
    // Example: background AI agent logic
    setAiStatus('running');
    // Simulate background monitoring, API calls, etc.
    // setIsAdmin(...) // Add real admin logic here
  }, []);

  return (
    <BackgroundServiceContext.Provider value={{ isAdmin, aiStatus }}>
      {children}
    </BackgroundServiceContext.Provider>
  );
};
