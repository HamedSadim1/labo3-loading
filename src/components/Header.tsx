import React from "react";
import { APP_TITLE } from "../constants/app";

const Header: React.FC = () => {
  return (
    <div className="mb-8 animate-slide-up sm:mb-10">
      <div className="mb-5 flex items-center justify-between text-left">
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.9)]" />
          Ready
        </div>
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/30">
          v3.0
        </span>
      </div>

      <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-linear-to-br from-cyan-300/20 to-violet-400/20 text-cyan-100 shadow-lg shadow-cyan-950/20 sm:h-20 sm:w-20">
        <svg
          className="h-8 w-8 sm:h-10 sm:w-10"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.7}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      <h1 className="text-4xl font-extrabold tracking-[-0.04em] text-white sm:text-5xl">
        <span className="bg-linear-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-transparent">
          {APP_TITLE}
        </span>
      </h1>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-white/55 sm:text-base">
        Een heldere, interactieve loading experience voor je labo-oefening.
      </p>
    </div>
  );
};

export default Header;
