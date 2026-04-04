import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin } from 'lucide-react';
import { Doctor } from '../data/doctors';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface DoctorCardProps {
  doctor: Doctor;
  user: FirebaseUser | null;
  onBookingSuccess: () => void;
}

export default function DoctorCard({ doctor, user, onBookingSuccess }: DoctorCardProps) {
  const [isBooking, setIsBooking] = useState(false);
  const [showSimulatedPayment, setShowSimulatedPayment] = useState(false);
  const [problem, setProblem] = useState('');
  const [date, setDate] = useState('');

  const initiateBooking = () => {
    if (!user) {
      alert("Please login to book a consultation.");
      return;
    }
    setIsBooking(true);
  };

  const handleSimulatedPayment = async () => {
    if (!problem || !date) {
      alert("Please fill in the problem and prefered date");
      return;
    }
    
    // Simulate Razorpay payment popup delay
    setShowSimulatedPayment(true);
    
    setTimeout(async () => {
      try {
        await addDoc(collection(db, 'appointments'), {
          userId: user?.uid,
          name: user?.displayName,
          doctorId: doctor.id,
          doctorName: doctor.name,
          problem,
          preferredDate: date,
          amountPaid: 1, // INR 1
          status: "Paid & Confirmed",
          createdAt: new Date().toISOString()
        });
        
        setShowSimulatedPayment(false);
        setIsBooking(false);
        setProblem('');
        setDate('');
        onBookingSuccess();
      } catch (err) {
        console.error("Booking failed:", err);
        alert("Booking failed. Try again.");
        setShowSimulatedPayment(false);
      }
    }, 2000); // simulate 2s processing
  };

  return (
    <div className="bg-moss/40 border border-white/5 rounded-3xl overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1 hover:border-emerald-accent/20">
      <div className="h-48 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-t from-forest to-transparent z-10" />
        <img 
          src={doctor.imageUrl} 
          alt={doctor.name} 
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute bottom-4 left-4 z-20">
          <div className="flex items-center gap-1 bg-forest/80 backdrop-blur-md px-2 py-1 rounded-full border border-white/10 text-xs font-bold text-cream">
            <Star className="text-emerald-accent" size={12} fill="currentColor" />
            {doctor.rating} <span className="opacity-60 font-normal">({doctor.reviews})</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-display font-bold text-cream mb-1 flex items-center gap-2">
          {doctor.name} <ShieldCheck className="text-blue-400" size={16} />
        </h3>
        <p className="text-emerald-accent font-medium text-sm mb-4">{doctor.specialization}</p>
        
        <div className="space-y-2 mb-6">
          <div className="flex items-center gap-2 text-xs text-emerald-accent/60">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-accent/50" /> {doctor.experience} Experience
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-accent/60">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-accent/50" /> {doctor.languages.join(", ")}
          </div>
        </div>
        
        <p className="text-sm text-cream/70 line-clamp-3 mb-6 leading-relaxed">
          {doctor.about}
        </p>
        
        {!isBooking ? (
          <button 
            onClick={initiateBooking}
            className="w-full bg-emerald-accent/10 text-emerald-accent border border-emerald-accent/20 py-3 rounded-xl font-bold hover:bg-emerald-accent hover:text-forest transition-colors"
          >
            Consult for ₹1
          </button>
        ) : (
          <div className="space-y-3 bg-forest/50 p-4 rounded-xl border border-white/5">
            <p className="text-xs font-bold text-emerald-accent">Consultation Request</p>
            <input 
              type="text" 
              placeholder="Primary health concern..." 
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              className="w-full p-2 bg-moss/50 rounded-lg text-sm text-cream border border-white/5 focus:border-emerald-accent focus:outline-none"
            />
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 bg-moss/50 rounded-lg text-sm text-cream border border-white/5 focus:border-emerald-accent focus:outline-none"
            />
            
            {showSimulatedPayment ? (
              <div className="w-full bg-emerald-accent text-forest py-2 rounded-xl font-bold text-center text-sm animate-pulse opacity-80">
                Processing ₹1 Payment...
              </div>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={() => setIsBooking(false)}
                  className="w-1/3 border border-white/10 text-cream/70 py-2 rounded-xl font-bold text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSimulatedPayment}
                  className="w-2/3 bg-emerald-accent text-forest py-2 rounded-xl font-bold text-sm hover:bg-emerald-accent/90 transition-colors"
                >
                  Pay ₹1 & Book
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
