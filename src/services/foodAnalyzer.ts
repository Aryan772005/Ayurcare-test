export interface FoodAnalysisResult {
  food_name: string;
  calories: string;
  protein: string;
  carbs: string;
  fats: string;
  health_rating: string;
}

// A smart fallback database if the AI API fails or is not available
const FOOD_DATABASE: Record<string, FoodAnalysisResult> = {
  default: {
    food_name: "Unknown Food",
    calories: "~150 kcal",
    protein: "~5g",
    carbs: "~20g",
    fats: "~5g",
    health_rating: "5/10 - Moderate (Analysis unclear)"
  },
  samosa: {
    food_name: "Samosa",
    calories: "260 kcal",
    protein: "4g",
    carbs: "32g",
    fats: "14g",
    health_rating: "3/10 - High in refined carbs & oil (Increases Kapha & Pitta)"
  },
  dal: {
    food_name: "Dal (Lentils)",
    calories: "150 kcal",
    protein: "9g",
    carbs: "25g",
    fats: "2g",
    health_rating: "9/10 - Excellent tridoshic protein source"
  },
  paneer: {
    food_name: "Paneer Curry",
    calories: "320 kcal",
    protein: "14g",
    carbs: "12g",
    fats: "25g",
    health_rating: "6/10 - Good protein but heavy (Increases Kapha)"
  },
  rice: {
    food_name: "White Rice",
    calories: "205 kcal",
    protein: "4g",
    carbs: "45g",
    fats: "0.4g",
    health_rating: "7/10 - Cooling, easy to digest (Pitta pacifying)"
  },
  biryani: {
    food_name: "Chicken Biryani",
    calories: "450 kcal",
    protein: "22g",
    carbs: "48g",
    fats: "18g",
    health_rating: "5/10 - Delicious but heavy & hot (Increases Pitta)"
  },
  salad: {
    food_name: "Fresh Salad",
    calories: "50 kcal",
    protein: "2g",
    carbs: "10g",
    fats: "0g",
    health_rating: "10/10 - High Prana (Best for Kapha/Pitta, Vata should eat warm)"
  }
};

/**
 * Simulates analyzing a food image if the backend API isn't available.
 * It randomly selects or attempts to pseudo-recognize based on dummy logic,
 * giving the "feel" of AI for the hackathon demo.
 */
export const fallbackAnalyzeFood = async (imageFile: File): Promise<FoodAnalysisResult> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // For demo purposes, we randomly assign a known food or return dal
      const keys = Object.keys(FOOD_DATABASE).filter(k => k !== 'default');
      // Simple hash of filename to get a deterministic result per file
      const hash = imageFile.name.length;
      const index = hash % keys.length;
      const key = keys[index];
      
      resolve(FOOD_DATABASE[key] || FOOD_DATABASE.default);
    }, 2000); // Simulate API latency
  });
};
