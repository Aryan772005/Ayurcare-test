import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as FirebaseUser } from 'firebase/auth';
import { 
  Shield, Activity, Brain, Zap, Heart, TrendingUp, Sparkles, 
  AlertTriangle, CheckCircle, Flame, Moon, ArrowRight, Clock 
} from 'lucide-react';
import { WellnessRing, MiniLineChart, RadarChart, HistoryChart } from '../components/dashboard/DashboardCharts';
import { useNavigate } from 'react-router-dom';
import '../components/dashboard/dashboard.css';

// ─── Sub-Components ───

const StatCard = ({ label, value, icon, color, variants, desc }: any) => (
  <motion.div 
    variants={variants}
    className="stat-widget group hover:border-emerald-accent/30 transition-all cursor-default"
  >
    <div className="flex items-center justify-between mb-2">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${color}-500/10`}>
        {React.cloneElement(icon, { size: 16, className: `text-${color}-400` })}
      </div>
      <span className="text-[10px] uppercase tracking-widest text-cream/30">{label}</span>
    </div>
    <p className="text-2xl font-bold text-cream underline-offset-4 group-hover:underline decoration-emerald-accent/30">{value}</p>
    <p className="text-[10px] text-emerald-accent/40 mt-1">{desc}</p>
  </motion.div>
);

// ─── Animated counter hook ───
function useCountUp(target: number, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const id = setInterval(() => {
      start += step;
      if (start >= target) {
        setVal(target);
        clearInterval(id);
      } else setVal(Math.round(start));
    }, 16);
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
];

export default function DashboardPage({ user }: { user: FirebaseUser | null }) {
  const navigate = useNavigate();
  const [anomalyState, setAnomalyState] = useState<'stable' | 'alert'>('stable');
  
  const wellnessScore = useCountUp(87);
  const heartRate = useCountUp(72);
  const calories = useCountUp(1840);
  const streak = useCountUp(14);
  const sleepScore = useCountUp(82);

  useEffect(() => {
    const id = setInterval(() => setAnomalyState(s => s === 'stable' ? 'alert' : 'stable'), 8000);
    return () => clearInterval(id);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" exit="hidden" variants={containerVariants}
      className="min-h-screen pb-20 px-6 max-w-[1440px] mx-auto"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 mt-6 gap-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-cream tracking-tight">
            Welcome, <span className="text-gradient">{user?.displayName ? user.displayName.split(' ')[0] : 'Guest'}</span>
          </h1>
          <p className="text-emerald-accent/50 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-accent animate-pulse" />
            {user ? 'Neural Analysis Active — Syncing Vitals' : 'Demo Mode — Sign in for Personalized Tracking'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-forest/40 border border-white/5 text-[11px] font-bold text-cream/60 backdrop-blur-md flex items-center gap-2 uppercase tracking-widest">
            <Clock size={14} className="text-emerald-accent" />
            {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
          </div>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-accent/20 to-emerald-accent/5 border border-emerald-accent/20 flex items-center justify-center text-cream font-bold overflow-hidden shadow-xl shadow-emerald-accent/5">
            {user?.photoURL ? <img src={user.photoURL} alt="" /> : <Activity size={20} className="text-emerald-accent" />}
          </div>
        </div>
      </motion.div>

      {/* Main Grid System */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Feature: AI Wellness Index */}
        <motion.div variants={itemVariants} className="lg:col-span-8 glass-card relative overflow-hidden group min-h-[340px] flex flex-col justify-center items-center">
            <div className="pulse-ring opacity-20" />
            <div className="pulse-ring opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-emerald-accent/5 to-transparent pointer-events-none" />
            
            <div className="relative z-10 flex flex-col items-center">
              <WellnessRing score={wellnessScore} size={200} />
              <div className="mt-6 text-center">
                 <h2 className="text-2xl font-display font-bold text-cream">AI Wellness Index</h2>
                 <p className="text-xs text-emerald-accent/60 mt-1 px-8">Real-time neural synthesis of your metabolic and Ayurvedic factors.</p>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <span className="smart-tag green py-1 px-4 text-[10px]">Optimal Range</span>
                <span className="text-[10px] text-cream/30 font-bold uppercase tracking-widest">+1.2% Trend</span>
              </div>
            </div>
        </motion.div>

        {/* Predictive Insights */}
        <motion.div variants={itemVariants} className="lg:col-span-4 glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-emerald-accent/10 flex items-center justify-center"><TrendingUp size={16} className="text-emerald-accent" /></div>
            <h3 className="text-sm font-bold text-cream uppercase tracking-widest">Predictive Forecast</h3>
          </div>
          
          <div className="space-y-8">
            <div className="relative">
              <div className="flex justify-between mb-2"><span className="text-xs text-cream/40">Immunity Strength</span><span className="text-xs text-emerald-accent font-bold">84%</span></div>
              <MiniLineChart data={immunityData} color="#10B981" height={70} />
            </div>
            <div className="relative">
              <div className="flex justify-between mb-2"><span className="text-xs text-cream/40">Metabolic Energy</span><span className="text-xs text-amber-400 font-bold">92%</span></div>
              <MiniLineChart data={energyData} color="#F59E0B" height={70} />
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="lg:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
           <StatCard label="Heart Rate" value={`${heartRate} BPM`} icon={<Heart />} color="rose" variants={itemVariants} desc="Vata Balanced" />
           <StatCard label="Burn" value={`${calories} kcal`} icon={<Flame />} color="orange" variants={itemVariants} desc="Pitta Active" />
           <StatCard label="Streak" value={`${streak} Days`} icon={<Zap />} color="emerald" variants={itemVariants} desc="Consistency" />
           <StatCard label="Sleep" value={`${sleepScore}/100`} icon={<Moon />} color="indigo" variants={itemVariants} desc="Deep REM" />
        </div>

        {/* Dosha Radar & Activity */}
        <motion.div variants={itemVariants} className="lg:col-span-4 glass-card p-6">
           <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center"><Brain size={16} className="text-amber-400" /></div>
            <h3 className="text-sm font-bold text-cream uppercase tracking-widest">Prakriti Hub</h3>
          </div>
          <div className="flex justify-center -mt-4">
            <RadarChart vata={45} pitta={72} kapha={32} />
          </div>
          <div className="space-y-2 mt-4">
             <p className="text-[10px] font-bold text-amber-400/80 uppercase tracking-widest mb-3">AI Suggestions</p>
             <div className="p-3 rounded-xl bg-forest/40 border border-white/5 flex items-center gap-3">
                <span className="text-xl">🌿</span>
                <span className="text-xs text-cream/70">Drink Warm Tulsi Tea for Pitta balance.</span>
             </div>
             <div className="p-3 rounded-xl bg-forest/40 border border-white/5 flex items-center gap-3">
                <span className="text-xl">🫚</span>
                <span className="text-xs text-cream/70">Morning ginger for Vata grounding.</span>
             </div>
          </div>
        </motion.div>

        {/* History Chart */}
        <motion.div variants={itemVariants} className="lg:col-span-8 glass-card p-6">
           <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-emerald-accent/10 flex items-center justify-center"><Activity size={16} className="text-emerald-accent" /></div>
                <h3 className="text-sm font-bold text-cream uppercase tracking-widest">30-Day Health Trend</h3>
              </div>
              <div className="smart-tag green text-[9px] uppercase tracking-tighter">Verified data</div>
           </div>
           <HistoryChart data={historyData} height={180} />
           <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/5">
              <div className="text-center"><p className="text-xs text-cream/30 uppercase tracking-widest mb-1">Peak</p><p className="text-xl font-bold text-cream">94%</p></div>
              <div className="text-center"><p className="text-xs text-cream/30 uppercase tracking-widest mb-1">Avg</p><p className="text-xl font-bold text-cream">78%</p></div>
              <div className="text-center"><p className="text-xs text-cream/30 uppercase tracking-widest mb-1">Growth</p><p className="text-xl font-bold text-emerald-accent">+12.4%</p></div>
           </div>
        </motion.div>

        {/* Anomaly & Activity Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-6 glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${anomalyState === 'alert' ? 'bg-red-500/10' : 'bg-emerald-accent/10'}`}>
               {anomalyState === 'alert' ? <AlertTriangle size={16} className="text-red-400" /> : <Shield size={16} className="text-emerald-accent" />}
            </div>
            <h3 className="text-sm font-bold text-cream uppercase tracking-widest">Neural Anomaly Scan</h3>
          </div>
          <AnimatePresence mode="wait">
             <motion.div 
               key={anomalyState}
               initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
               className="text-center py-8"
             >
                <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-5 border-2 ${anomalyState === 'alert' ? 'bg-red-500/5 border-red-500/20 pulse-red' : 'bg-emerald-accent/5 border-emerald-accent/20 breathe shadow-lg shadow-emerald-accent/10'}`}>
                   {anomalyState === 'alert' ? <ShieldAlert size={32} className="text-red-400" /> : <CheckCircle size={32} className="text-emerald-accent" />}
                </div>
                <h4 className={`text-xl font-display font-bold ${anomalyState === 'alert' ? 'text-red-400' : 'text-emerald-accent'}`}>
                  {anomalyState === 'alert' ? 'Anomaly Detected' : 'Vitals Stable'}
                </h4>
                <p className="text-xs text-cream/40 mt-2 max-w-[240px] mx-auto">
                   {anomalyState === 'alert' ? 'Irregular sleep cycle detected (REM shift).' : 'All biomarkers within standard Ayurvedic deviation.'}
                </p>
             </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* Activity Feed */}
        <motion.div variants={itemVariants} className="lg:col-span-6 glass-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center"><Sparkles size={16} className="text-violet-400" /></div>
            <h3 className="text-sm font-bold text-cream uppercase tracking-widest">Neural Log</h3>
          </div>
          <div className="space-y-4">
             {activityFeed.map((item, i) => (
                <div key={i} className="flex justify-between items-start pb-4 border-b border-white/3 last:border-0 last:pb-0">
                   <div className="flex gap-3">
                      <div className={`w-1 h-8 rounded-full ${item.tagColor === 'red' ? 'bg-red-400' : item.tagColor === 'gold' ? 'bg-amber-400' : 'bg-emerald-accent'}`} />
                      <div>
                         <p className="text-xs text-cream font-medium">{item.text}</p>
                         <p className="text-[10px] text-cream/20 mt-0.5">{item.time} — {item.tag}</p>
                      </div>
                   </div>
                   <ArrowRight size={12} className="text-cream/10 mt-1" />
                </div>
             ))}
          </div>
          <button 
            onClick={() => navigate('/health-coach')}
            className="w-full mt-6 py-4 rounded-xl bg-forest/40 border border-white/5 text-emerald-accent text-xs font-bold uppercase tracking-widest hover:bg-emerald-accent/10 transition-all flex items-center justify-center gap-2 group"
          >
            Launch AI Blueprint <Sparkles size={14} className="group-hover:animate-spin" />
          </button>
        </motion.div>

      </div>
    </motion.div>
  );
}

// Help sub-icons
const ShieldAlert = (props: any) => <Shield {...props} className={props.className + " text-red-400"} />;
