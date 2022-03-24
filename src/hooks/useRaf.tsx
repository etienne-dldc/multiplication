import { useEffect, useRef } from "react";

type RafFn = () => void;

export function useRaf(fn: RafFn | null): void {
  const fnRef = useRef(fn);

  useEffect(() => {
    fnRef.current = fn;
  }, [fn]);

  const running = fn !== null;

  useEffect(() => {
    if (!running) {
      return;
    }
    let rafId: number | null = null;
    function loop() {
      fnRef.current?.();
      rafId = requestAnimationFrame(loop);
    }
    loop();
    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [running]);
}
