import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth, loginWithGoogle } from './lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './lib/firebase';
import { Leaf } from 'lucide-react';
import { motion } from 'framer-motion';

// Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import DoctorsPage from './pages/DoctorsPage';
import ToolsPage from './pages/ToolsPage';
import GuidesPage from './pages/GuidesPage';
import ChatPage from './pages/ChatPage';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        try {
          await setDoc(doc(db, 'users', u.uid), {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            lastLogin: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.error("User sync failed:", err);
        }
      }
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error.message || error}`);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-forest text-cream">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
          <Leaf className="text-emerald-accent w-16 h-16" />
        </motion.div>
      </div>
    );
  }

  // Protected Route Wrapper
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!user) {
      alert("Please login first to access this page.");
      return <Navigate to="/" replace />;
    }
    return <>{children}</>;
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-forest text-cream font-sans selection:bg-emerald-accent/20">
        <Navbar user={user} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage onLogin={handleLogin} user={user} />} />
            <Route path="/doctors" element={<DoctorsPage user={user} />} />
            <Route path="/guides" element={<GuidesPage />} />
            <Route path="/tools" element={<ToolsPage user={user} />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage user={user!} />
              </ProtectedRoute>
            } />
            <Route path="/chat" element={
              <ProtectedRoute>
                <ChatPage user={user} />
              </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </BrowserRouter>
  );
}
