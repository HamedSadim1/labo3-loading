import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ children }) => {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -inset-1 rounded-4xl bg-linear-to-r from-cyan-400/20 via-violet-400/20 to-fuchsia-400/20 opacity-70 blur-2xl" />
      <section className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-slate-900/75 p-6 text-center shadow-2xl shadow-slate-950/40 backdrop-blur-2xl sm:p-9">
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/8 via-transparent to-transparent" />
        <div className="relative z-10">{children}</div>
      </section>
    </div>
  );
};

export default GlassCard;
