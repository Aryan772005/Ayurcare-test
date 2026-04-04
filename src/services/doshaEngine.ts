export interface DoshaDiagnosis {
  dosha: 'Vata' | 'Pitta' | 'Kapha' | 'Vata-Pitta' | 'Pitta-Kapha' | 'Vata-Kapha' | 'Balanced';
  reason: string;
  issues: string[];
  remedies: string[];
}

const SYMPTOM_MAP = {
  vata: [
    'anxiety', 'insomnia', 'dry', 'joint pain', 'bloating', 'cold', 'constipation', 'dizziness', 
    'headache', 'gas', 'tremors', 'weight loss', 'irregular', 'restless', 'forgetful'
  ],
  pitta: [
    'acidity', 'heartburn', 'anger', 'rash', 'inflammation', 'thirst', 'sweat', 'fever', 
    'migraine', 'ulcer', 'irritability', 'diarrhea', 'bleeding', 'hungry', 'hot'
  ],
  kapha: [
    'weight gain', 'lethargy', 'congestion', 'mucus', 'slow digestion', 'depression', 
    'cough', 'asthma', 'swelling', 'nausea', 'sluggish', 'tired', 'oily', 'attachment'
  ]
};

const DIAGNOSIS_DATA = {
  Vata: {
    issues: ['Nervous system imbalance', 'Digestive irregularity', 'Tissue depletion'],
    remedies: ['Ashwagandha for nervous system', 'Warm sesame oil massage (Abhyanga)', 'Triphala for digestion', 'Establish a strict daily routine']
  },
  Pitta: {
    issues: ['Inflammation', 'Metabolic overactivity', 'Acid imbalance'],
    remedies: ['Aloe vera juice on empty stomach', 'Amalaki or Brahmi', 'Coconut oil massage', 'Practice cooling pranayama (Sheetali)']
  },
  Kapha: {
    issues: ['Fluid retention', 'Sluggish metabolism', 'Respiratory congestion'],
    remedies: ['Ginger tea before meals', 'Vigorous daily exercise', 'Dry brushing (Garshana)', 'Triphala or Trikatu for metabolism']
  }
};

export const analyzeDosha = (inputSymptoms: string[]): DoshaDiagnosis => {
  if (inputSymptoms.length === 0) {
    return {
      dosha: 'Balanced',
      reason: 'No critical symptoms provided. Keep maintaining your health!',
      issues: ['None detected'],
      remedies: ['Maintain current routine', 'Stay hydrated']
    };
  }

  let scores = { Vata: 0, Pitta: 0, Kapha: 0 };
  const allText = inputSymptoms.join(' ').toLowerCase();

  // Score doshas based on keywords
  SYMPTOM_MAP.vata.forEach(kw => { if (allText.includes(kw)) scores.Vata++; });
  SYMPTOM_MAP.pitta.forEach(kw => { if (allText.includes(kw)) scores.Pitta++; });
  SYMPTOM_MAP.kapha.forEach(kw => { if (allText.includes(kw)) scores.Kapha++; });

  // Find the primary dosha
  let maxScore = Math.max(scores.Vata, scores.Pitta, scores.Kapha);
  
  if (maxScore === 0) {
    // Fallback if no exact keywords matched
    return {
      dosha: 'Vata',
      reason: 'Based on subtle cues, your air/space elements need balancing.',
      ...DIAGNOSIS_DATA['Vata']
    };
  }

  let dominantDoshas = Object.keys(scores).filter((key) => scores[key as keyof typeof scores] === maxScore);
  
  const primaryDosha = dominantDoshas[0] as 'Vata' | 'Pitta' | 'Kapha';
  
  let doshaName = primaryDosha;
  if (dominantDoshas.length > 1) {
    doshaName = `${dominantDoshas[0]}-${dominantDoshas[1]}` as any;
  }

  const reason = `Your symptoms strongly indicate an imbalance in ${doshaName} energy (Score: V=${scores.Vata}, P=${scores.Pitta}, K=${scores.Kapha}).`;

  return {
    dosha: doshaName as any,
    reason: reason,
    issues: DIAGNOSIS_DATA[primaryDosha].issues,
    remedies: DIAGNOSIS_DATA[primaryDosha].remedies
  };
};
