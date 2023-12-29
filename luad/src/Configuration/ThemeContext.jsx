// ThemeContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

const ThemeContext = createContext(undefined);

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    // Add the theme class to the body
    document.body.classList.add(`${theme}-theme`);
    // Clean up previous theme class on unmount or when theme changes
    return () => {
      document.body.classList.remove(`light-theme`, `dark-theme`);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export { ThemeProvider, useTheme };
