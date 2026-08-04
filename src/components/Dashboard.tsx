import React, { useState, useEffect } from "react";
import { useApp } from "../context/useApp";

interface StatCard {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const { metrics, activePanel, openPanel, closePanel, addToast } = useApp();
  const isOpen = activePanel === "dashboard";
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0]);
  const averageDuration = metrics.completedRuns
    ? metrics.totalDurationMs / metrics.completedRuns
    : 0;
  const recentRuns = metrics.recentDurations.length;

  const stats: StatCard[] = [
    {
      label: "Totaal Laden",
      value: metrics.totalRuns.toLocaleString("nl-NL"),
      icon: <span aria-hidden="true">↯</span>,
    },
    {
      label: "Gem. Tijd",
      value: metrics.completedRuns
        ? `${(averageDuration / 1000).toFixed(1)}s`
        : "—",
      icon: <span aria-hidden="true">◷</span>,
    },
    {
      label: "Succes%",
      value: metrics.totalRuns
        ? `${Math.round((metrics.completedRuns / metrics.totalRuns) * 100)}%`
        : "—",
      icon: <span aria-hidden="true">✓</span>,
    },
    {
      label: "Recente runs",
      value: recentRuns.toString(),
      icon: <span aria-hidden="true">↗</span>,
    },
  ];

  useEffect(() => {
    if (!isOpen) return;

    const targets = [
      metrics.totalRuns,
      averageDuration / 1000,
      metrics.totalRuns ? (metrics.completedRuns / metrics.totalRuns) * 100 : 0,
      recentRuns,
    ];
    const steps = 30;
    let step = 0;
    const interval = window.setInterval(() => {
      step += 1;
      const progress = 1 - Math.pow(1 - step / steps, 3);
      setAnimatedValues(
        targets.map((target) => Math.round(target * progress * 10) / 10),
      );
      if (step >= steps) window.clearInterval(interval);
    }, 1000 / steps);

    return () => window.clearInterval(interval);
  }, [
    averageDuration,
    isOpen,
    metrics.completedRuns,
    metrics.totalRuns,
    recentRuns,
  ]);

  const formatValue = (index: number, original: string) => {
    if (original === "—") return original;
    if (original.endsWith("s")) return `${animatedValues[index].toFixed(1)}s`;
    if (original.endsWith("%")) return `${Math.round(animatedValues[index])}%`;
    return Math.round(animatedValues[index]).toLocaleString("nl-NL");
  };

  const chartData = metrics.recentDurations.length
    ? metrics.recentDurations.map((duration) =>
        Math.min(
          100,
          Math.max(12, 100 - (duration / Math.max(1, averageDuration)) * 35),
        ),
      )
    : [20, 20, 20, 20, 20, 20];

  const handleOpen = () => {
    openPanel("dashboard");
    addToast("Dashboard geopend", "info");
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleOpen}
        className="group relative rounded-xl border border-white/15 bg-white/10 p-2.5 text-white/70 transition hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
        aria-label="Dashboard"
        aria-expanded={isOpen}
      >
        <svg
          className="h-4 w-4 sm:h-5 sm:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="Dashboard"
          className="fixed inset-x-3 top-20 z-50 max-h-[calc(100vh-6rem)] overflow-y-auto rounded-2xl border border-white/20 bg-slate-900/95 shadow-2xl backdrop-blur-xl animate-slide-up sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:bottom-auto sm:mt-2 sm:w-[480px] sm:max-w-[calc(100vw-2rem)] sm:max-h-[calc(100vh-7rem)] sm:overflow-y-auto sm:bg-white/10"
        >
          <div className="flex items-center justify-between border-b border-white/10 bg-white/10 px-4 py-3 sm:px-6 sm:py-4">
            <div>
              <h3 className="text-base font-semibold text-white sm:text-lg">
                Dashboard
              </h3>
              <p className="mt-0.5 text-[10px] text-white/40 sm:text-xs">
                Live data uit je loading-sessies
              </p>
            </div>
            <button
              type="button"
              onClick={closePanel}
              className="rounded-lg p-1 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300/40"
              aria-label="Sluiten"
            >
              ×
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 p-3 sm:gap-4 sm:p-6">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 sm:p-4"
              >
                <div className="mb-2 flex items-center gap-2 text-white/70 sm:gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-sm sm:h-10 sm:w-10">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] text-white/50 sm:text-xs">
                    {stat.label}
                  </span>
                </div>
                <span className="text-lg font-bold text-white sm:text-2xl">
                  {formatValue(index, stat.value)}
                </span>
              </div>
            ))}
          </div>
          <div className="px-3 pb-3 sm:px-6 sm:pb-6">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between sm:mb-4">
                <span className="text-xs font-medium text-white/70 sm:text-sm">
                  Recente sessies
                </span>
                <span className="text-[10px] text-white/40 sm:text-xs">
                  {recentRuns} runs
                </span>
              </div>
              <div className="flex h-20 items-end gap-1 sm:h-24">
                {chartData.map((value, index) => (
                  <div
                    key={`${value}-${index}`}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <div
                      className="w-full rounded-t bg-linear-to-t from-cyan-500 to-violet-400 transition hover:from-cyan-300 hover:to-violet-300"
                      style={{ height: `${value}%` }}
                      title={`Sessie ${index + 1}`}
                    />
                    <span className="text-[8px] text-white/35">
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
