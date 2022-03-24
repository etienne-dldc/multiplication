import { useRenderAt } from "./useRenderAt";

export type TimeRange = [startAt: number, endAt: number];

export function useIsInTimeRange(range: TimeRange | null): boolean {
  const now = Date.now();

  const { renderAt, result } = (() => {
    if (range === null) {
      return { renderAt: null, result: false };
    }
    const [startAt, endAt] = range;
    if (now < startAt) {
      return { renderAt: startAt, result: false };
    }
    if (now > endAt) {
      return { renderAt: null, result: false };
    }
    return { renderAt: endAt, result: true };
  })();

  useRenderAt(renderAt);
  return result;
}
