import React from 'react';
import { BookOpen, Leaf, Sun, Wind, Droplets } from 'lucide-react';

export default function GuidesPage() {
  return (
    <div className="min-h-screen pt-32 px-6 pb-20 max-w-7xl mx-auto">
      <header className="mb-12 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">Ayurvedic Wisdom</h1>
        <p className="text-emerald-accent/60 text-lg">Ancient guides for modern living, dosha balancing, and natural weight management.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        <div className="bg-moss/20 border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
          <Wind className="absolute -right-10 -top-10 w-48 h-48 text-emerald-accent/5" />
          <h2 className="text-3xl font-display font-bold text-cream mb-4 relative z-10">Vata Diet & Lifestyle</h2>
          <p className="text-emerald-accent/70 mb-6 relative z-10">For those with dominant Air & Space elements.</p>
          <ul className="space-y-4 relative z-10 text-cream/80 text-sm">
            <li className="flex items-start gap-3"><div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-accent" /> Favor warm, cooked, and grounding foods like root vegetables and healthy fats.</li>
            <li className="flex items-start gap-3"><div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-accent" /> Avoid cold, raw salads and iced drinks which can increase anxiety and dryness.</li>
            <li className="flex items-start gap-3"><div className="w-2 h-2 mt-1.5 rounded-full bg-emerald-accent" /> Engage in slow, grounding exercises like restorative Yoga and Tai Chi.</li>
          </ul>
        </div>
        
        <div className="bg-moss/20 border border-white/5 p-8 md:p-12 rounded-[40px] shadow-2xl relative overflow-hidden">
          <Sun className="absolute -right-10 -top-10 w-48 h-48 text-rose-400/5" />
          <h2 className="text-3xl font-display font-bold text-cream mb-4 relative z-10">Pitta Diet & Lifestyle</h2>
          <p className="text-emerald-accent/70 mb-6 relative z-10">For those with dominant Fire & Water elements.</p>
          <ul className="space-y-4 relative z-10 text-cream/80 text-sm">
            <li className="flex items-start gap-3"><div className="w-2 h-2 mt-1.5 rounded-full bg-rose-400" /> Favor cooling, sweet, and bitter foods like cucumber, mint, and fresh dairy.</li>
            <li className="flex items-start gap-3"><div className="w-2 h-2 mt-1.5 rounded-full bg-rose-400" /> Avoid spicy, sour, and fermented foods which can increase acidity and irritability.</li>
            <li className="flex items-start gap-3"><div className="w-2 h-2 mt-1.5 rounded-full bg-rose-400" /> Engage in swimming or moderate exercise in cooler environments.</li>
          </ul>
        </div>
      </div>

      <h2 className="text-3xl font-display font-bold text-center text-cream mb-8">Featured Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Natural Weight Loss", icon: <Leaf />, desc: "How to use Triphala and warm water to naturally detoxify." },
          { title: "Daily Routine (Dinacharya)", icon: <Sun />, desc: "The perfect Ayurvedic morning routine to align your circadian rhythm." },
          { title: "Digestive Fire (Agni)", icon: <Droplets />, desc: "Herbs and spices to ignite your metabolism and cure bloating." }
        ].map((g, i) => (
          <div key={i} className="bg-forest/50 border border-white/5 p-8 rounded-3xl hover:-translate-y-2 transition-transform cursor-pointer group">
            <div className="text-emerald-accent mb-6 bg-emerald-accent/10 w-12 h-12 flex items-center justify-center rounded-xl">{g.icon}</div>
            <h3 className="font-bold text-xl text-cream mb-2 group-hover:text-emerald-accent transition-colors">{g.title}</h3>
            <p className="text-sm text-emerald-accent/60 leading-relaxed">{g.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
