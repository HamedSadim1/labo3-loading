import React from "react";
import AnimatedNumber from "./AnimatedNumber";
import DialogPanel from "./DialogPanel";
import PanelTrigger from "./PanelTrigger";
import PanelHeader from "./PanelHeader";
import { useApp } from "../context/useApp";
import { usePanelToggle } from "../hooks/usePanelToggle";
import PanelBody from "./PanelBody";
import Icon from "./Icon";

interface StatCard {
  label: string;
  value: React.ReactNode;
  icon: React.ReactNode;
}

const Dashboard: React.FC = () => {
  const { metrics } = useApp();
  const { isOpen, toggle, close } = usePanelToggle("dashboard");
  const averageDuration = metrics.completedRuns
    ? metrics.totalDurationMs / metrics.completedRuns
    : 0;
  const recentRuns = metrics.recentDurations.length;

  const stats: StatCard[] = [
    {
      label: "Totaal laden",
      value: <AnimatedNumber value={metrics.totalRuns} />,
      icon: <Icon name="runs" className="h-5 w-5" />,
    },
    {
      label: "Gemiddelde tijd",
      value: metrics.completedRuns ? (
        <AnimatedNumber
          value={averageDuration / 1000}
          format="decimal"
          suffix="s"
        />
      ) : (
        "—"
      ),
      icon: <Icon name="clock" className="h-5 w-5" />,
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
      icon: <Icon name="success" className="h-5 w-5" />,
    },
    {
      label: "Recente runs",
      value: <AnimatedNumber value={recentRuns} />,
      icon: <Icon name="recent" className="h-5 w-5" />,
    },
  ];

  const chartData = metrics.recentDurations.length
    ? metrics.recentDurations.map((duration, index) => ({
        duration,
        index,
        height: Math.min(
          100,
          Math.max(12, 100 - (duration / Math.max(1, averageDuration)) * 35),
        ),
      }))
    : [];

  return (
    <div className="relative">
      <PanelTrigger
        label="Dashboard"
        controls="dashboard-panel"
        isOpen={isOpen}
        onToggle={toggle}
      >
        <Icon name="dashboard" className="h-4 w-4 sm:h-5 sm:w-5" />
      </PanelTrigger>

      <DialogPanel
        id="dashboard-panel"
        titleId="dashboard-title"
        open={isOpen}
        onClose={close}
        className="sm:w-120 sm:max-w-[calc(100vw-2rem)]"
      >
        <PanelHeader
          title="Dashboard"
          titleId="dashboard-title"
          subtitle="Live gegevens uit je laadsessies"
          onClose={close}
        />

        <PanelBody className="max-h-[calc(100dvh_-_10rem)] p-3 sm:max-h-[calc(100dvh_-_12rem)] sm:p-6">
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

          <figure className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:mt-6 sm:p-4">
            <div className="mb-4 flex items-center justify-between">
              <figcaption className="text-sm font-medium text-white/85">
                Recente sessies
              </figcaption>
              <span className="text-sm text-white/75">{recentRuns} runs</span>
            </div>
            {chartData.length ? (
              <>
                <div
                  className="flex h-24 items-end gap-1.5 sm:h-28"
                  aria-hidden="true"
                >
                  {chartData.map(({ height, index }) => (
                    <div
                      key={`${index}-${height}`}
                      className="flex h-full flex-1 flex-col items-center justify-end gap-1"
                    >
                      <div
                        className="w-full rounded-t bg-linear-to-t from-cyan-500 to-violet-400 transition hover:from-cyan-300 hover:to-violet-300"
                        style={{ height: `${height}%` }}
                      />
                      <span className="text-xs text-white/75">{index + 1}</span>
                    </div>
                  ))}
                </div>
                <table className="sr-only">
                  <caption>Laadtijd per recente sessie</caption>
                  <thead>
                    <tr>
                      <th scope="col">Sessie</th>
                      <th scope="col">Duur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map(({ duration, index }) => (
                      <tr key={`table-${index}`}>
                        <th scope="row">{index + 1}</th>
                        <td>{(duration / 1000).toFixed(1)} seconden</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p className="text-sm text-white/75">
                Nog geen sessies geregistreerd.
              </p>
            )}
          </figure>
        </PanelBody>
      </DialogPanel>
    </div>
  );
};

export default Dashboard;
