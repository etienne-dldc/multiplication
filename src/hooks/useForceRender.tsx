import { useCallback, useState } from "react";

export function useForceRender(): [Record<never, never>, () => void] {
  const [token, setState] = useState({});

  const forceRender = useCallback(() => setState({}), []);

  return [token, forceRender];
}
