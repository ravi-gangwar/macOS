"use client"
import useWindowStore from '../store/window'
import { WINDOW_CONFIG } from '../constants'

interface WindowControlsProps {
  windowKey: keyof typeof WINDOW_CONFIG;
}

function WindowControls({ windowKey }: WindowControlsProps) {
  const { startClosing, minimizeWindow, focusWindow } = useWindowStore();

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    startClosing(windowKey);
  };

  const handleMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    minimizeWindow(windowKey);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Maximize functionality can be added later
  };

  return (
    <div id="window-controls" className="macos-window-controls">
      <button
        type="button"
        className="macos-btn macos-btn-close"
        aria-label="Close"
        onClick={handleClose}
      />
      <button
        type="button"
        className="macos-btn macos-btn-minimize"
        aria-label="Minimize"
        onClick={handleMinimize}
      />
      <button
        type="button"
        className="macos-btn macos-btn-maximize"
        aria-label="Maximize"
        onClick={handleMaximize}
      />
    </div>
  );
}

export default WindowControls;

