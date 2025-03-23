
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  setTheme: () => {},
});

export const useThemeContext = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { theme, setTheme } = useTheme();
  
  return (
    <ThemeContext.Provider
      value={{
        theme: theme || 'system',
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
