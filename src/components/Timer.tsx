import { useMemo } from "react";
import { useIsInTimeRange } from "../hooks/useIsInTimeRange";

type TimerProps = {
  timer: [startAt: number, endAt: number] | null;
  size?: number;
  strokeWidth?: number;
  rotation?: "clockwise" | "counterclockwise";
};

export function Timer({
  size = 200,
  strokeWidth = 12,
  rotation = "clockwise",
  timer,
}: TimerProps): JSX.Element | null {
  const { path, pathLength } = useMemo(
    () => getPathProps(size, strokeWidth, rotation),
    [size, strokeWidth, rotation]
  );

  const animating = useIsInTimeRange(timer);
  console.log(animating);

  const strokeDashoffset = pathLength / 2;

  return (
    <div style={{ width: size, height: size }} className="bg-slate-200">
      <svg width={size} height={size} xmlns="http://www.w3.org/2000/svg">
        <path
          d={path}
          fill="none"
          stroke={"#d9d9d9"}
          strokeWidth={strokeWidth}
        />
        <path
          d={path}
          fill="none"
          stroke={"red"}
          strokeLinecap={"round"}
          strokeWidth={strokeWidth}
          strokeDasharray={pathLength}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </div>
  );
}

function getPathProps(
  size: number,
  strokeWidth: number,
  rotation: "clockwise" | "counterclockwise"
) {
  const halfSize = size / 2;
  const halfStrokeWith = strokeWidth / 2;
  const arcRadius = halfSize - halfStrokeWith;
  const arcDiameter = 2 * arcRadius;
  const rotationIndicator = rotation === "clockwise" ? "1,0" : "0,1";

  const pathLength = 2 * Math.PI * arcRadius;
  const path = `m ${halfSize},${halfStrokeWith} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,${arcDiameter} a ${arcRadius},${arcRadius} 0 ${rotationIndicator} 0,-${arcDiameter}`;

  return { path, pathLength };
}
