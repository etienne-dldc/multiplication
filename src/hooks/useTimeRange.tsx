import { useRenderAt } from "./useRenderAt";

export type TimeRange = [startAt: number, endAt: number];

export type TimeRangeResult =
  | null
  | { animating: true; progress: number }
  | { animating: false; position: "start" | "end" };

export function useTimeRange(range: TimeRange | null): TimeRangeResult {
  const now = Date.now();

  const { renderAt, result } = ((): {
    renderAt: number | null;
    result: TimeRangeResult;
  } => {
    if (range === null) {
      return { renderAt: null, result: null };
    }
    const [startAt, endAt] = range;
    if (now <= startAt) {
      return {
        renderAt: startAt,
        result: { animating: false, position: "start" },
      };
    }
    if (now >= endAt) {
      return { renderAt: null, result: { animating: false, position: "end" } };
    }
    const progress = (now - startAt) / (endAt - startAt);
    return { renderAt: endAt, result: { animating: true, progress } };
  })();

  useRenderAt(renderAt);
  return result;
}
