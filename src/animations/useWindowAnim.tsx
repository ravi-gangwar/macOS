import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useEffect, useRef } from "react";
import { dockApps } from "../constants";

interface UseWindowAnimProps {
  windowKey: string;
  isOpen: boolean;
  isClosing: boolean;
  storedX?: number;
  storedY?: number;
  onCloseComplete?: () => void;
}

function useWindowAnim({ windowKey, isOpen, isClosing, storedX = 0, storedY = 0, onCloseComplete }: UseWindowAnimProps) {
  const windowRef = useRef<HTMLElement | null>(null);
  const hasAnimatedOpenRef = useRef(false);

  // Get dock icon position for the window
  const getDockIconPosition = () => {
    const dock = document.querySelector("#dock .dock-container") as HTMLElement;
    if (!dock) return null;

    const dockApp = dockApps.find((app) => app.id === windowKey);
    if (!dockApp) return null;

    const icons = dock.querySelectorAll(".dock-icon");
    const iconIndex = dockApps.findIndex((app) => app.id === windowKey);
    
    if (iconIndex === -1 || !icons[iconIndex]) return null;

    const icon = icons[iconIndex] as HTMLElement;
    const iconRect = icon.getBoundingClientRect();

    // Get window element to calculate relative position
    const windowEl = windowRef.current;
    if (!windowEl) return null;

    const windowRect = windowEl.getBoundingClientRect();
    const currentX = windowRect.left + windowRect.width / 2;
    const currentY = windowRect.top + windowRect.height / 2;
    const targetX = iconRect.left + iconRect.width / 2;
    const targetY = iconRect.top + iconRect.height / 2;

    return {
      x: targetX - currentX,
      y: targetY - currentY,
      scale: iconRect.width / Math.max(windowRect.width, 400), // Scale based on icon vs window size
    };
  };

  // Opening animation
  useGSAP(() => {
    const windowEl = windowRef.current;
    if (!windowEl || !isOpen || hasAnimatedOpenRef.current) return;

    hasAnimatedOpenRef.current = true;
    const iconPos = getDockIconPosition();
    const isFirstOpen = storedX === 0 && storedY === 0;

    // Set transform origin to center for proper scaling
    gsap.set(windowEl, { transformOrigin: "center center" });

    // If first time opening, animate from dock icon
    if (isFirstOpen && iconPos) {
      // Set initial position and scale from dock icon
      gsap.set(windowEl, {
        x: iconPos.x,
        y: iconPos.y,
        scale: iconPos.scale,
        opacity: 0,
      });

      // Animate to final position (center)
      gsap.to(windowEl, {
        x: 0,
        y: 0,
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      });
    } else if (isFirstOpen) {
      // Fallback: simple fade and scale if dock icon not found (first time)
      gsap.set(windowEl, {
        scale: 0.8,
        opacity: 0,
        x: 0,
        y: 0,
      });
      gsap.to(windowEl, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    } else {
      // Reopening: restore to last position with fade in
      gsap.set(windowEl, {
        x: storedX,
        y: storedY,
        scale: 0.95,
        opacity: 0,
      });
      gsap.to(windowEl, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [isOpen, windowKey, storedX, storedY]);

  // Reset animation flag when window closes
  useEffect(() => {
    if (!isOpen && !isClosing) {
      hasAnimatedOpenRef.current = false;
    }
  }, [isOpen, isClosing]);

  // Closing animation
  useEffect(() => {
    const windowEl = windowRef.current;
    if (!windowEl || !isClosing) return;

    // Ensure transform origin is set
    gsap.set(windowEl, { transformOrigin: "center center" });

    const iconPos = getDockIconPosition();

    if (iconPos) {
      // Get current position
      const currentX = gsap.getProperty(windowEl, "x") as number || 0;
      const currentY = gsap.getProperty(windowEl, "y") as number || 0;
      
      // Animate to dock icon position (relative to current position)
      gsap.to(windowEl, {
        x: currentX + iconPos.x,
        y: currentY + iconPos.y,
        scale: iconPos.scale,
        opacity: 0,
        duration: 0.35,
        ease: "power2.in",
        onComplete: () => {
          // Reset transforms after animation
          gsap.set(windowEl, { x: 0, y: 0, scale: 1, opacity: 1 });
          onCloseComplete?.();
        },
      });
    } else {
      // Fallback: simple fade and scale out
      gsap.to(windowEl, {
        scale: 0.8,
        opacity: 0,
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => {
          // Reset transforms after animation
          gsap.set(windowEl, { scale: 1, opacity: 1 });
          onCloseComplete?.();
        },
      });
    }
  }, [isClosing, windowKey, onCloseComplete]);

  return windowRef;
}

export default useWindowAnim;

