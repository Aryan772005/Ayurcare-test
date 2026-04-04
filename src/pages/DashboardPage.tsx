import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as FirebaseUser } from 'firebase/auth';
import { Shield, Activity, Brain, Zap, Heart, TrendingUp, Sparkles, AlertTriangle, CheckCircle, Leaf, Flame, Wind, Droplets, ArrowRight, Clock, Sun, Moon } from 'lucide-react';
import { WellnessRing, MiniLineChart, RadarChart, HistoryChart } from '../components/dashboard/DashboardCharts';
import '../components/dashboard/dashboard.css';

// ─── Animated counter hook ───
function useCountUp(target: number, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0; const step = target / (duration / 16);
    const id = setInterval(() => { start += step; if (start >= target) { setVal(target); clearInterval(id); } else setVal(Math.round(start)); }, 16);
    return () => clearInterval(id);
  }, [target]);
  return val;
}

// ─── Mock Data ───
const immunityData = [72, 74, 71, 76, 78, 75, 80];
const energyData = [65, 68, 62, 70, 73, 69, 75];
const historyData = Array.from({ length: 30 }, (_, i) => 60 + Math.round(Math.sin(i / 4) * 15 + Math.random() * 10));
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const activityFeed = [
  { time: '2m ago', text: 'AI detected elevated Pitta dosha levels', tag: 'Dosha', tagColor: 'gold' as const },
  { time: '15m ago', text: 'Heart rate returned to optimal range', tag: 'Vital', tagColor: 'green' as const },
  { time: '1h ago', text: 'Recommended Ashwagandha for stress reduction', tag: 'Herb', tagColor: 'green' as const },
  { time: '2h ago', text: 'Calorie intake below target by 320 kcal', tag: 'Alert', tagColor: 'red' as const },
  { time: '3h ago', text: 'Morning yoga session completed +12 wellness pts', tag: 'Activity', tagColor: 'blue' as const },
  { time: '5h ago', text: 'Sleep quality score: 82/100 — good', tag: 'Sleep', tagColor: 'green' as const },
];

export default function DashboardPage({ user }: { user: FirebaseUser }) {
  const [anomalyState, setAnomalyState] = useState<'stable' | 'alert'>('stable');
  const wellnessScore = useCountUp(87);
  const heartRate = useCountUp(72);
  const calories = useCountUp(1840);
  const streak = useCountUp(14);
  const sleepScore = useCountUp(82);

  // Toggle anomaly state for demo
  useEffect(() => {
    const id = setInterval(() => setAnomalyState(s => s === 'stable' ? 'alert' : 'stable'), 8000);
    return () => clearInterval(id);
  }, []);

  const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

  return (
    <div className="min-h-screen pt-28 pb-20 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="ambient-glow" style={{ top: '10%', left: '5%', background: '#10B981' }} />
      <div className="ambient-glow" style={{ top: '50%', right: '5%', background: '#F59E0B', opacity: 0.06 }} />
      <div className="ambient-glow" style={{ bottom: '10%', left: '40%', background: '#10B981', opacity: 0.08 }} />

      {/* Header */}
      <motion.div {...fadeUp} className="max-w-[1440px] mx-auto px-6 mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-cream">
              AI Wellness Command Center
            </h1>
            <p className="text-emerald-accent/50 text-sm mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse" />
              Neural analysis active — Real-time monitoring
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-full bg-moss/40 border border-white/5 text-xs text-cream/60 backdrop-blur-md flex items-center gap-2">
              <Clock size={12} className="text-emerald-accent" />
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/5 border border-emerald-accent/20 flex items-center justify-center text-cream font-bold text-sm">
              {user.displayName?.charAt(0) || 'U'}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Quick Stats Row ─── */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="dash-grid mb-5">
        <div className="stats-row">
          {[
            { icon: Heart, label: 'Heart Rate', value: `${heartRate} BPM`, color: '#F87171', desc: 'Optimal range' },
            { icon: Flame, label: 'Calories', value: `${calories} kcal`, color: '#FBBF24', desc: 'Consumed today' },
            { icon: Zap, label: 'Day Streak', value: `${streak} days`, color: '#10B981', desc: 'Consistency score' },
            { icon: Moon, label: 'Sleep Score', value: `${sleepScore}/100`, color: '#818CF8', desc: 'Last night' },
          ].map((s, i) => (
            <motion.div key={i} className="stat-widget group" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }}>
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${s.color}12` }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <span className="text-[10px] uppercase tracking-widest text-cream/30">{s.label}</span>
              </div>
              <p className="text-2xl font-bold text-cream count-num">{s.value}</p>
              <p className="text-[10px] text-emerald-accent/40 mt-1">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ─── Main Bento Grid ─── */}
      <div className="dash-grid">

        {/* ─── 1. AI Wellness Index (Hero) ─── */}
        <motion.div className="glass-card hero-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.6 }}>
          <div className="pulse-ring" />
          <div className="pulse-ring" />
          <div className="pulse-ring" />
          {/* Pulse wave SVG */}
          <svg className="absolute top-0 left-0 w-full h-full opacity-[0.06]" viewBox="0 0 400 300" preserveAspectRatio="none">
            <path d="M0,150 Q50,100 100,150 T200,150 T300,150 T400,150" fill="none" stroke="#10B981" strokeWidth="1.5">
              <animate attributeName="d" dur="4s" repeatCount="indefinite"
                values="M0,150 Q50,100 100,150 T200,150 T300,150 T400,150;M0,150 Q50,200 100,150 T200,150 T300,150 T400,150;M0,150 Q50,100 100,150 T200,150 T300,150 T400,150" />
            </path>
            <path d="M0,160 Q80,120 160,160 T320,160 T400,160" fill="none" stroke="#34D399" strokeWidth="1">
              <animate attributeName="d" dur="5s" repeatCount="indefinite"
                values="M0,160 Q80,120 160,160 T320,160 T400,160;M0,160 Q80,190 160,160 T320,160 T400,160;M0,160 Q80,120 160,160 T320,160 T400,160" />
            </path>
          </svg>
          <div className="relative z-10 flex flex-col items-center">
            <WellnessRing score={wellnessScore} size={190} />
            <h2 className="text-lg font-display font-bold text-cream mt-4">AI Wellness Index</h2>
            <p className="text-xs text-emerald-accent/50 mt-1 text-center max-w-[240px]">
              Deep learning analysis across 12 biomarkers — updated in real-time
            </p>
            <div className="flex items-center gap-2 mt-4">
              <span className="smart-tag green">Optimal</span>
              <span className="text-[10px] text-cream/30">↑ 3.2% from last week</span>
            </div>
          </div>
        </motion.div>

        {/* ─── 2. Predictive Insights ─── */}
        <motion.div className="glass-card predict-card" {...fadeUp} transition={{ delay: 0.3 }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-emerald-accent/10 flex items-center justify-center"><TrendingUp size={14} className="text-emerald-accent" /></div>
            <h3 className="text-sm font-bold text-cream">Predictive Insights</h3>
          </div>
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cream/50">Immunity Forecast</span>
              <span className="text-xs text-emerald-accent font-semibold">+8%</span>
            </div>
            <MiniLineChart data={immunityData} color="#10B981" height={80} label="immunity" />
            <div className="flex justify-between mt-1">{days.map(d => <span key={d} className="text-[8px] text-cream/20">{d}</span>)}</div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-cream/50">Energy Levels</span>
              <span className="text-xs font-semibold" style={{ color: '#FBBF24' }}>+5%</span>
            </div>
            <MiniLineChart data={energyData} color="#FBBF24" height={80} label="energy" />
            <div className="flex justify-between mt-1">{days.map(d => <span key={d} className="text-[8px] text-cream/20">{d}</span>)}</div>
          </div>
        </motion.div>

        {/* ─── 3. Prakriti Analysis (Dosha Radar) ─── */}
        <motion.div className="glass-card prakriti-card" {...fadeUp} transition={{ delay: 0.35 }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center"><Brain size={14} className="text-amber-400" /></div>
            <h3 className="text-sm font-bold text-cream">Prakriti Analysis</h3>
          </div>
          <RadarChart vata={45} pitta={72} kapha={38} />
          <div className="mt-3 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-amber-400/70 font-bold">AI Recommendations</p>
            {[
              { herb: 'Tulsi', reason: 'Balance elevated Pitta', icon: '🌿' },
              { herb: 'Ashwagandha', reason: 'Stress & Vata support', icon: '🫚' },
              { herb: 'Triphala', reason: 'Digestive harmony', icon: '🍃' },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-forest/40 border border-white/3">
                <span className="text-sm">{r.icon}</span>
                <div>
                  <p className="text-xs font-semibold text-cream">{r.herb}</p>
                  <p className="text-[9px] text-cream/30">{r.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ─── 4. Anomaly Detection ─── */}
        <motion.div className={`glass-card anomaly-card ${anomalyState === 'alert' ? 'alert alert-pulse' : 'stable'}`} {...fadeUp} transition={{ delay: 0.4 }}>
          <div className="flex items-center gap-2 mb-4">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${anomalyState === 'alert' ? 'bg-red-500/10' : 'bg-emerald-accent/10'}`}>
              {anomalyState === 'alert' ? <AlertTriangle size={14} className="text-red-400" /> : <Shield size={14} className="text-emerald-accent" />}
            </div>
            <h3 className="text-sm font-bold text-cream">Anomaly Detection</h3>
          </div>
          <AnimatePresence mode="wait">
            {anomalyState === 'alert' ? (
              <motion.div key="alert" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-red-500/10 flex items-center justify-center mb-3 border border-red-500/20">
                  <AlertTriangle size={28} className="text-red-400" />
                </div>
                <p className="text-lg font-bold text-red-400 font-display">Anomalies Detected</p>
                <p className="text-xs text-cream/40 mt-2 max-w-[200px] mx-auto">Irregular heart rate pattern — BPM spike at 14:30</p>
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="smart-tag red">2 Alerts</span>
                  <span className="smart-tag gold">1 Warning</span>
                </div>
              </motion.div>
            ) : (
              <motion.div key="stable" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="text-center py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-accent/10 flex items-center justify-center mb-3 border border-emerald-accent/20 breathe">
                  <CheckCircle size={28} className="text-emerald-accent" />
                </div>
                <p className="text-lg font-bold text-emerald-accent font-display">System Stable</p>
                <p className="text-xs text-cream/40 mt-2 max-w-[200px] mx-auto">All vitals within healthy parameters. Neural scan complete.</p>
                <div className="mt-4">
                  <span className="smart-tag green breathe">All Clear</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* ─── 5. Historical Health Trends ─── */}
        <motion.div className="glass-card history-card" {...fadeUp} transition={{ delay: 0.45 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-accent/10 flex items-center justify-center"><Activity size={14} className="text-emerald-accent" /></div>
              <h3 className="text-sm font-bold text-cream">30-Day Health Trends</h3>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-cream/30">
              <span className="w-2 h-2 rounded-full bg-emerald-accent" /> Vital Score
            </div>
          </div>
          <HistoryChart data={historyData} height={160} />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3">
              <div className="text-center"><p className="text-lg font-bold text-cream count-num">{Math.max(...historyData)}</p><p className="text-[9px] text-cream/30">Peak</p></div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-center"><p className="text-lg font-bold text-cream count-num">{Math.round(historyData.reduce((a, b) => a + b) / historyData.length)}</p><p className="text-[9px] text-cream/30">Average</p></div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-center"><p className="text-lg font-bold text-emerald-accent count-num">+12%</p><p className="text-[9px] text-cream/30">Trend</p></div>
            </div>
          </div>
        </motion.div>

        {/* ─── 6. AI Activity Feed ─── */}
        <motion.div className="glass-card feed-card" {...fadeUp} transition={{ delay: 0.5 }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center"><Sparkles size={14} className="text-violet-400" /></div>
            <h3 className="text-sm font-bold text-cream">AI Activity Feed</h3>
          </div>
          {activityFeed.map((item, i) => (
            <motion.div key={i} className="feed-item" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.55 + i * 0.06 }}>
              <div className="flex items-center justify-between mb-1">
                <span className={`smart-tag ${item.tagColor}`}>{item.tag}</span>
                <span className="text-[9px] text-cream/20">{item.time}</span>
              </div>
              <p className="text-xs text-cream/60">{item.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
