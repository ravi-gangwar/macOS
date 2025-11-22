import { create } from "zustand";
import { persist } from "zustand/middleware";

type TextSize = "sm" | "md" | "lg" | "xl";

type SettingsStore = {
  textSize: TextSize;
  darkTheme: boolean;
  brightness: number; // 0-100
  setTextSize: (size: TextSize) => void;
  setDarkTheme: (enabled: boolean) => void;
  setBrightness: (value: number) => void;
};

const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      textSize: "sm",
      darkTheme: false,
      brightness: 100,
      setTextSize: (size) => set({ textSize: size }),
      setDarkTheme: (enabled) => set({ darkTheme: enabled }),
      setBrightness: (value) => set({ brightness: Math.max(0, Math.min(100, value)) }),
    }),
    {
      name: "macos-portfolio-settings",
    }
  )
);

export default useSettingsStore;
export type { TextSize };

