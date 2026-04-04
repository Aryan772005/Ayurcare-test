import React from 'react';
import { Leaf } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-moss/20 border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 opacity-50">
          <Leaf size={24} className="text-emerald-accent" />
          <span className="font-display font-bold text-xl text-cream">Ayurcare+</span>
        </div>
        
        <p className="text-sm text-emerald-accent/40 text-center md:text-left">
          &copy; {new Date().getFullYear()} Ayurcare+. Holistic wellness and ancient wisdom.
        </p>
        
        <div className="flex items-center gap-4 text-sm font-medium text-emerald-accent/60">
          <a href="#" className="hover:text-emerald-accent transition-colors">Privacy</a>
          <a href="#" className="hover:text-emerald-accent transition-colors">Terms</a>
          <a href="#" className="hover:text-emerald-accent transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
