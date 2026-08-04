import React from "react";
import AnimatedNumber from "@/components/AnimatedNumber";
import DialogPanel from "@/components/DialogPanel";
import PanelTrigger from "@/components/PanelTrigger";
import PanelHeader from "@/components/PanelHeader";
import { useApp } from "@/context/useApp";
import { usePanelToggle } from "@/hooks/usePanelToggle";
import PanelBody from "@/components/PanelBody";
import Icon from "@/components/Icon";
import { DASHBOARD_CONFIG, PANEL_CONFIG, UI_COPY } from "@/constants";
import DashboardStats, {
  type DashboardStat,
} from "@/components/DashboardStats";
import DashboardChart, {
  type DashboardChartPoint,
} from "@/components/DashboardChart";

const Dashboard: React.FC = () => {
  const panel = PANEL_CONFIG.dashboard;
  const { metrics } = useApp();
  const { isOpen, toggle, close } = usePanelToggle(panel.key);
  const averageDuration = metrics.completedRuns
    ? metrics.totalDurationMs / metrics.completedRuns
    : 0;
  const recentRuns = metrics.recentDurations.length;

  const stats: DashboardStat[] = [
    {
      label: DASHBOARD_CONFIG.copy.totalRuns,
      value: <AnimatedNumber value={metrics.totalRuns} />,
      icon: <Icon name="runs" className="h-5 w-5" />,
    },
    {
      label: DASHBOARD_CONFIG.copy.averageDuration,
      value: metrics.completedRuns ? (
        <AnimatedNumber
          value={averageDuration / DASHBOARD_CONFIG.durationDivisorMs}
          format="decimal"
          suffix={DASHBOARD_CONFIG.copy.durationSuffix}
        />
      ) : (
        DASHBOARD_CONFIG.copy.noValue
      ),
      icon: <Icon name="clock" className="h-5 w-5" />,
    },
    {
      label: DASHBOARD_CONFIG.copy.successRate,
      value: metrics.totalRuns ? (
        <AnimatedNumber
          value={
            (metrics.completedRuns / metrics.totalRuns) *
            DASHBOARD_CONFIG.percentageScale
          }
          format="percent"
          suffix={UI_COPY.percentSuffix}
        />
      ) : (
        DASHBOARD_CONFIG.copy.noValue
      ),
      icon: <Icon name="success" className="h-5 w-5" />,
    },
    {
      label: DASHBOARD_CONFIG.copy.recentRuns,
      value: <AnimatedNumber value={recentRuns} />,
      icon: <Icon name="recent" className="h-5 w-5" />,
    },
  ];

  const chartData: DashboardChartPoint[] = metrics.recentDurations.length
    ? metrics.recentDurations.map((duration, index) => ({
        duration,
        index,
        height: Math.min(
          DASHBOARD_CONFIG.chartMaxHeightPercent,
          Math.max(
            DASHBOARD_CONFIG.chartMinHeightPercent,
            DASHBOARD_CONFIG.chartMaxHeightPercent -
              (duration /
                Math.max(
                  DASHBOARD_CONFIG.minimumAverageDurationMs,
                  averageDuration,
                )) *
                DASHBOARD_CONFIG.chartScaleFactor,
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
