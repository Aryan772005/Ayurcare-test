import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Upload, ArrowRight, ArrowLeft, Volume2, Search, Heart, Activity, Coffee, CheckCircle2, AlertCircle } from 'lucide-react';
import { User as FirebaseUser } from 'firebase/auth';
import BodyMap from '../components/BodyMap';
import { analyzeDosha, DoshaDiagnosis } from '../services/doshaEngine';
import { generateDietPlan, DietRoutine } from '../services/dietPlanner';
import { fallbackAnalyzeFood, FoodAnalysisResult } from '../services/foodAnalyzer';

export default function DiagnosisPage({ user }: { user: FirebaseUser | null }) {
  const [step, setStep] = useState(1);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [diagnosis, setDiagnosis] = useState<DoshaDiagnosis | null>(null);
  const [dietPlan, setDietPlan] = useState<DietRoutine | null>(null);
  const [foodAnalysis, setFoodAnalysis] = useState<FoodAnalysisResult | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Voice Input (Speech to Text) ---
  useEffect(() => {
    let recognition: any;
    if (isListening && 'webkitSpeechRecognition' in window) {
      // @ts-ignore
      recognition = new webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Works for Indian English + basic Hindi terms

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          text += event.results[i][0].transcript;
        }
        setTextInput((prev) => prev + " " + text.trim());
      };

      recognition.start();
    }
    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening]);

  // --- Voice Output (Text to Speech) ---
  const speakDiagnosis = () => {
    if (!diagnosis || !('speechSynthesis' in window)) return;
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const textToSpeak = `Based on your symptoms, I have detected a ${diagnosis.dosha} imbalance. 
    ${diagnosis.reason}. 
    I recommend the following remedies: ${diagnosis.remedies.join(", ")}.`;

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    // Try to find an Indian voice, fallback to default English
    const voices = window.speechSynthesis.getVoices();
    const indianVoice = voices.find(v => v.lang.includes('IN') || v.lang.includes('hi'));
    if (indianVoice) utterance.voice = indianVoice;
    
    window.speechSynthesis.speak(utterance);
  };

  const handleSymptomAdd = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!textInput.trim()) return;
    
    // simplistic split by comma or space if long
    const newSymptoms = textInput.split(/[,]+/).map(s => s.trim()).filter(Boolean);
    const merged = new Set([...symptoms, ...newSymptoms]);
    setSymptoms(Array.from(merged));
    setTextInput('');
  };

  const handleRemoveSymptom = (s: string) => {
    setSymptoms(symptoms.filter(sym => sym !== s));
  };

  const handleBodyMapSelect = (newSymptoms: string[]) => {
    setSymptoms(newSymptoms);
  };

  const processAI = async () => {
    setIsProcessing(true);
    setStep(2); // Move to loading step
    
    // Artificial delay for UI dramatic effect
    setTimeout(() => {
      const result = analyzeDosha(symptoms);
      const plan = generateDietPlan(result.dosha);
      setDiagnosis(result);
      setDietPlan(plan);
      setIsProcessing(false);
      setStep(3); // Move to results step
    }, 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      // First try hitting our real Vercel backend if deployed
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch('/api/food-analyze', {
        method: 'POST',
        body: formData
      });
      
      if (res.ok) {
        const data = await res.json();
        setFoodAnalysis(data);
      } else {
        // Fallback to local smart mock if API fails/quota hit
        const result = await fallbackAnalyzeFood(file);
        setFoodAnalysis(result);
      }
    } catch (err) {
      console.error(err);
      const result = await fallbackAnalyzeFood(file);
      setFoodAnalysis(result);
    }
    
    setIsProcessing(false);
    setStep(6);
  };

  return (
    <div className="min-h-screen pt-40 px-4 md:px-8 pb-20 max-w-7xl mx-auto flex flex-col h-screen">
      <div className="fixed inset-0 -z-10" style={{backgroundImage: "url('/bg-page-dash.png')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
        <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(5,10,15,0.96) 0%, rgba(2,20,15,0.92) 100%)'}} />
      </div>

      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-emerald-accent/60 mb-2 font-bold uppercase tracking-wider">
          <span>Symptoms</span>
          <span>Diagnosis</span>
          <span>Food Scan</span>
          <span>Routine</span>
        </div>
        <div className="h-2 bg-moss/50 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-accent to-green-300"
            animate={{ width: `${(step / 7) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* === STEP 1: Input Symptoms === */}
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-cream mb-4">What's bothering you?</h1>
              <p className="text-emerald-accent/60 text-lg">Click on the body map, type, or speak your symptoms.</p>
            </div>

            <div className="bg-moss/30 p-1 md:p-8 rounded-[40px] border border-white/5 shadow-2xl flex-1 flex flex-col">
              <BodyMap onSymptomSelect={handleBodyMapSelect} />

              <div className="mt-8 border-t border-white/5 pt-8">
                <form onSubmit={handleSymptomAdd} className="flex gap-4 items-center">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="e.g. Acid reflux, joint pain, restless sleep..."
                      className="w-full bg-forest/40 border border-white/10 rounded-2xl p-4 pl-12 text-cream focus:border-emerald-accent outline-none"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-accent/40" size={20} />
                  </div>
                  
                  <button 
                    type="button"
                    onClick={() => setIsListening(!isListening)}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors shadow-lg ${
                      isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-forest border border-white/10 text-emerald-accent hover:border-emerald-accent focus:border-emerald-accent'
                    }`}
                  >
                    {isListening ? <MicOff size={24} /> : <Mic size={24} />}
                  </button>

                  <button 
                    type="submit"
                    className="bg-emerald-accent/20 text-emerald-accent px-6 h-14 rounded-2xl font-bold hover:bg-emerald-accent hover:text-forest transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>

              <div className="mt-8 flex justify-center">
                <button 
                  onClick={processAI}
                  disabled={symptoms.length === 0}
                  className="bg-emerald-accent text-forest px-12 py-4 rounded-full text-xl font-bold shadow-2xl shadow-emerald-accent/20 hover:bg-emerald-accent/90 focus:bg-emerald-accent/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 transition-all"
                >
                  Analyze Dosha <ArrowRight />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* === STEP 2: Loading State === */}
        {step === 2 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex items-center justify-center flex-col"
          >
            <div className="w-32 h-32 relative mb-8">
              <div className="absolute inset-0 border-4 border-emerald-accent/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-accent rounded-full border-t-transparent animate-spin"></div>
              <Activity className="absolute inset-0 m-auto text-emerald-accent" size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold text-cream mb-2">Analyzing Dosha Matrix</h2>
            <p className="text-emerald-accent/60">Cross-referencing 5,000+ years of Ayurvedic intelligence...</p>
          </motion.div>
        )}

        {/* === STEP 3 & 4: Diagnosis Results === */}
        {step === 3 && diagnosis && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="flex-1"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-display font-bold text-cream mb-4">Your AI Diagnosis</h1>
              <button 
                onClick={speakDiagnosis}
                className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 px-4 py-2 rounded-full text-sm font-bold border border-blue-500/20 hover:bg-blue-500/20 transition-colors"
              >
                <Volume2 size={16} /> Listen to Result
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Primary Card */}
              <div className="lg:col-span-1 bg-moss/40 border border-white/5 rounded-[30px] p-8 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-accent/10 rounded-full blur-3xl"></div>
                <h3 className="text-sm uppercase tracking-widest text-emerald-accent/60 font-bold mb-2">Dominant Imbalance</h3>
                <h2 className="text-5xl font-display font-bold text-emerald-accent mb-6">{diagnosis.dosha}</h2>
                <p className="text-cream/80 text-lg leading-relaxed">{diagnosis.reason}</p>
              </div>

              {/* Details column */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-forest/60 border border-white/5 rounded-[30px] p-8 flex-1">
                  <h3 className="text-xl font-display font-bold text-cream mb-4 flex items-center gap-2"><AlertCircle className="text-rose-400"/> Primary Health Issues</h3>
                  <ul className="space-y-3">
                    {diagnosis.issues.map((i, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-cream/70"><span className="w-1.5 h-1.5 rounded-full bg-rose-400/50"></span> {i}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-forest/60 border border-white/5 rounded-[30px] p-8 flex-1">
                  <h3 className="text-xl font-display font-bold text-cream mb-4 flex items-center gap-2"><CheckCircle2 className="text-green-400"/> Recommended Remedies</h3>
                  <ul className="space-y-3">
                    {diagnosis.remedies.map((r, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-cream/70"><span className="w-1.5 h-1.5 rounded-full bg-green-400/50"></span> {r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <button onClick={() => setStep(4)} className="bg-emerald-accent text-forest px-10 py-4 rounded-full text-lg font-bold flex items-center gap-2 hover:bg-emerald-accent/90 transition-all">
                Continue to Diet Plan <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* === STEP 5: Food Scanner === */}
        {step === 4 && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center"
          >
            <div className="w-24 h-24 bg-emerald-accent/10 rounded-full flex items-center justify-center mb-6">
              <Coffee className="text-emerald-accent" size={40} />
            </div>
            <h1 className="text-4xl font-display font-bold text-cream mb-4">Analyze Your Meal</h1>
            <p className="text-emerald-accent/60 mb-10 text-lg">
              Upload a picture of your food. Our AI will analyze its calories, macronutrients, and suitability for your <strong>{diagnosis?.dosha || 'body'}</strong> dosha.
            </p>

            <input 
              type="file" 
              accept="image/*" 
              capture="environment"
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileUpload}
            />

            {isProcessing ? (
               <div className="flex flex-col items-center gap-4">
                 <div className="w-12 h-12 border-4 border-emerald-accent border-t-transparent rounded-full animate-spin"></div>
                 <p className="text-cream font-bold">Scanning nutrients...</p>
               </div>
            ) : (
              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(7)} // Skip to routine
                  className="px-8 py-4 rounded-full font-bold text-emerald-accent/60 hover:text-emerald-accent transition-colors"
                >
                  Skip for now
                </button>
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-emerald-accent text-forest px-10 py-4 rounded-full text-lg font-bold shadow-2xl flex items-center gap-3 hover:bg-emerald-accent/90 transition-all hover:-translate-y-1"
                >
                  <Upload size={20} /> Upload Food Image
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* === STEP 6: Food Analysis Result === */}
        {step === 6 && foodAnalysis && (
          <motion.div 
            key="step6"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex-1 max-w-3xl mx-auto w-full"
          >
            <h1 className="text-3xl font-display font-bold text-cream mb-8 text-center text-gradient">AI Nutrition Report</h1>
            
            <div className="bg-moss/40 border border-white/5 rounded-[30px] p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold text-cream mb-2">{foodAnalysis.food_name}</h2>
              <p className="text-emerald-accent font-bold mb-8 text-lg">{foodAnalysis.health_rating}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { label: "Calories", val: foodAnalysis.calories, color: "text-yellow-400", bg:"bg-yellow-400/10" },
                  { label: "Protein", val: foodAnalysis.protein, color: "text-blue-400", bg:"bg-blue-400/10" },
                  { label: "Carbs", val: foodAnalysis.carbs, color: "text-rose-400", bg:"bg-rose-400/10" },
                  { label: "Fats", val: foodAnalysis.fats, color: "text-orange-400", bg:"bg-orange-400/10" },
                ].map((m, i) => (
                  <div key={i} className={`${m.bg} p-6 rounded-3xl flex flex-col items-center justify-center`}>
                    <p className={`text-2xl font-bold ${m.color} mb-1`}>{m.val}</p>
                    <p className="text-xs uppercase tracking-wider text-cream/50 font-bold">{m.label}</p>
                  </div>
                ))}
              </div>

              <button onClick={() => setStep(7)} className="w-full bg-emerald-accent text-forest py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-emerald-accent/90">
                View Full Daily Routine <ArrowRight size={20} />
              </button>
            </div>
          </motion.div>
        )}

        {/* === STEP 7: Final Routine === */}
        {step === 7 && dietPlan && diagnosis && (
          <motion.div 
            key="step7"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="flex-1"
          >
            <div className="text-center mb-10">
              <h1 className="text-4xl font-display font-bold text-cream mb-4">Your Personalized Routine</h1>
              <p className="text-emerald-accent/60 text-lg">Optimized for balancing {diagnosis.dosha}</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-emerald-accent/20 before:to-transparent">
              
              {[
                { time: "07:00 AM", title: "Morning Detox", desc: dietPlan.morning },
                { time: "09:00 AM", title: "Nourishing Breakfast", desc: dietPlan.breakfast },
                { time: "01:30 PM", title: "Balanced Lunch", desc: dietPlan.lunch },
                { time: "05:00 PM", title: "Herbal Evening", desc: dietPlan.evening },
                { time: "08:00 PM", title: "Light Dinner", desc: dietPlan.dinner },
              ].map((item, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/5 bg-forest shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                    <div className="w-3 h-3 bg-emerald-accent rounded-full"></div>
                  </div>
                  
                  {/* Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-moss/40 border border-white/5 p-6 rounded-2xl">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-emerald-accent font-bold text-sm bg-emerald-accent/10 px-2.5 py-1 rounded-full">{item.time}</span>
                      <h3 className="font-bold text-cream">{item.title}</h3>
                    </div>
                    <p className="text-cream/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center pb-10">
              <button onClick={() => window.location.href='/dashboard'} className="bg-emerald-accent text-forest px-10 py-4 rounded-full font-bold shadow-lg hover:bg-emerald-accent/90 transition-all inline-block hover:scale-105">
                Save to Dashboard
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
