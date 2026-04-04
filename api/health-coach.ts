import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  // API Key Fix
  let apiKey = (
    process.env.NVIDIA_API_KEY ||
    process.env.NIVIDIA_API_KEY ||
    process.env.NVIDIA_KEY ||
    ''
  ).trim().replace(/^[\"']|[\"']$/g, '');

  if (apiKey.startsWith('Bearer ')) apiKey = apiKey.substring(7).trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured.' });
  }

  // Safe body parsing
  const body = req.body || {};

  const {
    age, gender, height, weight, goal,
    activityLevel, foodPreference,
    conditions, bpm, bpmArray,
    caloriesToday, foodList,
    skinType, hairCondition, imageData,
  } = body;

  // Validation
  if (!age || !gender || !height || !weight || !goal) {
    return res.status(400).json({
      error: 'Missing required fields (age, gender, height, weight, goal)',
    });
  }

  // Advanced System Prompt (Professional Assistant)
  const SYSTEM_PROMPT = `
You are an advanced AI-powered holistic health assistant combining modern nutrition science, Ayurveda, dermatology, and lifestyle optimization.

Your role is to act as a:
- Personal Health Coach
- Certified Dietician
- Ayurvedic Consultant
- Basic Skin & Hair Care Advisor

Your goal is to generate highly practical, personalized, affordable, and actionable recommendations tailored for Indian users. Avoid generic advice. Focus on clarity, usefulness, and real-life applicability.

Follow these 13 sections of analysis:
1. HEALTH STATUS ANALYSIS (BPM trends, classification)
2. DAILY CALORIE REQUIREMENT (Total needs adjusted for goals)
3. MACRONUTRIENT BREAKDOWN (Protein, Carbs, Fats)
4. PERSONALIZED INDIAN DIET PLAN (Budget-friendly Indian foods)
5. TODAY’S FOOD ANALYSIS (Consumed vs Required)
6. SMART HEALTH INSIGHTS (Improvements, actionable steps)
7. AYURVEDIC ANALYSIS (Dosha identification, balancing foods/herbs)
8. HAIR CARE & HAIRFALL SOLUTION (Routine, Remedies, Diet)
9. AYURVEDIC SKINCARE & COSMETICS (Morning/Night routine, Natural remedies)
10. FITNESS & LIFESTYLE (Workouts, Sleep, Hydration)
11. RISK ALERTS (Abnormalities detection)
12. DAILY AYURVEDIC QUICK TIPS (3 short tips: Hair, Skin, Health)
13. FINAL ACTION PLAN (Exactly 5 clear steps for tomorrow)
`;

  // Structured Output Request (JSON Mapping)
  const USER_PROMPT = `
Return response STRICTLY in JSON format. Do not include any text outside the JSON.

{
  "healthAnalysis": "Combine Section 1 (Health Status) and Section 7 (Ayurvedic/Dosha Analysis) here.",
  "calories": {
    "required": 0,
    "protein": 0,
    "carbs": 0,
    "fats": 0
  },
  "dietPlan": {
    "breakfast": "Item + Calories",
    "lunch": "Item + Calories",
    "dinner": "Item + Calories",
    "snacks": "Item + Calories"
  },
  "foodAnalysis": "Detailed Section 5 report.",
  "recommendations": ["List 3-5 actionable steps from Section 6"],
  "hairCare": {
    "issue": "Identified cause from Section 8",
    "remedies": ["Daily routine", "Weekly routine", "Herbs/Diet from Section 8"]
  },
  "skinCare": {
    "routine": "Morning/Night breakdown from Section 9",
    "remedies": ["Natural remedies/packs from Section 9"]
  },
  "fitness": "Section 10 details (Workout, Sleep, Hydration).",
  "alerts": ["Risk alerts from Section 11"],
  "tips": {
    "hair": "TIP_HAIR (max 12 words)",
    "skin": "TIP_SKIN (max 12 words)",
    "health": "TIP_HEALTH (max 12 words)"
  },
  "summary": ["The 5 clear actionable steps from Section 13"]
}

USER PROFILE:
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Goal: ${goal}
- Activity: ${activityLevel}
- Food Preference: ${foodPreference}
- Medical Conditions: ${conditions || 'None'}

REAL-TIME DATA:
- Average BPM: ${bpm || 'N/A'}
- Calories Consumed Today: ${caloriesToday || '0'}
- Food Consumed: ${foodList || 'None'}
- Skin Type: ${skinType || 'Combination'}
- Hair Condition: ${hairCondition || 'Normal'}
`;

  try {
    // Timeout Controller
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: USER_PROMPT },
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(500).json({
        error: `AI API error: ${response.status}`,
        details: errText,
      });
    }

    const data = await response.json();
    let output = data.choices?.[0]?.message?.content;

    // Remove markdown codeblock around JSON if present
    if (output) {
      output = output.replace(/^\`\`\`json\s*/i, '').replace(/\`\`\`\s*$/, '').trim();
    }

    // JSON Safe Parse
    let parsed;
    try {
      parsed = JSON.parse(output);
    } catch {
      return res.status(500).json({
        error: 'AI response parsing failed',
        raw: output,
      });
    }

    return res.status(200).json(parsed);

  } catch (error: any) {
    return res.status(500).json({
      error: error.name === 'AbortError'
        ? 'Request timeout'
        : error.message || 'Internal server error',
    });
  }
}
