"use client"
import { useEffect } from 'react'

/**
 * Hook to manage macOS-style scrollbar visibility
 * Shows scrollbar when scrolling, hides after 3.5 seconds of inactivity
 */
export function useScrollbarVisibility() {
  useEffect(() => {
    const scrollableElements = new Set<Element>();
    const timeouts = new Map<Element, NodeJS.Timeout>();

    const isScrollable = (element: Element): boolean => {
      const style = window.getComputedStyle(element);
      const overflowY = style.overflowY;
      const overflowX = style.overflowX;
      const hasOverflow = 
        (overflowY === 'auto' || overflowY === 'scroll' || overflowY === 'overlay') ||
        (overflowX === 'auto' || overflowX === 'scroll' || overflowX === 'overlay');
      
      if (!hasOverflow) return false;
      
      return element.scrollHeight > element.clientHeight || 
             element.scrollWidth > element.clientWidth;
    };

    const showScrollbar = (element: Element) => {
      element.classList.add('scrollbar-visible');
      
      // Clear existing timeout
      const existingTimeout = timeouts.get(element);
      if (existingTimeout) {
        clearTimeout(existingTimeout);
      }
      
      // Hide after 3.5 seconds
      const timeout = setTimeout(() => {
        element.classList.remove('scrollbar-visible');
        timeouts.delete(element);
      }, 3500);
      
      timeouts.set(element, timeout);
    };

    const hideScrollbar = (element: Element) => {
      const timeout = timeouts.get(element);
      if (timeout) {
        clearTimeout(timeout);
        timeouts.delete(element);
      }
      element.classList.remove('scrollbar-visible');
    };

    const setupElement = (element: Element) => {
      if (!isScrollable(element) || scrollableElements.has(element)) return;
      if (element === document.documentElement || element === document.body) return;

      scrollableElements.add(element);

      const scrollHandler = () => showScrollbar(element);
      const hoverHandler = () => showScrollbar(element);
      const mouseLeaveHandler = () => {
        // Don't hide immediately, let timeout handle it
      };

      element.addEventListener('scroll', scrollHandler, { passive: true });
      element.addEventListener('mouseenter', hoverHandler);
      element.addEventListener('mouseleave', mouseLeaveHandler);

      // Store cleanup function
      (element as any).__scrollbarCleanup = () => {
        element.removeEventListener('scroll', scrollHandler);
        element.removeEventListener('mouseenter', hoverHandler);
        element.removeEventListener('mouseleave', mouseLeaveHandler);
        const timeout = timeouts.get(element);
        if (timeout) clearTimeout(timeout);
        timeouts.delete(element);
        scrollableElements.delete(element);
      };
    };

    // Setup existing scrollable elements
    const checkAndSetup = () => {
      const allElements = document.querySelectorAll('*');
      allElements.forEach(setupElement);
    };

    // Initial setup
    checkAndSetup();

    // Watch for new elements
    const observer = new MutationObserver(() => {
      checkAndSetup();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Cleanup
    return () => {
      observer.disconnect();
      scrollableElements.forEach((element) => {
        const cleanup = (element as any).__scrollbarCleanup;
        if (cleanup) cleanup();
      });
      timeouts.forEach((timeout) => clearTimeout(timeout));
      scrollableElements.clear();
      timeouts.clear();
    };
  }, []);
}

