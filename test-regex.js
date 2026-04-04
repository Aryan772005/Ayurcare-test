const testJson = `{ "healthAnalysis": "Section 1+7 (BPM/Dosha analysis)", "calories": { "required": 2500, "protein": 120g, "carbs": 300g, "fats": 70g }, "dietPlan": { "breakfast": "Oatmeal" } }`;

function repairJson(jsonText) {
  // Regex from health-coach.ts
  return jsonText.replace(/:\s*(\d+(?:\.\d+)?(?:g|kcal|mg|kg|ml))\b/gi, ': "$1"');
}

const repaired = repairJson(testJson);
console.log("Original:", testJson);
console.log("Repaired:", repaired);

try {
  JSON.parse(repaired);
  console.log("SUCCESS: JSON is valid after repair.");
} catch (e) {
  console.log("FAILURE: JSON still invalid after repair.");
  console.log("Error:", e.message);
}
