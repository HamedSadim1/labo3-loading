import React from "react";
import AnimatedNumber from "./AnimatedNumber";
import DialogPanel from "./DialogPanel";
import PanelTrigger from "./PanelTrigger";
import PanelHeader from "./PanelHeader";
import { useApp } from "../context/useApp";
import { usePanelToggle } from "../hooks/usePanelToggle";
import PanelBody from "./PanelBody";
import Icon from "./Icon";
import { PANEL_IDS, PANEL_KEYS } from "../constants/panels";
import DashboardStats, { type DashboardStat } from "./DashboardStats";
import DashboardChart, { type DashboardChartPoint } from "./DashboardChart";

const CHART_MIN_HEIGHT_PERCENT = 12;
const CHART_SCALE_FACTOR = 35;

const Dashboard: React.FC = () => {
  const panel = PANEL_IDS.dashboard;
  const { metrics } = useApp();
  const { isOpen, toggle, close } = usePanelToggle(PANEL_KEYS.dashboard);
  const averageDuration = metrics.completedRuns
    ? metrics.totalDurationMs / metrics.completedRuns
    : 0;
  const recentRuns = metrics.recentDurations.length;

  const stats: DashboardStat[] = [
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

  const chartData: DashboardChartPoint[] = metrics.recentDurations.length
    ? metrics.recentDurations.map((duration, index) => ({
        duration,
        index,
        height: Math.min(
          100,
          Math.max(
            CHART_MIN_HEIGHT_PERCENT,
            100 -
              (duration / Math.max(1, averageDuration)) * CHART_SCALE_FACTOR,
          ),
        ),
      }))
    : [];

  return (
    <div className="relative">
      <PanelTrigger
        label={panel.label}
        controls={panel.panel}
        isOpen={isOpen}
        onToggle={toggle}
      >
        <Icon name="dashboard" className="h-4 w-4 sm:h-5 sm:w-5" />
      </PanelTrigger>

      <DialogPanel
        id={panel.panel}
        titleId={panel.title}
        open={isOpen}
        onClose={close}
        className="sm:w-120 sm:max-w-[calc(100vw-2rem)]"
      >
        <PanelHeader
          title={panel.heading}
          titleId={panel.title}
          subtitle={panel.subtitle}
          onClose={close}
        />

        <PanelBody className="max-h-[calc(100dvh_-_10rem)] p-3 sm:max-h-[calc(100dvh_-_12rem)] sm:p-6">
          <DashboardStats stats={stats} />
          <DashboardChart chartData={chartData} recentRuns={recentRuns} />
        </PanelBody>
      </DialogPanel>
    </div>
  );
};

export default Dashboard;
