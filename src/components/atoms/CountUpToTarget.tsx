"use client";

import { useEffect, useState } from "react";

type EasingFunction = "linear" | "ease-in" | "ease-out" | "ease-in-out";
type TransitionType = "none" | "fade" | "slideUp" | "slideDown" | "flipUp" | "flipDown";

const easingFunctions = {
  linear: (t: number) => t,
  "ease-in": (t: number) => t * t,
  "ease-out": (t: number) => 1 - (1 - t) * (1 - t),
  "ease-in-out": (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
};

export function CountUpToTarget({
  startValue = 0,
  targetValue,
  duration,
  easing = "linear",
  transition = "none",
}: {
  startValue?: number;
  targetValue: number;
  duration?: number;
  easing?: EasingFunction;
  transition?: TransitionType;
}) {
  const [count, setCount] = useState(startValue);

  useEffect(() => {
    const start = performance.now();
    const valueRange = targetValue - startValue;

    const step = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / (duration || 1000), 1);
      const easedProgress = easingFunctions[easing](progress);
      const currentValue = startValue + Math.floor(easedProgress * valueRange);
      setCount(currentValue);
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [startValue, targetValue, duration, easing, transition]);

  return <span>{count}</span>;
}
