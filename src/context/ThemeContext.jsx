import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const THEME_PRESETS = [
  { id: 'emerald', name: 'Oscuro Esmeralda', colorClass: 'bg-emerald-500', isDark: true },
  { id: 'purple', name: 'Oscuro Morado', colorClass: 'bg-purple-500', isDark: true },
  { id: 'blue', name: 'Oscuro Azul Océano', colorClass: 'bg-blue-500', isDark: true },
  { id: 'amber', name: 'Oscuro Ámbar', colorClass: 'bg-amber-500', isDark: true },
  { id: 'light', name: 'Página Blanca (Modo Claro)', colorClass: 'bg-slate-100 text-slate-900 border-slate-300', isDark: false }
];

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('educ_app_theme') || 'emerald';
  });

  const [lastDarkTheme, setLastDarkTheme] = useState(() => {
    const saved = localStorage.getItem('educ_app_theme');
    return (saved && saved !== 'light') ? saved : 'emerald';
  });

  useEffect(() => {
    localStorage.setItem('educ_app_theme', theme);
    document.documentElement.classList.remove('theme-emerald', 'theme-purple', 'theme-blue', 'theme-amber', 'theme-light');
    document.documentElement.classList.add(`theme-${theme}`);

    if (theme !== 'light') {
      setLastDarkTheme(theme);
    }
  }, [theme]);

  const changeTheme = (newThemeId) => {
    setTheme(newThemeId);
  };

  const toggleDarkLight = () => {
    if (theme === 'light') {
      setTheme(lastDarkTheme || 'emerald');
    } else {
      setTheme('light');
    }
  };

  const isLightMode = theme === 'light';

  return (
    <ThemeContext.Provider value={{ theme, changeTheme, toggleDarkLight, isLightMode, presets: THEME_PRESETS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
