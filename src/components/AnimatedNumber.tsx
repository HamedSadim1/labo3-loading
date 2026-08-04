import React, { useEffect, useRef, useState } from "react";

type NumberFormat = "integer" | "decimal" | "percent";

interface AnimatedNumberProps {
  value: number;
  format?: NumberFormat;
  suffix?: string;
}

const formatValue = (
  value: number,
  format: NumberFormat,
  suffix: string,
): string => {
  const formatted =
    format === "decimal"
      ? value.toFixed(1)
      : format === "percent"
        ? Math.round(value).toString()
        : Math.round(value).toLocaleString("nl-NL");

  return `${formatted}${suffix}`;
};

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  format = "integer",
  suffix = "",
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const displayValueRef = useRef(0);

  useEffect(() => {
    const reduceMotion =
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const startValue = displayValueRef.current;

    if (reduceMotion || startValue === value) {
      displayValueRef.current = value;
      setDisplayValue(value);
      return;
    }

    const startedAt = performance.now();
    const duration = 550;
    let frameId = 0;

    const animate = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const nextValue = startValue + (value - startValue) * easedProgress;
      displayValueRef.current = nextValue;
      setDisplayValue(nextValue);

      if (progress < 1) frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frameId);
  }, [value]);

  return <span>{formatValue(displayValue, format, suffix)}</span>;
};

export default AnimatedNumber;
