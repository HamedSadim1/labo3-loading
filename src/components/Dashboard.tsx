import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const { addToast } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0]);

  const stats: StatCard[] = [
    {
      label: "Totaal Laden",
      value: "1,234",
      change: "+12.5%",
      trend: "up",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
    {
      label: "Gem. Tijd",
      value: "2.4s",
      change: "-8.2%",
      trend: "down",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Succes%",
      value: "99.8%",
      change: "+0.3%",
      trend: "up",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    {
      label: "Actief",
      value: "89",
      change: "+5.7%",
      trend: "up",
      icon: (
        <svg
          className="w-5 h-5 sm:w-6 sm:h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  const chartData = [65, 45, 75, 55, 80, 60, 90, 70, 85, 95, 75, 88];
  const months = [
    "Jan",
    "Feb",
    "Mrt",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Okt",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    if (isOpen) {
      const targetValues = [1234, 2.4, 99.8, 89];
      const duration = 1000;
      const steps = 30;
      const stepDuration = duration / steps;

      let step = 0;
      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);

        setAnimatedValues(
          targetValues.map((target) => {
            if (target >= 100) {
              return Math.round(target * eased);
            }
            return Math.round(target * eased * 10) / 10;
          }),
        );

        if (step >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const formatValue = (index: number, original: string) => {
    if (original.includes("s")) return `${animatedValues[index]}s`;
    if (original.includes("%")) return `${animatedValues[index]}%`;
    if (original.includes(",")) {
      return animatedValues[index].toLocaleString("nl-NL");
    }
    return animatedValues[index].toString();
  };

  const handleOpen = () => {
    setIsOpen(true);
    addToast("Dashboard geopend", "info");
  };

  return (
    <div className="relative">
      {/* Dashboard Toggle Button */}
      <button
        onClick={handleOpen}
        className="group relative p-2.5 sm:p-3 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
        aria-label="Dashboard"
        aria-expanded={isOpen}
      >
        <svg
          className="w-4 h-4 sm:w-5 sm:h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>

      {/* Dashboard Panel - responsive */}
      {isOpen && (
        <div className="absolute right-0 bottom-full mb-2 w-[calc(100vw-2rem)] sm:w-[480px] max-w-[480px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-white/10 border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-semibold text-white">
                Dashboard
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                aria-label="Sluiten"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Stats Grid - responsive */}
          <div className="p-3 sm:p-6 grid grid-cols-2 gap-2 sm:gap-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                  <div className="p-1.5 sm:p-2 rounded-lg bg-white/10 text-white/70">
                    {stat.icon}
                  </div>
                  <span className="text-[10px] sm:text-xs text-white/50">
                    {stat.label}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-lg sm:text-2xl font-bold text-white">
                    {formatValue(index, stat.value)}
                  </span>
                  <span
                    className={`text-[10px] sm:text-xs font-medium ${
                      stat.trend === "up" ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mini Chart */}
          <div className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <span className="text-xs sm:text-sm font-medium text-white/70">
                  Maandelijks Overzicht
                </span>
                <span className="text-[10px] sm:text-xs text-white/40">
                  2024
                </span>
              </div>
              <div className="flex items-end gap-0.5 sm:gap-1 h-16 sm:h-24">
                {chartData.map((value, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-0.5 sm:gap-1"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t transition-all duration-500 hover:from-blue-400 hover:to-purple-400"
                      style={{ height: `${value}%` }}
                      title={`${months[index]}: ${value}%`}
                    />
                    <span className="text-[6px] sm:text-[8px] text-white/40">
                      {months[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-white/10 px-4 sm:px-6 py-2 sm:py-3">
            <p className="text-[10px] sm:text-xs text-white/40 text-center">
              Laatst bijgewerkt: {new Date().toLocaleTimeString("nl-NL")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
