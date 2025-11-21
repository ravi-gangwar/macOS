import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { INITIAL_Z_INDEX, WINDOW_CONFIG } from "../constants";

type WindowStore = {
    windows: typeof WINDOW_CONFIG;
    nextZindex: number;
    openWindow: (windowKey: keyof typeof WINDOW_CONFIG, data?: any) => void;
    closeWindow: (windowKey: keyof typeof WINDOW_CONFIG) => void;
    focusWindow: (windowKey: keyof typeof WINDOW_CONFIG) => void;
};

const useWindowStore = create(immer<WindowStore>((set) => ({
    windows: WINDOW_CONFIG,
    nextZindex: INITIAL_Z_INDEX + 1,
    openWindow: (windowKey, data = null) => set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = true;
        win.zIndex = state.nextZindex;
        win.data = data ?? win.data;
        state.nextZindex++;
    }),
    closeWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.isOpen = false;
        win.zIndex = INITIAL_Z_INDEX;
        win.data = null;
    }),
    focusWindow: (windowKey) => set((state) => {
        const win = state.windows[windowKey];
        win.zIndex = state.nextZindex++;
    }),

})));

export default useWindowStore;