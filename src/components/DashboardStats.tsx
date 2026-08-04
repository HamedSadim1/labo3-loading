import React from "react";

export interface DashboardStat {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

interface DashboardStatsProps {
  stats: DashboardStat[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ stats }) => (
  <dl className="grid grid-cols-2 gap-3 sm:gap-4">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className="rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10 sm:p-4"
      >
        <div className="mb-3 flex items-center gap-2 text-white/75 sm:gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm sm:h-10 sm:w-10">
            {stat.icon}
          </div>
          <dt className="text-sm text-white/80">{stat.label}</dt>
        </div>
        <dd className="text-xl font-bold text-white sm:text-2xl">
          {stat.value}
        </dd>
      </div>
    ))}
  </dl>
);

export default DashboardStats;
