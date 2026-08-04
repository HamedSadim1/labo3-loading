import React from "react";
import { APP_TITLE } from "../constants/app";

const Header: React.FC = () => {
  return (
    <div className="mb-8 animate-slide-up">
      {/* Icon */}
      <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
        <svg
          className="w-8 h-8 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      </div>

      {/* Title */}
      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 tracking-tight">
        <span className="bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
          {APP_TITLE}
        </span>
      </h1>

      {/* Subtitle */}
      <p className="text-white/60 text-sm sm:text-base font-light tracking-wide">
        Moderne laad-ervaring met stijl
      </p>
    </div>
  );
};

export default Header;
