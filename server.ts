import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize server-side Gemini client with aistudio-build telemetry
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiKeyConfigured: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Safe Meeting Points API with Google Maps Grounding via gemini-3.5-flash
app.post('/api/meeting-points', async (req, res) => {
  const { location = 'Austin, TX', lat, lng, dogName, dogBreed } = req.body;

  try {
    const prompt = `Find 4 highly rated, safe, and public pet meeting and pickup locations in or near ${location}.
The prospective dog guardian is meeting a verified breeder to welcome ${dogName ? `${dogName} (${dogBreed || 'dog'})` : 'their new companion'}.
Ideal locations include:
1. An accredited 24/7 emergency veterinary hospital or animal health center (best for an immediate escrow physical exam and microchip verification).
2. An official police department or municipal Safe Exchange Zone (under 24/7 video surveillance and well-lit).
3. A safe, secure, fenced canine park or socialization center.
4. A premier pet wellness or certified training facility.

For each place, provide the exact name, full address, category, safety highlights, and why it is ideal for a safe escrow handoff.`;

    const config: any = {
      tools: [{ googleMaps: {} }],
    };

    if (typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
      config.toolConfig = {
        retrievalConfig: {
          latLng: {
            latitude: lat,
            longitude: lng,
          },
        },
      };
    }

    // Explicitly using gemini-3.5-flash with googleMaps tool as requested
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config,
    });

    const text = response.text || '';
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Extract place links and information from Maps Grounding chunks
    const mapsGroundingPlaces: any[] = [];
    groundingChunks.forEach((chunk: any, index: number) => {
      if (chunk.maps) {
        mapsGroundingPlaces.push({
          id: `maps-grounded-${index}-${Date.now()}`,
          title: chunk.maps.title || `Verified Safe Meeting Location #${index + 1}`,
          uri: chunk.maps.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(chunk.maps.title || location)}`,
          placeAnswerSources: chunk.maps.placeAnswerSources || null,
          reviews: chunk.maps.placeAnswerSources?.reviewSnippets || [],
        });
      }
    });

    res.json({
      success: true,
      grounded: true,
      model: 'gemini-3.5-flash',
      text,
      groundingChunks,
      mapsPlaces: mapsGroundingPlaces,
    });
  } catch (err: any) {
    console.warn('Gemini Maps Grounding notice (falling back to verified database):', err?.message || err);
    res.json({
      success: true,
      grounded: false,
      model: 'gemini-3.5-flash',
      notice: err?.message?.includes('429')
        ? 'Using PawPalace Verified Safety Database (Gemini Maps Grounding active when rate limit resets).'
        : 'Using PawPalace Verified Safety Database.',
      error: err?.message,
      text: null,
      groundingChunks: [],
      mapsPlaces: [],
    });
  }
});

// Mount Vite middleware for dev or static files for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PawPalace Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
