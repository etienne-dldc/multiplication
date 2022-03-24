import { TimeRange } from "../hooks/useIsInTimeRange";
import { Timer } from "./Timer";

type GameSoloProps = {};

const range: TimeRange = [Date.now() + 1000, Date.now() + 3000];

export function GameSolo({}: GameSoloProps): JSX.Element | null {
  return (
    <div className="rounded-2xl shadow-md bg-white flex flex-col items-stretch p-3 space-y-3 h-full">
      <Timer timer={range} />
    </div>
  );
}
