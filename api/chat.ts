import type { IncomingMessage, ServerResponse } from 'http';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const geminiKey = (process.env.GEMINI_API_KEY || '').trim();

  if (!geminiKey) {
    console.error('GEMINI_API_KEY is not set in environment variables');
    return res.status(500).json({
      error: 'Server config error: GEMINI_API_KEY missing. Add it in Vercel Environment Variables.',
    });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Missing message' });
  }

  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const systemPrompt = `You are a knowledgeable and compassionate Ayurvedic health assistant for Nexus Ayurve.
Provide helpful advice based on Ayurvedic principles including dosha balancing (Vata, Pitta, Kapha), herbal remedies, yoga, pranayama, and diet recommendations.
Always be warm, professional, and use bullet points for lists.
Recommend consulting a qualified Ayurvedic doctor for serious conditions.`;

    const result = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `${systemPrompt}\n\nUser query: ${message}\n\nRespond helpfully with Ayurvedic guidance.`,
    });

    const aiText = result.text || "I couldn't generate a response.";
    return res.status(200).json({ reply: aiText });

  } catch (error: any) {
    console.error('Gemini API Error:', error?.message || error);
    return res.status(500).json({ error: error?.message || 'Internal server error' });
  }
}
