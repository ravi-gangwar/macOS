import { useEffect } from 'react';
import useSettingsStore from '../store/settings';

export function useDarkTheme() {
  const darkTheme = useSettingsStore((state) => state.darkTheme);

  useEffect(() => {
    const html = document.documentElement;
    if (darkTheme) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkTheme]);

  return darkTheme;
}

