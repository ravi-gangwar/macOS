import { useEffect } from 'react';
import useSettingsStore from '../store/settings';

export function useBrightness() {
  const brightness = useSettingsStore((state) => state.brightness);

  useEffect(() => {
    const body = document.body;
    // Convert brightness from 0-100 to filter value (0.3 to 1.5 range for better UX)
    // 0% = 0.3 (very dark), 50% = 0.9, 100% = 1.5 (very bright)
    const brightnessValue = 0.3 + (brightness / 100) * 1.2;
    body.style.filter = `brightness(${brightnessValue})`;
    body.style.transition = 'filter 0.3s ease';
  }, [brightness]);

  return brightness;
}

