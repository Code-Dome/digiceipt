import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ColorBlindMode = "none" | "protanopia" | "deuteranopia" | "tritanopia";

interface ThemeContextType {
  theme: Theme;
  colorBlindMode: ColorBlindMode;
  toggleTheme: () => void;
  setColorBlindMode: (mode: ColorBlindMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  colorBlindMode: "none",
  toggleTheme: () => {},
  setColorBlindMode: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "light";
  });
  
  const [colorBlindMode, setColorBlindMode] = useState<ColorBlindMode>(() => {
    const saved = localStorage.getItem("colorBlindMode");
    return (saved as ColorBlindMode) || "none";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("colorBlindMode", colorBlindMode);
    document.documentElement.setAttribute("data-color-blind-mode", colorBlindMode);
  }, [colorBlindMode]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colorBlindMode,
        toggleTheme,
        setColorBlindMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);