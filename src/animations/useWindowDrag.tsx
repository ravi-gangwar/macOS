import { useEffect, useRef } from "react";
import gsap from "gsap";
import useWindowStore from "../store/window";
import { WINDOW_CONFIG } from "../constants";

interface UseWindowDragProps {
  windowKey: keyof typeof WINDOW_CONFIG;
  windowRef: React.RefObject<HTMLElement | null>;
  isOpen: boolean;
}

function useWindowDrag({ windowKey, windowRef, isOpen }: UseWindowDragProps) {
  const { updateWindowPosition, focusWindow } = useWindowStore();
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const mouseDownPosRef = useRef({ x: 0, y: 0 });
  const isMouseDownRef = useRef(false);

  useEffect(() => {
    // Only set up drag when window is open
    if (!isOpen) return;

    const windowEl = windowRef.current;
    if (!windowEl) return;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Don't drag if clicking on interactive elements
      if (
        target.closest("button") || 
        target.closest("a") || 
        target.closest("input") || 
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest("iframe") ||
        target.closest(".settings-option") ||
        target.closest(".settings-nav-item") ||
        target.closest("#window-controls") ||
        target.closest(".macos-btn")
      ) {
        return;
      }

      // Store initial mouse position
      mouseDownPosRef.current = { x: e.clientX, y: e.clientY };
      isMouseDownRef.current = true;
      isDraggingRef.current = false;

      // Focus window on mousedown
      focusWindow(windowKey);

      // Get current GSAP transform values
      const currentX = (gsap.getProperty(windowEl, "x") as number) || 0;
      const currentY = (gsap.getProperty(windowEl, "y") as number) || 0;

      // Get window's current screen position
      const rect = windowEl.getBoundingClientRect();
      
      // Calculate offset: where the mouse is relative to the window's top-left corner
      startPosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isMouseDownRef.current) return;

      // Check if mouse has moved enough to start dragging (threshold: 5px)
      if (!isDraggingRef.current) {
        const deltaX = Math.abs(e.clientX - mouseDownPosRef.current.x);
        const deltaY = Math.abs(e.clientY - mouseDownPosRef.current.y);
        
        if (deltaX > 5 || deltaY > 5) {
          isDraggingRef.current = true;
          document.body.style.userSelect = "none";
          document.body.style.cursor = "grabbing";
          windowEl.style.cursor = "grabbing";
        } else {
          return; // Don't drag if movement is too small
        }
      }

      // Only update position if we're actually dragging
      if (!isDraggingRef.current) return;

      // Calculate new screen position: mouse position minus the offset
      const newScreenX = e.clientX - startPosRef.current.x;
      const newScreenY = e.clientY - startPosRef.current.y;

      // Get window dimensions
      const windowWidth = windowEl.offsetWidth;
      const windowHeight = windowEl.offsetHeight;

      // Get NavBar height (menu bar at top)
      const navBar = document.querySelector('nav') as HTMLElement;
      const navBarHeight = navBar ? navBar.offsetHeight : 50;

      // Constrain X position (keep window within reasonable bounds)
      const minScreenX = -windowWidth + 100; // Allow some to go off-screen left
      const maxScreenX = window.innerWidth - 100; // Keep some on-screen right
      const constrainedScreenX = Math.max(minScreenX, Math.min(maxScreenX, newScreenX));

      // Constrain Y position (prevent going above NavBar, but allow going below Dock)
      const minScreenY = navBarHeight; // Don't go above NavBar
      const constrainedScreenY = Math.max(minScreenY, newScreenY);

      // Get the window's base position (without GSAP transforms)
      // We need to calculate what GSAP transform values to apply
      const rect = windowEl.getBoundingClientRect();
      const currentX = (gsap.getProperty(windowEl, "x") as number) || 0;
      const currentY = (gsap.getProperty(windowEl, "y") as number) || 0;
      
      // Base position is where the window would be without transforms
      const baseLeft = rect.left - currentX;
      const baseTop = rect.top - currentY;

      // Calculate new GSAP transform values
      const newX = constrainedScreenX - baseLeft;
      const newY = constrainedScreenY - baseTop;

      // Update position immediately using GSAP
      gsap.set(windowEl, { x: newX, y: newY });

      // Save to store
      updateWindowPosition(windowKey, newX, newY);
    };

    const handleMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        document.body.style.cursor = "";
        windowEl.style.cursor = "";
      }
      isMouseDownRef.current = false;
      document.body.style.userSelect = "";
    };

    windowEl.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      windowEl.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
      if (windowEl) {
        windowEl.style.cursor = "";
      }
    };
  }, [windowKey, windowRef, isOpen, updateWindowPosition, focusWindow]);
}

export default useWindowDrag;

