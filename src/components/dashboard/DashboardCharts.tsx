import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';

/* ─── Mini Line Chart (Predictive Insights) ─── */
export function MiniLineChart({ data, color = '#10B981', height = 120, label }: { data: number[]; color?: string; height?: number; label?: string }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 280;
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: height - ((v - min) / range) * (height - 20) - 10 }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${w},${height} L0,${height} Z`;
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#grad-${label})`} />
      <path d={line} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <animate attributeName="stroke-dashoffset" from="600" to="0" dur="1.5s" fill="freeze" />
        <animate attributeName="stroke-dasharray" from="600" to="600" dur="0.01s" fill="freeze" />
      </path>
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)} style={{ cursor: 'pointer' }}>
          <circle cx={p.x} cy={p.y} r={hovered === i ? 6 : 3} fill={color} opacity={hovered === i ? 1 : 0.7} style={{ transition: 'all 0.2s' }} />
          {hovered === i && (
            <>
              <rect x={p.x - 20} y={p.y - 26} width="40" height="18" rx="4" fill="#0a0f0d" stroke={color} strokeWidth="0.5" opacity="0.95" />
              <text x={p.x} y={p.y - 14} textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="Inter">{data[i]}</text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ─── Radar / Spider Chart (Prakriti Dosha) ─── */
export function RadarChart({ vata, pitta, kapha }: { vata: number; pitta: number; kapha: number }) {
  const cx = 120, cy = 110, r = 80;
  const angles = [-90, 150, 30].map(a => (a * Math.PI) / 180);
  const values = [vata / 100, pitta / 100, kapha / 100];
  const points = values.map((v, i) => ({
    x: cx + Math.cos(angles[i]) * r * v,
    y: cy + Math.sin(angles[i]) * r * v,
  }));
  const labels = ['Vata', 'Pitta', 'Kapha'];
  const colors = ['#60A5FA', '#F59E0B', '#10B981'];
  const gridLevels = [0.25, 0.5, 0.75, 1];

  return (
    <svg width="240" height="220" viewBox="0 0 240 220" className="mx-auto">
      <defs>
        <radialGradient id="radarGlow">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </radialGradient>
        <filter id="radarBlur"><feGaussianBlur stdDeviation="3" /></filter>
      </defs>
      <circle cx={cx} cy={cy} r={r + 10} fill="url(#radarGlow)" />
      {gridLevels.map(lv => (
        <polygon key={lv} points={angles.map(a => `${cx + Math.cos(a) * r * lv},${cy + Math.sin(a) * r * lv}`).join(' ')}
          fill="none" stroke="#10B98120" strokeWidth="0.5" />
      ))}
      {angles.map((a, i) => (
        <line key={i} x1={cx} y1={cy} x2={cx + Math.cos(a) * r} y2={cy + Math.sin(a) * r} stroke="#10B98130" strokeWidth="0.5" />
      ))}
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="#10B98118" stroke="#10B981" strokeWidth="1.5" filter="url(#radarBlur)" />
      <polygon points={points.map(p => `${p.x},${p.y}`).join(' ')} fill="#10B98115" stroke="#10B981" strokeWidth="1.5" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4" fill={colors[i]} stroke="#0a0f0d" strokeWidth="1.5" />
      ))}
      {angles.map((a, i) => (
        <text key={i} x={cx + Math.cos(a) * (r + 22)} y={cy + Math.sin(a) * (r + 22)} textAnchor="middle" fill={colors[i]}
          fontSize="10" fontWeight="600" fontFamily="Inter" dominantBaseline="middle">
          {labels[i]} {[vata, pitta, kapha][i]}%
        </text>
      ))}
    </svg>
  );
}

/* ─── Historical Trend Chart (30-day) ─── */
export function HistoryChart({ data, height = 160 }: { data: number[]; height?: number }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 560;
  const pts = data.map((v, i) => ({ x: (i / (data.length - 1)) * w, y: height - ((v - min) / range) * (height - 30) - 15 }));
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = `${line} L${w},${height} L0,${height} Z`;
  const [hov, setHov] = useState<number | null>(null);

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id="histGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map(lv => (
        <line key={lv} x1="0" y1={height - lv * (height - 30) - 15} x2={w} y2={height - lv * (height - 30) - 15} stroke="#ffffff08" />
      ))}
      <path d={area} fill="url(#histGrad)" />
      <path d={line} fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" />
      {pts.map((p, i) => (
        <g key={i} onMouseEnter={() => setHov(i)} onMouseLeave={() => setHov(null)} style={{ cursor: 'pointer' }}>
          <circle cx={p.x} cy={p.y} r={hov === i ? 5 : 0} fill="#10B981" style={{ transition: 'r 0.2s' }} />
          {hov === i && (
            <>
              <line x1={p.x} y1={0} x2={p.x} y2={height} stroke="#10B98140" strokeWidth="0.5" strokeDasharray="3 3" />
              <rect x={p.x - 28} y={p.y - 28} width="56" height="20" rx="4" fill="#0a0f0dee" stroke="#10B98150" strokeWidth="0.5" />
              <text x={p.x} y={p.y - 15} textAnchor="middle" fill="#F8FAFC" fontSize="9" fontFamily="Inter">Day {i + 1}: {data[i]}</text>
            </>
          )}
        </g>
      ))}
      <text x="0" y={height - 2} fill="#ffffff30" fontSize="8" fontFamily="Inter">Day 1</text>
      <text x={w} y={height - 2} textAnchor="end" fill="#ffffff30" fontSize="8" fontFamily="Inter">Day 30</text>
    </svg>
  );
}

/* ─── Circular Progress Ring (Wellness Index) ─── */
export function WellnessRing({ score, size = 180 }: { score: number; size?: number }) {
  const r = size / 2 - 16;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="50%" stopColor="#34D399" />
            <stop offset="100%" stopColor="#6EE7B7" />
          </linearGradient>
          <filter id="ringGlow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#ffffff08" strokeWidth="8" />
        <motion.circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="url(#ringGrad)" strokeWidth="8"
          strokeLinecap="round" strokeDasharray={circ} initial={{ strokeDashoffset: circ }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 2, ease: 'easeOut' }} filter="url(#ringGlow)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-bold text-gradient font-display">{score}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-emerald-accent/50 mt-1">Wellness Index</span>
      </div>
    </div>
  );
}
