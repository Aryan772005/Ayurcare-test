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

  // Concise System Prompt
  const SYSTEM_PROMPT = `You are a professional Indian health coach (Ayurveda + Modern Nutrition). Generate high-precision, actionable health blueprints. Follow the 13-section structure precisely within JSON. Focus on budget-friendly Indian solutions.`;

  // Structured Output Request (JSON Mapping)
  const USER_PROMPT = `Return Strictly JSON. No other text.
  Profile: Age ${age}, ${gender}, ${height}cm, ${weight}kg, Goal: ${goal}, Activity: ${activityLevel}, Diet: ${foodPreference}, Med: ${conditions || 'None'}.
  Real-time: BPM ${bpm || 'N/A'}, Cals Today ${caloriesToday || '0'}, Food: ${foodList || 'None'}, Skin: ${skinType}, Hair: ${hairCondition}.

  JSON Map:
  {
    "healthAnalysis": "Section 1+7 (BPM/Dosha analysis)",
    "calories": { "required": 0, "protein": 0, "carbs": 0, "fats": 0 },
    "dietPlan": { "breakfast": "item+cal", "lunch": "item+cal", "dinner": "item+cal", "snacks": "item+cal" },
    "foodAnalysis": "Detailed section 5 (Consumed vs Required)",
    "recommendations": ["3-5 actionable steps"],
    "hairCare": { "issue": "cause from sec 8", "remedies": ["routine", "herbs"] },
    "skinCare": { "routine": "am/pm", "remedies": ["packs"] },
    "fitness": "Section 10 details",
    "alerts": ["Risk alerts from sec 11"],
    "tips": { "hair": "tip (10w)", "skin": "tip (10w)", "health": "tip (10w)" },
    "summary": ["5 clear steps for tomorrow"]
  }`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000); // 9s timeout for Vercel Hobby

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
        temperature: 0.2, // Lower temperature for more stable JSON
        max_tokens: 1500, // Reduced slightly to save time
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
