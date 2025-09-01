// src/hooks/useTheme.ts
import { useEffect, useState } from 'react';

export const useTheme = (themes: string[] = ['pargarX']) => {
  const [theme, setTheme] = useState<string>(() => {
    const saved = localStorage.getItem('theme');
    if (saved && themes.includes(saved)) return saved;
    return themes[0]; // default to 'pargarX'
  });

  useEffect(() => {
    const root = document.documentElement;

    // remove all other theme classes
    themes.forEach(t => root.classList.remove(t));
    // add current theme
    root.classList.add(theme);

    localStorage.setItem('theme', theme);
  }, [theme, themes]);

  return { theme, setTheme };
};
