import React, { createContext, useState, ReactNode } from "react";

const defaultTheme = {
  isDarkMode: false,
  toggleTheme: () => {},
};

export const ThemeContext = createContext(defaultTheme);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [isDarkMode, setIsDarkMode] = useState(defaultTheme.isDarkMode);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
