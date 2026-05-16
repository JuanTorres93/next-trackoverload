import { useEffect, useRef } from 'react';

/**
 * Fires `callback(currentWidth)` on mount and whenever the window crosses
 * the given `breakpoint` threshold (going from above → below or below → above).
 *
 * @param breakpoint - Pixel value used as the crossing threshold
 * @param callback   - Called with the current window width on each crossing (and on mount)
 */
export function useScreenResize(
  breakpoint: number,
  callback: (width: number) => void,
) {
  const wasBelow = useRef<boolean | null>(null);

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const isBelow = width < breakpoint;

      if (wasBelow.current === null || wasBelow.current !== isBelow) {
        wasBelow.current = isBelow;
        callback(width);
      }
    }

    // Initialise on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint, callback]);
}
