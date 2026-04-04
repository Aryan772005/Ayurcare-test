import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Calendar, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage({ onLogin, user }: { onLogin: () => void, user: any }) {
  return (
    <div className="min-h-screen bg-forest overflow-hidden relative pb-32">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-1/4 -left-1/4 w-full h-full bg-emerald-accent/10 rounded-full blur-[120px]" 
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-accent/10 text-emerald-accent text-sm font-bold mb-8 border border-emerald-accent/20"
          >
            <Sparkles size={16} /> Premium Holistic Wellness
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-display font-bold text-gradient leading-tight mb-8"
          >
            Ayurcare<span className="text-emerald-accent">+</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl mx-auto text-xl text-cream/70 mb-12 leading-relaxed"
          >
            Ancient wisdom meets modern intelligence. Consult with top Indian Ayurvedic doctors, track your vitals, and balance your life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            {user ? (
               <Link 
                to="/dashboard"
                className="bg-emerald-accent text-forest px-10 py-5 rounded-full text-xl font-bold shadow-2xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 hover:scale-105 transition-all inline-flex items-center gap-3"
              >
                Go to Dashboard <ChevronRight />
              </Link>
            ) : (
              <button 
                onClick={onLogin}
                className="bg-emerald-accent text-forest px-10 py-5 rounded-full text-xl font-bold shadow-2xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 hover:scale-105 transition-all flex items-center gap-3 mx-auto"
              >
                Get Started <ChevronRight />
              </button>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-6 py-20 relative z-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="bg-moss/40 backdrop-blur-xl p-12 rounded-[56px] border border-white/5 shadow-2xl hover:border-emerald-accent/30 transition-all hover:-translate-y-2 group">
            <Heart className="text-rose-400 w-12 h-12 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-display font-bold mb-4 text-cream">Vitals Tracker</h3>
            <p className="text-emerald-accent/60 leading-relaxed text-lg">Monitor heart rate, BMI, and calorie intake tailored to your specific Ayurvedic Dosha.</p>
          </div>
          <div className="bg-moss/40 backdrop-blur-xl p-12 rounded-[56px] border border-white/5 shadow-2xl hover:border-emerald-accent/30 transition-all hover:-translate-y-2 group">
            <Calendar className="text-emerald-accent w-12 h-12 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-display font-bold mb-4 text-cream">Expert Doctors</h3>
            <p className="text-emerald-accent/60 leading-relaxed text-lg">Book 1-on-1 consultations with verified Indian Ayurvedic physicians for just ₹1.</p>
          </div>
          <div className="bg-moss/40 backdrop-blur-xl p-12 rounded-[56px] border border-white/5 shadow-2xl hover:border-emerald-accent/30 transition-all hover:-translate-y-2 group">
            <Sparkles className="text-blue-400 w-12 h-12 mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-3xl font-display font-bold mb-4 text-cream">AI Assistant</h3>
            <p className="text-emerald-accent/60 leading-relaxed text-lg">Chat with our advanced AI to analyze symptoms and generate personalized diet plans.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
