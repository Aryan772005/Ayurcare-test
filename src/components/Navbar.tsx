import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Leaf, LogOut, Sun, Moon, Activity, Ribbon, Heart, Scale, 
  Shield, Coffee, ShoppingBag, Utensils, Sparkles, Menu, X, 
  ChevronDown, LayoutDashboard, Stethoscope, Wrench, BookOpen, MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, logout } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';
import LanguageSwitcher from './LanguageSwitcher';

interface NavbarProps {
  user: FirebaseUser | null;
  onLogin: () => void;
}

const TOPICS = [
  { id: 'liver',            label: 'Liver',          icon: Activity  },
  { id: 'cancer',           label: 'Cancer',         icon: Ribbon    },
  { id: 'sexual-wellness',  label: 'Sexual Wellness',icon: Heart     },
  { id: 'weight',           label: 'Weight Management',icon: Scale     },
  { id: 'immunity',         label: 'Immunity',       icon: Shield    },
  { id: 'hangover',         label: 'Hangover Fix',   icon: Coffee    },
];

export default function Navbar({ user, onLogin }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLightMode, setIsLightMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const savedMode = localStorage.getItem('theme');
    if (savedMode === 'dark') {
      setIsLightMode(false);
      document.body.classList.remove('light-mode');
    } else {
      setIsLightMode(true);
      document.body.classList.add('light-mode');
      if (!savedMode) localStorage.setItem('theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark');
      setIsLightMode(false);
    } else {
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light');
      setIsLightMode(true);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  const NavLink = ({ to, children, icon: Icon, highlight = false }: any) => (
    <Link 
      to={to} 
      className={`flex items-center gap-1.5 transition-all ${
        isActive(to) 
          ? 'text-emerald-accent font-bold' 
          : highlight 
            ? 'text-emerald-accent hover:text-emerald-accent/80' 
            : 'text-cream/70 hover:text-emerald-accent'
      }`}
    >
      {Icon && <Icon size={14} className={isActive(to) ? 'animate-pulse' : ''} />}
      <span>{children}</span>
    </Link>
  );

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-forest/80 backdrop-blur-xl border-b border-white/5' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="bg-emerald-accent p-2 rounded-xl group-hover:scale-110 transition-transform shadow-lg shadow-emerald-accent/20">
              <Leaf className="text-forest w-5 h-5" />
            </div>
            <span className="text-2xl font-display font-bold text-gradient">Ayurcare+</span>
          </Link>

          {/* Desktop Nav - CLEAN & MINIMAL */}
          <div className="hidden lg:flex items-center gap-8 text-[13px] font-bold">
            <NavLink to="/dashboard" icon={LayoutDashboard}>Dashboard</NavLink>
            <NavLink to="/doctors" icon={Stethoscope}>Consult</NavLink>
            
            {/* The rest are hidden on desktop but accessible via Hamburger */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-accent/10 text-emerald-accent hover:bg-emerald-accent/20 transition-all border border-emerald-accent/20 font-bold uppercase tracking-widest text-[10px]"
            >
              <Menu size={16} /> All Tools
            </button>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
             <div className="hidden sm:block">
                <LanguageSwitcher />
             </div>
            
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-forest/40 border border-white/10 text-emerald-accent/80 hover:text-emerald-accent transition-colors flex items-center justify-center backdrop-blur-md"
            >
              {isLightMode ? <Moon size={18} /> : <Sun size={18} />}
            </button>

            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-white/10">
                <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border-2 border-emerald-accent/20" />
                <button onClick={handleLogout} className="text-cream/40 hover:text-rose-400 transition-colors">
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <button 
                onClick={onLogin} 
                className="hidden sm:block px-5 py-2.5 rounded-full bg-emerald-accent text-forest text-sm font-bold hover:bg-emerald-accent/90 transition-all shadow-lg shadow-emerald-accent/20"
              >
                Sign In
              </button>
            )}

            {/* Mobile Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 rounded-xl bg-forest/40 border border-white/10 text-cream flex items-center justify-center lg:hidden"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Sub-nav topics for desktop */}
        <div className="hidden lg:flex gap-8 mt-4 overflow-x-auto scrollbar-hide py-2 border-t border-white/5">
          {TOPICS.map(t => (
            <Link key={t.id} to={`/topic/${t.id}`} className="flex items-center gap-2 group shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <t.icon size={12} className="text-emerald-accent" />
              <span className="text-[10px] uppercase tracking-widest font-bold">{t.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[51]"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-72 bg-forest border-l border-white/10 z-[52] p-8 flex flex-col"
            >
              <div className="flex justify-between items-center mb-10">
                <span className="text-xl font-display font-bold text-gradient">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-cream/40"><X size={24} /></button>
              </div>

              <div className="flex flex-col gap-6">
                {[
                  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
                  { to: '/doctors', label: 'Consult Doctors', icon: Stethoscope },
                  { to: '/tools', label: 'Wellness Tools', icon: Wrench },
                  { to: '/diagnosis', label: 'AI Diagnosis', icon: Sparkles, highlight: true },
                  { to: '/health-coach', label: 'AI Health Coach', icon: Activity, highlight: true },
                  { to: '/shop', label: 'Ayurvedic Shop', icon: ShoppingBag },
                  { to: '/calorie-checker', label: 'Calorie Checker', icon: Utensils, highlight: true },
                  { to: '/guides', label: 'Health Guides', icon: BookOpen },
                  { to: '/chat', label: 'AI Chat Assistant', icon: MessageSquare },
                ].map((link, i) => (
                  <Link 
                    key={i} 
                    to={link.to} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 text-lg font-semibold ${link.highlight ? 'text-emerald-accent' : 'text-cream/60'}`}
                  >
                    <link.icon size={20} />
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="mt-auto pt-10">
                {!user && (
                   <button 
                    onClick={() => { onLogin(); setIsMobileMenuOpen(false); }}
                    className="w-full py-4 rounded-2xl bg-emerald-accent text-forest font-bold mb-4 shadow-lg shadow-emerald-accent/20"
                   >
                     Sign In Account
                   </button>
                )}
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
}
