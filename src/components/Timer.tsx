import { useCallback, useMemo, useRef } from "react";
import { useRaf } from "../hooks/useRaf";
import { useTimeRange } from "../hooks/useTimeRange";

type TimerProps = {
  timer: [startAt: number, endAt: number] | null;
  size?: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  rotation?: "clockwise" | "counterclockwise";
  startContent?: React.ReactNode | null;
  endContent?: React.ReactNode | null;
  disabledContent?: React.ReactNode | null;
  onClick?: () => void;
  className?: string;
};

export function Timer({
  size = 200,
  strokeWidth = 12,
  color = "red",
  bgColor = "#d9d9d9",
  rotation = "counterclockwise",
  timer,
  startContent = null,
  endContent = null,
  disabledContent = null,
  onClick,
  className = "",
}: TimerProps): JSX.Element | null {
  const { path, pathLength } = useMemo(
    () => getPathProps(size, strokeWidth, rotation),
    [size, strokeWidth, rotation]
  );

  const pathRef = useRef<SVGPathElement>(null);
  const counterRef = useRef<HTMLParagraphElement>(null);

  const anim = useTimeRange(timer);

  const rafFn = useCallback(() => {
    if (!timer) {
      return;
    }
    const pathElem = pathRef.current;
    if (!pathElem) {
      return;
    }
    const now = Date.now();
    const [startAt, endAt] = timer;
    const duration = endAt - startAt;
    const progress = (now - startAt) / duration;
    if (progress >= 1 || progress < 0) {
      return;
    }
    pathElem.setAttribute("stroke-dashoffset", `${pathLength * progress}`);
    const remaining = duration * (1 - progress);
    if (counterRef.current) {
      counterRef.current.innerText = (remaining / 1000).toFixed(1) + "s";
    }
  }, [pathLength, timer]);

  useRaf(anim?.animating === true ? rafFn : null);

  const bgRingColor =
    anim === null
      ? bgColor
      : anim.animating
      ? bgColor
      : anim.position === "start"
      ? color
      : bgColor;

  const content =
    anim === null ? (
      disabledContent
    ) : anim.animating ? (
      <p
        ref={counterRef}
        className="text-slate-900 text-center w-full font-mono"
      ></p>
    ) : anim.position === "start" ? (
      startContent
    ) : (
      endContent
    );

  return (
    <div
      style={{ width: size, height: size, fontSize: size * 0.16 }}
      className={"relative " + className}
      onClick={onClick}
    >
      <svg
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="absolute"
      >
        <path
          d={path}
          fill="none"
          stroke={bgRingColor}
          strokeWidth={strokeWidth}
        />
        {anim && anim.animating && (
          <path
            ref={pathRef}
            d={path}
            fill="none"
            stroke={color}
            strokeLinecap={"round"}
            strokeWidth={strokeWidth}
            strokeDasharray={pathLength}
            strokeDashoffset={0}
          />
        )}
      </svg>
      <div
        className="absolute rounded-full overflow-hidden flex items-center justify-center text-slate-900 text-center"
        style={{ inset: strokeWidth }}
      >
        {content}
      </div>
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
