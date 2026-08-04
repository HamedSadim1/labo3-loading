import React from "react";
import Icon from "./Icon";
import { LOADING_UI_COPY } from "../constants";

interface LoadingIdleViewProps {
  onStart: () => void;
  startButtonRef: React.RefObject<HTMLButtonElement | null>;
}

const LoadingIdleView: React.FC<LoadingIdleViewProps> = ({
  onStart,
  startButtonRef,
}) => (
  <div className="space-y-4">
    <button
      ref={startButtonRef}
      type="button"
      onClick={onStart}
      className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl brand-gradient px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-950/30 transition duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cyan-950/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-cyan-300/25 active:scale-[0.98] active:translate-y-0 sm:py-4"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-1000 ease-in-out group-hover:translate-x-full group-focus-visible:translate-x-full" />
      <span className="relative flex items-center justify-center gap-2.5">
        <Icon
          name="play"
          className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12 group-active:scale-90"
        />
        {LOADING_UI_COPY.startButton}
      </span>
    </button>
    <p className="text-center text-xs leading-5 text-white/75">
      {LOADING_UI_COPY.idleDescription}
    </p>
  </div>
);

export default LoadingIdleView;
