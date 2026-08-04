import React, { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { ANIMATION_CONFIG } from "../constants";
import { formatNumber, type NumberFormat } from "../utils/formatters";

interface AnimatedNumberProps {
  value: number;
  format?: NumberFormat;
  suffix?: string;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format = "integer",
  suffix = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const displayValueRef = useRef(0);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const startValue = displayValueRef.current;

    if (prefersReducedMotion || startValue === value) {
      displayValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    const startedAt = performance.now();
    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min(
        (now - startedAt) / ANIMATION_CONFIG.numberDurationMs,
        1,
      );
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (value - startValue) * easedProgress;
      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [prefersReducedMotion, value]);

  return <span>{formatNumber(displayValue, format, suffix)}</span>;
};

export default AnimatedNumber;
