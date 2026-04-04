import React from 'react';
import { Leaf, Sun, Wind, Droplets, BookOpen, Flame, Moon, Cookie } from 'lucide-react';
import { motion } from 'framer-motion';

export default function GuidesPage() {
  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-7xl mx-auto">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">Ayurvedic Wisdom</h1>
        <p className="text-emerald-accent/60 text-lg">Ancient guides for modern living — dosha balancing, natural weight management, and holistic healing.</p>
      </header>

      {/* Dosha Guides */}
      <h2 className="text-3xl font-display font-bold text-cream mb-8 text-center">Know Your Dosha</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-moss/20 border border-white/5 p-8  rounded-[40px] shadow-2xl relative overflow-hidden">
          <Wind className="absolute -right-6 -top-6 w-32 h-32 text-blue-400/5" />
          <div className="w-12 h-12 bg-blue-400/10 rounded-2xl flex items-center justify-center mb-4"><Wind className="text-blue-400" /></div>
          <h3 className="text-2xl font-display font-bold text-cream mb-2">Vata</h3>
          <p className="text-xs text-blue-400 font-bold mb-4">Air & Space Element</p>
          <ul className="space-y-3 text-cream/70 text-sm">
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Favor warm, cooked, grounding foods — root vegetables, soups, ghee</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Avoid cold, raw salads and iced drinks</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Practice restorative Yoga and meditation</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Key herbs: Ashwagandha, Shatavari, Bala</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-blue-400 shrink-0" /> Maintain a regular sleep schedule</li>
          </ul>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-moss/20 border border-white/5 p-8  rounded-[40px] shadow-2xl relative overflow-hidden">
          <Sun className="absolute -right-6 -top-6 w-32 h-32 text-rose-400/5" />
          <div className="w-12 h-12 bg-rose-400/10 rounded-2xl flex items-center justify-center mb-4"><Sun className="text-rose-400" /></div>
          <h3 className="text-2xl font-display font-bold text-cream mb-2">Pitta</h3>
          <p className="text-xs text-rose-400 font-bold mb-4">Fire & Water Element</p>
          <ul className="space-y-3 text-cream/70 text-sm">
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Favor cooling, sweet, and bitter foods — cucumber, mint, coconut water</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Avoid spicy, sour, and fermented foods</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Swimming and moderate exercise in cool environments</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Key herbs: Brahmi, Amalaki, Neem</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-rose-400 shrink-0" /> Practice Shitali pranayama (cooling breath)</li>
          </ul>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-moss/20 border border-white/5 p-8  rounded-[40px] shadow-2xl relative overflow-hidden">
          <Droplets className="absolute -right-6 -top-6 w-32 h-32 text-emerald-accent/5" />
          <div className="w-12 h-12 bg-emerald-accent/10 rounded-2xl flex items-center justify-center mb-4"><Droplets className="text-emerald-accent" /></div>
          <h3 className="text-2xl font-display font-bold text-cream mb-2">Kapha</h3>
          <p className="text-xs text-emerald-accent font-bold mb-4">Earth & Water Element</p>
          <ul className="space-y-3 text-cream/70 text-sm">
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Favor light, warm, stimulating foods — ginger, pepper, leafy greens</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Avoid heavy, oily, and sweet foods</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Engage in vigorous exercise — running, cycling</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Key herbs: Trikatu, Guggulu, Punarnava</li>
            <li className="flex items-start gap-2"><div className="w-1.5 h-1.5 mt-1.5 rounded-full bg-emerald-accent shrink-0" /> Wake before sunrise for optimal energy</li>
          </ul>
        </motion.div>
      </div>

      {/* Weight Loss Guide */}
      <div className="bg-moss/30 border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl mb-16">
        <h2 className="text-3xl font-display font-bold text-cream mb-6 flex items-center gap-3"><Flame className="text-orange-400" /> Ayurvedic Weight Loss Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-accent text-lg">Morning Routine</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li>☀️ Wake up before 6 AM (Brahma Muhurta)</li>
              <li>🍵 Drink warm water with lemon & honey on an empty stomach</li>
              <li>🧘 Practice 15 min of Surya Namaskar (Sun Salutation)</li>
              <li>🌿 Take 1 tsp Triphala powder before breakfast</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-accent text-lg">Diet Tips</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li>🍽️ Eat your largest meal at lunch when Agni (digestive fire) is strongest</li>
              <li>🚫 Avoid eating after 7 PM to allow proper digestion</li>
              <li>🫚 Add ginger, cumin, and turmeric to every meal</li>
              <li>💧 Drink warm water throughout the day, avoid cold beverages</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-accent text-lg">Exercise</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li>🏃 30 min brisk walk daily after dinner</li>
              <li>🧘 Kapalbhati Pranayama (10 min) to boost metabolism</li>
              <li>💪 Strength training 3x per week</li>
              <li>🛌 Get 7-8 hours of quality sleep</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="font-bold text-emerald-accent text-lg">Herbal Remedies</h3>
            <ul className="space-y-3 text-cream/70 text-sm">
              <li>🌿 Triphala: Natural detox and weight management</li>
              <li>🫚 Guggulu: Boosts thyroid and fat metabolism</li>
              <li>🍃 Garcinia Cambogia: Controls appetite naturally</li>
              <li>🫖 Green tea with Tulsi: Antioxidant fat burner</li>
            </ul>
          </div>
        </div>
      </div>

      {/* More Guides */}
      <h2 className="text-3xl font-display font-bold text-center text-cream mb-8">Essential Health Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {[
          { title: "Dinacharya", subtitle: "Daily Routine", icon: <Sun />, desc: "The perfect Ayurvedic morning-to-night routine: oil pulling, tongue scraping, self-massage (Abhyanga), and meditation." },
          { title: "Ritucharya", subtitle: "Seasonal Living", icon: <Moon />, desc: "Adapt your diet and lifestyle with each season to maintain dosha balance and prevent seasonal illnesses." },
          { title: "Agni & Digestion", subtitle: "Digestive Fire", icon: <Flame />, desc: "Strengthen your Agni with ginger, cumin and fennel teas. Avoid incompatible food combinations (Viruddha Ahara)." },
          { title: "Panchakarma", subtitle: "Detox Therapy", icon: <Droplets />, desc: "The 5-step Ayurvedic detoxification process: Vamana, Virechana, Basti, Nasya, and Raktamokshana." },
          { title: "Yoga & Pranayama", subtitle: "Breath & Movement", icon: <Wind />, desc: "Specific asanas and breathing techniques for each dosha type to balance energy and improve flexibility." },
          { title: "Sattvic Diet", subtitle: "Pure Eating", icon: <Cookie />, desc: "Embrace whole, fresh, and natural foods. Reduce Rajasic (stimulating) and Tamasic (dulling) foods for mental clarity." },
        ].map((g, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="bg-forest/50 border border-white/5 p-8 rounded-3xl hover:-translate-y-2 transition-transform cursor-default group"
          >
            <div className="text-emerald-accent mb-2 bg-emerald-accent/10 w-12 h-12 flex items-center justify-center rounded-xl group-hover:scale-110 transition-transform">{g.icon}</div>
            <h3 className="font-bold text-xl text-cream mb-1 group-hover:text-emerald-accent transition-colors">{g.title}</h3>
            <p className="text-xs text-emerald-accent font-bold mb-3">{g.subtitle}</p>
            <p className="text-sm text-emerald-accent/60 leading-relaxed">{g.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
