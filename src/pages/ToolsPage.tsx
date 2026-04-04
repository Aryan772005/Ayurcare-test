import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Scale, Utensils, Activity } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from '../lib/firebase';
import { collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';

export default function ToolsPage({ user }: { user: FirebaseUser | null }) {
  const [activeTool, setActiveTool] = useState<'bmi' | 'calorie' | 'heart'>('bmi');

  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-7xl mx-auto">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">Wellness Tools</h1>
        <p className="text-emerald-accent/60 text-lg">Measure and monitor your doshas with our interactive calculators.</p>
      </header>

      <div className="flex justify-center gap-4 mb-12 flex-wrap">
        <ToolTab active={activeTool === 'bmi'} onClick={() => setActiveTool('bmi')} icon={<Scale />} label="BMI & Prakriti" />
        <ToolTab active={activeTool === 'calorie'} onClick={() => setActiveTool('calorie')} icon={<Utensils />} label="Calorie Check" />
        <ToolTab active={activeTool === 'heart'} onClick={() => setActiveTool('heart')} icon={<Heart />} label="Heart Monitor" />
      </div>

      <motion.div 
        key={activeTool}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto bg-moss/20 backdrop-blur-xl p-8 md:p-12 rounded-[40px] border border-white/5 shadow-2xl"
      >
        {activeTool === 'bmi' && <BMITool />}
        {activeTool === 'calorie' && <CalorieTool />}
        {activeTool === 'heart' && <HeartTool user={user} />}
      </motion.div>
    </div>
  );
}

function ToolTab({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
        active 
          ? 'bg-emerald-accent text-forest shadow-lg shadow-emerald-accent/20' 
          : 'bg-forest border border-white/10 text-emerald-accent/60 hover:text-emerald-accent hover:border-emerald-accent/30'
      }`}
    >
      {React.cloneElement(icon, { size: 18 })} {label}
    </button>
  );
}

function BMITool() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateBMI = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to m
    if (!w || !h) return;
    const bmi = w / (h * h);
    
    let dosha = "Vata (Air & Space)";
    let desc = "Slender build. You may experience dry skin and cold hands. Focus on warming, grounding foods.";
    if (bmi >= 18.5 && bmi < 25) {
      dosha = "Pitta (Fire & Water)";
      desc = "Medium build. You have strong digestion and metabolism. Focus on cooling, refreshing foods.";
    } else if (bmi >= 25) {
      dosha = "Kapha (Earth & Water)";
      desc = "Solid build. You have strong endurance but may sluggish digestion. Focus on light, stimulating foods.";
    }

    setResult({ val: bmi.toFixed(1), dosha, desc });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-cream font-bold">Ayurvedic BMI Calculator</h2>
      <p className="text-emerald-accent/60 text-sm mb-6">Discover your dominant dosha based on your body mass index.</p>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-emerald-accent/50 uppercase font-bold tracking-wider px-2">Weight (kg)</label>
          <input type="number" value={weight} onChange={e=>setWeight(e.target.value)} className="w-full mt-1 p-4 bg-forest/40 rounded-2xl border border-white/5 text-cream focus:border-emerald-accent" placeholder="e.g. 70" />
        </div>
        <div>
          <label className="text-xs text-emerald-accent/50 uppercase font-bold tracking-wider px-2">Height (cm)</label>
          <input type="number" value={height} onChange={e=>setHeight(e.target.value)} className="w-full mt-1 p-4 bg-forest/40 rounded-2xl border border-white/5 text-cream focus:border-emerald-accent" placeholder="e.g. 175" />
        </div>
      </div>
      
      <button onClick={calculateBMI} className="w-full bg-emerald-accent text-forest py-4 rounded-2xl font-bold mt-4">Calculate</button>

      {result && (
        <div className="mt-8 p-6 bg-emerald-accent/10 border border-emerald-accent/20 rounded-2xl animate-in fade-in zoom-in-95">
          <p className="text-4xl font-display font-bold text-center text-cream mb-2">{result.val}</p>
          <p className="text-center text-emerald-accent font-bold mb-4">Likely Dominant Dosha: {result.dosha}</p>
          <p className="text-sm text-cream/70 text-center leading-relaxed">{result.desc}</p>
        </div>
      )}
    </div>
  );
}

function CalorieTool() {
  // Simple mockup since we don't have a backend Indian food DB API
  const [food, setFood] = useState('');
  const [result, setResult] = useState<any>(null);

  const searchFood = () => {
    if (!food) return;
    const items = [
      { name: "Dal Makhani (1 bowl)", cal: 300, type: "Heavy (Kapha increasing)" },
      { name: "Chapati (1 piece)", cal: 70, type: "Balanced (Tridoshic)" },
      { name: "Palak Paneer (1 bowl)", cal: 280, type: "Cooling (Pitta pacifying)" },
      { name: "Khichdi (1 bowl)", cal: 200, type: "Healing (Tridoshic)" }
    ];
    
    // Exact or random match simulation
    const match = items.find(i => i.name.toLowerCase().includes(food.toLowerCase())) || items[Math.floor(Math.random()*items.length)];
    setResult(match);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-cream font-bold">Indian Food Calculator</h2>
      <p className="text-emerald-accent/60 text-sm mb-6">Check calories and Ayurvedic properties of your meals.</p>
      
      <div>
        <label className="text-xs text-emerald-accent/50 uppercase font-bold tracking-wider px-2">Search Food</label>
        <input type="text" value={food} onChange={e=>setFood(e.target.value)} className="w-full mt-1 p-4 bg-forest/40 rounded-2xl border border-white/5 text-cream focus:border-emerald-accent" placeholder="e.g. Dal Makhani, Khichdi" />
      </div>
      
      <button onClick={searchFood} className="w-full bg-emerald-accent text-forest py-4 rounded-2xl font-bold mt-4">Check Calories</button>

      {result && (
        <div className="mt-8 p-6 bg-emerald-accent/10 border border-emerald-accent/20 rounded-2xl flex justify-between items-center animate-in fade-in zoom-in-95">
          <div>
            <p className="font-bold text-cream text-lg mb-1">{result.name}</p>
            <p className="text-xs font-bold text-emerald-accent bg-emerald-accent/10 py-1 rounded inline-block">{result.type}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-display font-bold text-cream">{result.cal}</p>
            <p className="text-xs text-emerald-accent/60 uppercase tracking-widest">Kcal</p>
          </div>
        </div>
      )}
    </div>
  );
}

function HeartTool({ user }: { user: FirebaseUser | null }) {
  const [heartRate, setHeartRate] = useState('');
  const [saved, setSaved] = useState(false);

  const handleLogHeartRate = async () => {
    if (!heartRate || !user) {
      if(!user) alert("Please log in to save heart rate logs.");
      return;
    }
    try {
      const rate = Number(heartRate);
      let status = 'normal';
      if (rate < 60) status = 'low';
      if (rate > 100) status = 'high';

      await addDoc(collection(db, 'heart_logs'), {
        userId: user.uid,
        heartRate: rate,
        status,
        timestamp: new Date().toISOString()
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      setHeartRate('');
    } catch (err) {
      console.error("Heart rate logging failed:", err);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-cream font-bold">Log Heart Rate</h2>
      <p className="text-emerald-accent/60 text-sm mb-6">Track your pulse to monitor your Vata, Pitta, and Kapha balance.</p>
      
      <div className="relative mb-6">
        <input 
          type="number" 
          value={heartRate}
          onChange={(e) => setHeartRate(e.target.value)}
          placeholder="BPM"
          className="w-full text-6xl font-serif text-center py-10 bg-forest/40 rounded-3xl border border-white/5 focus:border-emerald-accent/50 text-cream outline-none"
        />
        <span className="absolute bottom-4 right-8 text-emerald-accent/20 font-bold">BPM</span>
      </div>

      <button onClick={handleLogHeartRate} className="w-full bg-rose-500 text-white py-4 rounded-2xl font-bold hover:bg-rose-600 transition-all">Save & Log</button>

      {saved && <p className="text-center text-emerald-accent text-sm font-bold mt-4">Saved successfully!</p>}
      <p className="text-center text-xs text-emerald-accent/40 mt-4">View your history in the Dashboard.</p>
    </div>
  );
}
