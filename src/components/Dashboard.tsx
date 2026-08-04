import React from "react";
import AnimatedNumber from "./AnimatedNumber";
import DialogPanel from "./DialogPanel";
import IconButton from "./IconButton";
import { useApp } from "../context/useApp";

interface StatCard {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const { metrics, activePanel, openPanel, closePanel, addToast } = useApp();
  const isOpen = activePanel === "dashboard";
  const averageDuration = metrics.completedRuns
    ? metrics.totalDurationMs / metrics.completedRuns
    : 0;
  const recentRuns = metrics.recentDurations.length;

  const stats: StatCard[] = [
    {
      label: "Totaal laden",
      value: <AnimatedNumber value={metrics.totalRuns} />,
      icon: <span aria-hidden="true">↯</span>,
    },
    {
      label: "Gem. tijd",
      value: metrics.completedRuns ? (
        <AnimatedNumber
          value={averageDuration / 1000}
          format="decimal"
          suffix="s"
        />
      ) : (
        "—"
      ),
      icon: <span aria-hidden="true">◷</span>,
    },
    {
      label: "Succespercentage",
      value: metrics.totalRuns ? (
        <AnimatedNumber
          value={(metrics.completedRuns / metrics.totalRuns) * 100}
          format="percent"
          suffix="%"
        />
      ) : (
        "—"
      ),
      icon: <span aria-hidden="true">✓</span>,
    },
    {
      label: "Recente runs",
      value: <AnimatedNumber value={recentRuns} />,
      icon: <span aria-hidden="true">↗</span>,
    },
  ];

  const chartData = metrics.recentDurations.length
    ? metrics.recentDurations.map((duration) =>
        Math.min(
          100,
          Math.max(12, 100 - (duration / Math.max(1, averageDuration)) * 35),
        ),
      )
    : [20, 20, 20, 20, 20, 20];

  const handleOpen = () => {
    if (isOpen) {
      closePanel();
      return;
    }

    openPanel("dashboard");
    addToast("Dashboard geopend", "info");
  };

  return (
    <div className="relative">
      <IconButton
        label="Dashboard"
        active={isOpen}
        aria-expanded={isOpen}
        aria-controls="dashboard-panel"
        onClick={handleOpen}
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
      </IconButton>

      <DialogPanel
        id="dashboard-panel"
        titleId="dashboard-title"
        open={isOpen}
        onClose={closePanel}
        className="sm:w-120 sm:max-w-[calc(100vw-2rem)]"
      >
        <div className="flex items-center justify-between border-b border-white/10 bg-white/10 px-4 py-3 sm:px-6 sm:py-4">
          <div>
            <h2
              id="dashboard-title"
              className="text-base font-semibold text-white sm:text-lg"
            >
              Dashboard
            </h2>
            <p className="mt-1 text-xs text-white/60">
              Live data uit je loading-sessies
            </p>
          </div>
          <IconButton
            label="Sluiten"
            className="p-1.5 sm:p-2"
            onClick={closePanel}
          >
            <span className="text-xl leading-none" aria-hidden="true">
              ×
            </span>
          </IconButton>
        </div>

        <div className="max-h-[calc(100dvh-10rem)] overflow-y-auto p-3 sm:max-h-[calc(100dvh-12rem)] sm:p-6">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 sm:p-4"
              >
                <div className="mb-3 flex items-center gap-2 text-white/75 sm:gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm sm:h-10 sm:w-10">
                    {stat.icon}
                  </div>
                  <span className="text-xs text-white/60">{stat.label}</span>
                </div>
                <span className="text-xl font-bold text-white sm:text-2xl">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:mt-6 sm:p-4">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-white/80">
                Recente sessies
              </span>
              <span className="text-xs text-white/60">{recentRuns} runs</span>
            </div>
            <div className="flex h-24 items-end gap-1.5 sm:h-28">
              {chartData.map((value, index) => (
                <div
                  key={`${value}-${index}`}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                >
                  <div
                    className="w-full rounded-t bg-linear-to-t from-cyan-500 to-violet-400 transition hover:from-cyan-300 hover:to-violet-300"
                    style={{ height: `${value}%` }}
                    title={`Sessie ${index + 1}`}
                  />
                  <span className="text-[10px] text-white/50">{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogPanel>
    </div>
  );
};

export default Dashboard;
