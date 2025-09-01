import React, { createContext, useState, useContext } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
      const [currentTheme, setCurrentTheme] = useState("DarkTheme");

      return (
            <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
                  {children}
            </ThemeContext.Provider>
      );
};

export const useTheme = () => useContext(ThemeContext);
