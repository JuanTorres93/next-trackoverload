import { useRef } from 'react';

const DEFAULT_MIN_DISTANCE = 50;

function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  minDistance = DEFAULT_MIN_DISTANCE,
}: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  minDistance?: number;
}) {
  const touchStartXRef = useRef<number | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    touchStartXRef.current = e.touches[0].clientX;
  }

  function onTouchEnd(e: React.TouchEvent) {
    if (touchStartXRef.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(delta) < minDistance) return;

    if (delta < 0) onSwipeLeft?.();
    else onSwipeRight?.();
  }

  return { onTouchStart, onTouchEnd };
}

export default useSwipe;
