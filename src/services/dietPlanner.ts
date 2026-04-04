export interface DietRoutine {
  morning: string;
  breakfast: string;
  lunch: string;
  evening: string;
  dinner: string;
}

export const generateDietPlan = (dosha: string, goal: 'loss' | 'gain' | 'maintain' = 'maintain'): DietRoutine => {
  
  // Vata tends to need warm, grounding, nourishing food
  const vataPlan: DietRoutine = {
    morning: "Warm water with lemon and a pinch of rock salt. 5 soaked almonds.",
    breakfast: "Warm oatmeal with ghee, warm milk, and mild spices (cinnamon, cardamom).",
    lunch: "Warm dal (moong or toor) with basmati rice, root vegetables cooked in ghee.",
    evening: "Warm milk with a pinch of nutmeg or Ashwagandha.",
    dinner: "Light warm soup or khichdi with plenty of digestive spices."
  };

  // Pitta needs cooling, moderately heavy food
  const pittaPlan: DietRoutine = {
    morning: "Cool or room temperature water. Aloe vera juice or coconut water.",
    breakfast: "Cold cereal, sweet fruits, or idli with mild coconut chutney.",
    lunch: "Salad, rice/roti with mild vegetable curry (no chili). Cool buttermilk.",
    evening: "Fresh sweet fruit or Brahmi tea.",
    dinner: "Quinoa or rice with cooling vegetables like zucchini, cucumber, or bitter gourd."
  };

  // Kapha needs light, warm, dry, and spicy food
  const kaphaPlan: DietRoutine = {
    morning: "Warm water with a tsp of raw honey and ginger.",
    breakfast: "Very light. Fresh fruit or a plain toast. Avoid heavy dairy.",
    lunch: "Spicy lentil soup, quinoa/millet, steamed leafy greens. Lots of black pepper.",
    evening: "Tulsi or green tea. Roasted chana.",
    dinner: "Very light soup or roasted vegetables. Eat before 7 PM."
  };

  // Default to Tridoshic if balanced or mixed
  const balancedPlan: DietRoutine = {
    morning: "Warm water with lemon.",
    breakfast: "Poha, upma, or fresh fruits.",
    lunch: "Dal, rice, roti, and seasonal vegetables (balanced thali).",
    evening: "Herbal tea.",
    dinner: "Light khichdi or soup."
  };

  let plan = balancedPlan;
  if (dosha.includes('Vata')) plan = vataPlan;
  else if (dosha.includes('Pitta')) plan = pittaPlan;
  else if (dosha.includes('Kapha')) plan = kaphaPlan;

  // Adjust for goals
  if (goal === 'loss') {
    plan.dinner = "Replace dinner with a light soup or bone broth. No carbs after 6 PM.";
    plan.morning += " Add warm water with honey to boost metabolism.";
  } else if (goal === 'gain') {
    plan.breakfast += " Add 2 bananas and an extra glass of full-fat milk.";
    plan.lunch += " Add extra ghee and a serving of sweet potatoes.";
  }

  return plan;
};
