import { useEffect, useRef, RefObject } from 'react';

export function useOutsideClick<T extends HTMLElement = HTMLElement>(
  handler: () => void,
  listenCapturing: boolean = true
): RefObject<T | null> {
  const ref = useRef<T>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      if (ref.current && !ref.current.contains(target)) {
        handler();
      }
    };

    document.addEventListener('click', handleClick, listenCapturing);

    return () => {
      document.removeEventListener('click', handleClick, listenCapturing);
    };
  }, [handler, listenCapturing]);

  return ref;
}
