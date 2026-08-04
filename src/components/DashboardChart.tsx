import React from "react";

export interface DashboardChartPoint {
  duration: number;
  index: number;
  height: number;
}

interface DashboardChartProps {
  chartData: DashboardChartPoint[];
  recentRuns: number;
}

const DashboardChart: React.FC<DashboardChartProps> = ({
  chartData,
  recentRuns,
}) => (
  <figure className="mt-4 rounded-xl border border-white/10 bg-white/5 p-3 sm:mt-6 sm:p-4">
    <div className="mb-4 flex items-center justify-between">
      <figcaption className="text-sm font-medium text-white/85">
        Recente sessies
      </figcaption>
      <span className="text-sm text-white/75">{recentRuns} runs</span>
    </div>
    {chartData.length ? (
      <>
        <div className="flex h-24 items-end gap-1.5 sm:h-28" aria-hidden="true">
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
      <p className="text-sm text-white/75">Nog geen sessies geregistreerd.</p>
    )}
  </figure>
);

export default DashboardChart;
