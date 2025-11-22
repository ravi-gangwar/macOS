"use client"
import { useEffect } from 'react'
import useSettingsStore from '../store/settings'
import { useBrightness } from '../hooks/useBrightness'
import { useScrollbarVisibility } from '../hooks/useScrollbarVisibility'

export default function DarkThemeProvider({ children }: { children: React.ReactNode }) {
  const darkTheme = useSettingsStore((state) => state.darkTheme);
  useBrightness(); // Apply brightness filter
  useScrollbarVisibility(); // Manage scrollbar visibility

  // Apply theme when it changes
  useEffect(() => {
    const html = document.documentElement;
    
    if (darkTheme === true) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkTheme]);

  return <>{children}</>;
}

