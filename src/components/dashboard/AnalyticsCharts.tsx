import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  unit?: string;
  label?: string;
}

/** Animated vertical bar chart */
export function BarChart({ data, height = 160, unit = '', label }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1);
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="w-full" style={{ minHeight: height + 40 }}>
      {label && <p className="text-[10px] text-cream/30 uppercase tracking-widest mb-4">{label}</p>}
      <div className="flex items-end gap-2 w-full" style={{ height }}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const barH = (pct / 100) * (height - 24);
          const color = d.color || '#10B981';
          return (
            <div
              key={i}
              className="flex flex-col items-center flex-1 group cursor-pointer"
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              {hovered === i && (
                <div
                  className="mb-1 px-2 py-1 rounded-lg text-[9px] font-bold text-cream whitespace-nowrap"
                  style={{ background: 'rgba(10,15,13,0.95)', border: `1px solid ${color}50` }}
                >
                  {unit}{d.value.toLocaleString()}
                </div>
              )}
              <div className="w-full flex items-end justify-center" style={{ height: height - 24 }}>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: barH }}
                  transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full max-w-[32px] rounded-t-lg relative overflow-hidden"
                  style={{
                    background: hovered === i
                      ? `linear-gradient(to top, ${color}, ${color}cc)`
                      : `linear-gradient(to top, ${color}aa, ${color}66)`,
                    boxShadow: hovered === i ? `0 0 14px ${color}44` : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(255,255,255,0.06), transparent)' }} />
                </motion.div>
              </div>
              <span className="text-[9px] text-cream/30 mt-2 font-medium">{d.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface MultiLineProps {
  datasets: { label: string; data: number[]; color: string }[];
  labels: string[];
  height?: number;
}

/** Multi-line chart for health metrics */
export function MultiLineChart({ datasets, labels, height = 180 }: MultiLineProps) {
  const allVals = datasets.flatMap(d => d.data);
  const max = Math.max(...allVals, 1);
  const min = Math.min(...allVals);
  const range = max - min || 1;
  const w = 560;
  const pad = 20;
  const [hovered, setHovered] = useState<{ setIdx: number; ptIdx: number } | null>(null);

  return (
    <div className="w-full relative">
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="overflow-visible">
        <defs>
          {datasets.map((ds, si) => (
            <linearGradient key={si} id={`mlg-${si}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={ds.color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={ds.color} stopOpacity="0" />
            </linearGradient>
          ))}
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map(lv => {
          const y = height - pad - (lv * (height - pad * 2));
          return <line key={lv} x1={0} y1={y} x2={w} y2={y} stroke="#ffffff08" strokeWidth="1" />;
        })}
        {datasets.map((ds, si) => {
          const pts = ds.data.map((v, i) => ({
            x: (i / (ds.data.length - 1)) * w,
            y: height - pad - ((v - min) / range) * (height - pad * 2),
          }));
          const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
          const area = `${line} L${w},${height - pad} L0,${height - pad} Z`;
          return (
            <g key={si}>
              <motion.path
                d={area}
                fill={`url(#mlg-${si})`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: si * 0.2 }}
              />
              <motion.path
                d={line}
                fill="none"
                stroke={ds.color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.4, delay: si * 0.2, ease: 'easeInOut' }}
              />
              {pts.map((p, pi) => (
                <g key={pi}
                  onMouseEnter={() => setHovered({ setIdx: si, ptIdx: pi })}
                  onMouseLeave={() => setHovered(null)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={p.x} cy={p.y}
                    r={hovered?.setIdx === si && hovered?.ptIdx === pi ? 5 : 2.5}
                    fill={ds.color}
                    stroke="#0a0f0d"
                    strokeWidth="1.5"
                    style={{ transition: 'r 0.2s' }}
                  />
                  {hovered?.setIdx === si && hovered?.ptIdx === pi && (
                    <>
                      <rect x={p.x - 28} y={p.y - 28} width="56" height="18" rx="4" fill="#0a0f0dee" stroke={ds.color} strokeWidth="0.5" />
                      <text x={p.x} y={p.y - 16} textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="Inter">
                        {ds.label}: {ds.data[pi]}
                      </text>
                    </>
                  )}
                </g>
              ))}
            </g>
          );
        })}
        {/* X labels */}
        {labels.map((lbl, i) => (
          <text
            key={i}
            x={(i / (labels.length - 1)) * w}
            y={height - 2}
            textAnchor="middle"
            fill="#ffffff30"
            fontSize="8"
            fontFamily="Inter"
          >
            {lbl}
          </text>
        ))}
      </svg>
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-3">
        {datasets.map((ds, si) => (
          <div key={si} className="flex items-center gap-1.5">
            <div className="w-3 h-[3px] rounded-full" style={{ background: ds.color }} />
            <span className="text-[10px] text-cream/40">{ds.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutProps {
  segments: { name: string; value: number; color: string; pct: number }[];
  size?: number;
}

/** Animated donut / pie chart */
export function DonutChart({ segments, size = 180 }: DonutProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;
  const innerR = r * 0.6;
  let cumulative = 0;

  const arcs = segments.map((seg, i) => {
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += seg.pct / 100;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);
    const largeArc = seg.pct > 50 ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
    return { ...seg, path, i };
  });

  const total = segments.reduce((s, x) => s + x.value, 0);
  const hov = hovered !== null ? segments[hovered] : null;

  return (
    <div className="flex gap-6 items-center flex-wrap">
      <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {arcs.map((arc) => (
            <motion.path
              key={arc.i}
              d={arc.path}
              fill={arc.color}
              stroke="#0a0f0d"
              strokeWidth="2"
              opacity={hovered === null || hovered === arc.i ? 1 : 0.4}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: hovered === null || hovered === arc.i ? 1 : 0.4, scale: hovered === arc.i ? 1.04 : 1 }}
              transition={{ duration: 0.3 }}
              style={{ cursor: 'pointer', transformOrigin: `${cx}px ${cy}px` }}
              onMouseEnter={() => setHovered(arc.i)}
              onMouseLeave={() => setHovered(null)}
            />
          ))}
          <circle cx={cx} cy={cy} r={innerR - 6} fill="#0a0f0d" />
          <text x={cx} y={cy - 6} textAnchor="middle" fill="#F8FAFC" fontSize="14" fontWeight="700" fontFamily="Inter">
            {hov ? `${hov.pct}%` : `₹${(total / 1000).toFixed(1)}k`}
          </text>
          <text x={cx} y={cy + 12} textAnchor="middle" fill="#ffffff50" fontSize="8" fontFamily="Inter">
            {hov ? hov.name : 'Total Spend'}
          </text>
        </svg>
      </div>
      <div className="flex flex-col gap-2.5 flex-1 min-w-[120px]">
        {segments.map((seg, i) => (
          <div
            key={i}
            className="flex items-center gap-2 cursor-pointer group"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: seg.color }} />
            <span className="text-[11px] text-cream/60 group-hover:text-cream/90 transition-colors">{seg.name}</span>
            <span className="text-[11px] font-bold ml-auto" style={{ color: seg.color }}>₹{seg.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SparklineProps {
  data: number[];
  color?: string;
  height?: number;
}

/** Simple compact sparkline for summary cards */
export function Sparkline({ data, color = '#10B981', height = 40 }: SparklineProps) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 100;
  const pts = data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: height - ((v - min) / range) * height * 0.8 - height * 0.1,
  }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${w},${height} L0,${height} Z`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spark-${color})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
