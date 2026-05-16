import { useEffect, useRef, useCallback } from 'react';

//It returns a debounced version of the given function.
export function useDebounce<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void | Promise<void>,
  delay = 500
) {
  // Ref to store the current timeout ID.
  // We use a ref because its value persists across re-renders without triggering new renders.

  // @ts-expect-error parameter can be undefined, type descriptor is incorrect
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const fnRef = useRef(fn);

  // Mantén siempre la última versión de fn sin cambiar la identidad del handler debounced.
  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  // Cleanup: when the component using this hook unmounts,
  // cancel any pending timeout so fn won’t run later unexpectedly.
  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  // The debounced function:
  // - Cancels the previous timeout
  // - Starts a new one that will run fn after "delay" ms
  const debounced = useCallback(
    (...args: TArgs) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        void fnRef.current(...args);
      }, delay);
    },
    [delay]
  ); // <- identidad estable; solo cambia si cambia `delay`

  return debounced;
}
