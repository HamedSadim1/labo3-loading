import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ children }) => {
  return (
    <div className="relative group">
      {/* Outer glow effect */}
      <div className="absolute -inset-1 bg-linear-to-r from-blue-400/20 via-purple-400/20 to-pink-400/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main card */}
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] p-8 sm:p-10 max-w-md w-full text-center transition-all duration-500 hover:bg-white/15 hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:scale-[1.02] animate-glow">
        {/* Inner highlight */}
        <div className="absolute inset-0 rounded-3xl bg-linear-to-b from-white/10 to-transparent pointer-events-none" />

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </div>
    </div>
  );
};

export default GlassCard;
