import { useEffect } from "react";
import { useForceRender } from "./useForceRender";

export function useRenderAt(time: number | null) {
  const [renderToken, forceRender] = useForceRender();

  useEffect(() => {
    if (time === null) {
      return;
    }
    const now = Date.now();
    const diff = time - now;
    if (diff <= 0) {
      return;
    }
    const timer = setTimeout(() => {
      forceRender();
    }, diff);
    return () => {
      clearTimeout(timer);
    };
  }, [time]);

  return renderToken;
}
