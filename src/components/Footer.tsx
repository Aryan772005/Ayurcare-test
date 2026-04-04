import React from 'react';
import { Leaf, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-moss/20 border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <Leaf size={24} className="text-emerald-accent" />
          <span className="font-display font-bold text-xl text-cream">Ayurcare+</span>
        </div>
        
        <div className="text-center md:text-left">
          <p className="text-sm text-emerald-accent/40">
            &copy; {new Date().getFullYear()} Ayurcare+. Holistic wellness and ancient wisdom.
          </p>
          <p className="text-xs text-emerald-accent/30 flex items-center justify-center md:justify-start gap-1 mt-1">
            <MapPin size={12} /> Desh Bhagat University, Mandi Govindgarh
          </p>
        </div>
        
        <div className="flex items-center gap-4 text-sm font-medium text-emerald-accent/60">
          <a href="#" className="hover:text-emerald-accent transition-colors">Privacy</a>
          <a href="#" className="hover:text-emerald-accent transition-colors">Terms</a>
          <a href="#" className="hover:text-emerald-accent transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
