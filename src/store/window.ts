import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "../constants";

type WindowStore = {
    windows: typeof WINDOW_CONFIG;
    nextZindex: number;
    openWindow: (windowKey: keyof typeof WINDOW_CONFIG, data?: any) => void;
    closeWindow: (windowKey: keyof typeof WINDOW_CONFIG) => void;
    startClosing: (windowKey: keyof typeof WINDOW_CONFIG) => void;
    finishClosing: (windowKey: keyof typeof WINDOW_CONFIG) => void;
    minimizeWindow: (windowKey: keyof typeof WINDOW_CONFIG) => void;
    restoreWindow: (windowKey: keyof typeof WINDOW_CONFIG) => void;
    focusWindow: (windowKey: keyof typeof WINDOW_CONFIG) => void;
    updateWindowPosition: (windowKey: keyof typeof WINDOW_CONFIG, x: number, y: number) => void;
};

const useWindowStore = create(immer<WindowStore>((set) => ({
    windows: WINDOW_CONFIG,
    nextZindex: INITIAL_Z_INDEX + 1,
    openWindow: (windowKey, data = null) => set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = true;
        win.isClosing = false;
        win.isMinimized = false;
        win.zIndex = state.nextZindex;
        win.data = data ?? win.data;
        state.nextZindex++;
    }),
    minimizeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.isMinimized = true;
    }),
    restoreWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.isMinimized = false;
        win.zIndex = state.nextZindex++;
    }),
    startClosing: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.isClosing = true;
    }),
    finishClosing: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = false;
        win.isClosing = false;
        win.zIndex = INITIAL_Z_INDEX;
        // Keep x, y coordinates - don't reset them
        win.data = null;
    }),
    closeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = false;
        win.isClosing = false;
        win.zIndex = INITIAL_Z_INDEX;
        // Keep x, y coordinates - don't reset them
        win.data = null;
    }),
    focusWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.zIndex = state.nextZindex++;
    }),
    updateWindowPosition: (windowKey, x, y) => set((state) => {
        const win = state.windows[windowKey];
        win.x = x;
        win.y = y;
    }),

})));

export default useWindowStore;