import useSettingsStore from '../store/settings';
import { TextSize } from '../store/settings';

type TextSizeClasses = {
  base: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
};

const textSizeMap: Record<TextSize, TextSizeClasses> = {
  sm: {
    base: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
    '2xl': 'text-xl',
    '3xl': 'text-2xl',
    '4xl': 'text-3xl',
  },
  md: {
    base: 'text-sm',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
  },
  lg: {
    base: 'text-base',
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-xl',
    xl: 'text-2xl',
    '2xl': 'text-3xl',
    '3xl': 'text-4xl',
    '4xl': 'text-5xl',
  },
  xl: {
    base: 'text-lg',
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl',
    '2xl': 'text-4xl',
    '3xl': 'text-5xl',
    '4xl': 'text-6xl',
  },
};

export function useTextSize() {
  const textSize = useSettingsStore((state) => state.textSize);
  
  const getTextSize = (size: keyof TextSizeClasses = 'base'): string => {
    return textSizeMap[textSize][size];
  };

  return {
    textSize,
    getTextSize,
    textSizeClasses: textSizeMap[textSize],
  };
}

