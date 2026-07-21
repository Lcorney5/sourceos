"use client";

import { useState } from "react";

const SERIES_COLORS = ["#3C5875", "#B23A11", "#8A6412"]; // steel, rust, amber — fixed order

export type LineSeries = {
  name: string;
  points: { x: string; y: number }[];
};

export function LineChart({
  title,
  series,
  valuePrefix = "",
}: {
  title: string;
  series: LineSeries[];
  valuePrefix?: string;
}) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const width = 640;
  const height = 220;
  const padding = { top: 12, right: 12, bottom: 24, left: 44 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const labels = series[0]?.points.map((p) => p.x) ?? [];
  const allValues = series.flatMap((s) => s.points.map((p) => p.y));
  const maxY = Math.max(...allValues, 1);
  const minY = 0;

  const xFor = (i: number) => padding.left + (labels.length <= 1 ? 0 : (i / (labels.length - 1)) * plotWidth);
  const yFor = (v: number) => padding.top + plotHeight - ((v - minY) / (maxY - minY || 1)) * plotHeight;

  const hasData = series.some((s) => s.points.length > 0) && labels.length > 0;

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-wider text-muted">{title}</p>
        {series.length > 1 && (
          <div className="flex items-center gap-3">
            {series.map((s, i) => (
              <span key={s.name} className="flex items-center gap-1.5 font-mono text-[0.6875rem] text-ink">
                <span
                  className="inline-block h-2 w-2"
                  style={{ backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length] }}
                />
                {s.name}
              </span>
            ))}
          </div>
        )}
      </div>
      {!hasData ? (
        <p className="font-mono text-xs text-muted">Not enough data yet.</p>
      ) : (
        <>
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full"
            onMouseLeave={() => setHoverIndex(null)}
          >
            {[0, 0.5, 1].map((t) => (
              <line
                key={t}
                x1={padding.left}
                x2={width - padding.right}
                y1={padding.top + plotHeight * t}
                y2={padding.top + plotHeight * t}
                stroke="#1B2430"
                strokeOpacity={0.12}
                strokeWidth={1}
              />
            ))}
            <text x={4} y={yFor(maxY) + 4} className="font-mono" fontSize={9} fill="#5B6570">
              {valuePrefix}
              {maxY.toFixed(0)}
            </text>
            <text x={4} y={yFor(0) + 4} className="font-mono" fontSize={9} fill="#5B6570">
              {valuePrefix}0
            </text>

            {series.map((s, si) => {
              const color = SERIES_COLORS[si % SERIES_COLORS.length];
              const d = s.points.map((p, i) => `${i === 0 ? "M" : "L"}${xFor(i)},${yFor(p.y)}`).join(" ");
              return (
                <g key={s.name}>
                  <path d={d} fill="none" stroke={color} strokeWidth={2} />
                  {s.points.map((p, i) => (
                    <circle key={i} cx={xFor(i)} cy={yFor(p.y)} r={3} fill={color} />
                  ))}
                </g>
              );
            })}

            {hoverIndex !== null && (
              <line
                x1={xFor(hoverIndex)}
                x2={xFor(hoverIndex)}
                y1={padding.top}
                y2={height - padding.bottom}
                stroke="#1B2430"
                strokeWidth={1}
                strokeDasharray="3,3"
              />
            )}

            {labels.map((label, i) => (
              <rect
                key={label}
                x={xFor(i) - plotWidth / Math.max(labels.length, 1) / 2}
                y={padding.top}
                width={plotWidth / Math.max(labels.length, 1)}
                height={plotHeight}
                fill="transparent"
                onMouseEnter={() => setHoverIndex(i)}
              />
            ))}

            {labels.map((label, i) => (
              <text
                key={label}
                x={xFor(i)}
                y={height - 6}
                textAnchor="middle"
                className="font-mono"
                fontSize={9}
                fill="#5B6570"
              >
                {label}
              </text>
            ))}
          </svg>
          {hoverIndex !== null && (
            <div className="mt-1 border border-ink bg-paper-card px-2 py-1 font-mono text-[0.6875rem]">
              <span className="text-muted">{labels[hoverIndex]}</span>
              {series.map((s, i) => (
                <span key={s.name} className="ml-3" style={{ color: SERIES_COLORS[i % SERIES_COLORS.length] }}>
                  {s.name}: {valuePrefix}
                  {s.points[hoverIndex]?.y.toFixed(2)}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
