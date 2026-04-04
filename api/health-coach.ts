import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let rawKey = process.env.NVIDIA_API_KEY || process.env.NIVIDIA_API_KEY || process.env.NVIDIA_KEY || '';
  let apiKey = rawKey.trim().replace(/^[\"']|[\"']$/g, '');
  if (apiKey.startsWith('Bearer ')) apiKey = apiKey.substring(7).trim();

  if (!apiKey) {
    return res.status(500).json({ error: 'NVIDIA_API_KEY not configured.' });
  }

  const {
    age, gender, height, weight, goal, activityLevel, foodPreference,
    conditions, bpm, bpmArray, caloriesToday, foodList,
    skinType, hairCondition, imageData,
  } = req.body;

  if (!age || !gender) {
    return res.status(400).json({ error: 'Missing required profile fields (age, gender).' });
  }

  const SYSTEM_PROMPT = `You are an advanced AI-powered holistic health system that combines modern nutrition science, Ayurveda, dermatology basics, and lifestyle optimization.

Your role is to act as a personal AI health coach, dietician, and Ayurvedic consultant.

You must generate highly practical, personalized, and actionable recommendations for Indian users, keeping affordability and simplicity in mind.`;

  const USER_PROMPT = `
========================================
USER PROFILE:
========================================
- Age: ${age}
- Gender: ${gender}
- Height: ${height} cm
- Weight: ${weight} kg
- Goal: ${goal}
- Activity Level: ${activityLevel}
- Food Preference: ${foodPreference}
- Medical Conditions: ${conditions || 'None'}

========================================
REAL-TIME HEALTH DATA:
========================================
- Average BPM (7 days): ${bpm || 'Not provided'}
- BPM History: ${Array.isArray(bpmArray) ? bpmArray.join(', ') : (bpmArray || 'Not provided')}
- Calories Consumed Today: ${caloriesToday || 'Not provided'}
- Food Items Consumed: ${foodList || 'Not provided'}

${skinType || hairCondition || imageData ? `
(Optional Inputs)
- Skin Type: ${skinType || 'Not provided'}
- Hair Condition: ${hairCondition || 'Not provided'}
- Uploaded Food Image Data: ${imageData || 'Not provided'}
` : ''}

========================================
YOUR TASKS:
========================================

1. HEALTH STATUS ANALYSIS:
- Analyze BPM trends
- Classify: Normal / Warning / Risky
- Give reasons and possible causes

2. DAILY CALORIE CALCULATION:
- Calculate exact calorie requirement based on goal
- Adjust based on BPM and activity

3. MACRONUTRIENT BREAKDOWN:
- Protein (grams)
- Carbohydrates (grams)
- Fats (grams)

4. PERSONALIZED INDIAN DIET PLAN:
- Breakfast, Lunch, Dinner, Snacks
- Include calorie count per meal
- Keep it affordable and practical

5. TODAY'S FOOD ANALYSIS:
- Compare consumed vs required calories
- Highlight deficiencies or excess
- Suggest corrections

6. SMART HEALTH RECOMMENDATIONS:
- What user did right
- What needs improvement
- Clear actionable steps for next day

7. AYURVEDIC ANALYSIS:
- Identify dominant dosha (Vata/Pitta/Kapha)
- Suggest balancing foods
- Suggest herbs/remedies (Triphala, Ashwagandha, etc.)

========================================
8. HAIR CARE & HAIRFALL SOLUTION (VERY IMPORTANT):
========================================
Based on hair condition: ${hairCondition || 'general'}

- Identify possible causes (stress, nutrition deficiency, dandruff, hormonal, etc.)
- Provide:
  1. Daily routine for hair care
  2. Weekly routine (oil, masks)
  3. Ayurvedic remedies (amla, bhringraj, neem, coconut oil, etc.)
  4. Diet for hair growth (protein, iron, biotin)
  5. Foods to avoid
- If hairfall severe → give warning

========================================
9. AYURVEDIC SKINCARE & COSMETIC SUGGESTIONS:
========================================
Based on skin type: ${skinType || 'general'}

- Daily skincare routine (morning + night)
- Natural Ayurvedic remedies (aloe vera, turmeric, multani mitti, rose water, neem)
- Recommend:
  1. Face packs
  2. Cleansing methods
  3. Moisturizing methods
  4. Acne/pigmentation solutions
- Suggest simple homemade cosmetic solutions

========================================
10. FITNESS & LIFESTYLE:
========================================
- Workout recommendation (home-based)
- Best exercise timing
- Sleep improvement tips
- Hydration advice

========================================
11. RISK ALERT SYSTEM:
========================================
- BPM abnormal → warning
- Low/high calorie intake → alert
- Poor nutrition → alert

========================================
12. DAILY AYURVEDIC POPUP TIPS (UI FEATURE):
========================================
Generate exactly 3 short tips for popup/navbar display:
- TIP_HAIR: [1 hair care tip, max 12 words]
- TIP_SKIN: [1 skin care tip, max 12 words]
- TIP_HEALTH: [1 general Ayurvedic health tip, max 12 words]

========================================
13. FINAL SUMMARY:
========================================
Provide 5 key actionable steps for tomorrow.

========================================
RESPONSE STYLE:
========================================
- Use clear headings (## 1. HEALTH STATUS ANALYSIS, etc.)
- Simple English
- Practical, not theoretical
- Indian context (budget-friendly)
- Avoid generic advice
- Be specific and fast
`;

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
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
        temperature: 0.4,
        top_p: 0.85,
        max_tokens: 4096,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('NVIDIA API Error:', response.status, errText);
      return res.status(500).json({ error: `AI API error: ${response.status}`, details: errText });
    }

    const data = await response.json();
    const report = data.choices?.[0]?.message?.content || 'Could not generate report.';

    // Extract popup tips via regex for easy UI consumption
    const tipHair = report.match(/TIP_HAIR:\s*(.+)/)?.[1]?.trim() || 'Massage scalp with warm coconut oil weekly.';
    const tipSkin = report.match(/TIP_SKIN:\s*(.+)/)?.[1]?.trim() || 'Apply rose water to refresh skin daily.';
    const tipHealth = report.match(/TIP_HEALTH:\s*(.+)/)?.[1]?.trim() || 'Drink warm water with tulsi each morning.';

    return res.status(200).json({
      report,
      tips: { hair: tipHair, skin: tipSkin, health: tipHealth },
    });
  } catch (error: any) {
    console.error('Health coach handler error:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
