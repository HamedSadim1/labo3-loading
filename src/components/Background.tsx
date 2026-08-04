import React from "react";

interface BackgroundProps {
  children: React.ReactNode;
}

const Background: React.FC<BackgroundProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-slate-950 text-white selection:bg-cyan-300/30 selection:text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.18),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.16),transparent_32%),linear-gradient(135deg,#0f172a_0%,#1e1b4b_52%,#111827_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-cyan-400/5 via-transparent to-fuchsia-400/10 animate-gradient bg-size-[180%_180%]" />

      <div className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-cyan-400/15 blur-3xl animate-float sm:h-96 sm:w-96" />
      <div className="pointer-events-none absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-fuchsia-400/15 blur-3xl animate-float [animation-delay:-3s] sm:h-112 sm:w-md" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-violet-400/10 blur-3xl animate-float [animation-delay:-1.5s] sm:h-64 sm:w-64" />

      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(rgba(255,255,255,0.45)_0.6px,transparent_0.6px)] bg-size-[18px_18px]" />
      {children}
    </div>
  );
};

export default Background;
