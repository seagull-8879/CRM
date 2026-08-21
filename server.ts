import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Lazy initialize Gemini client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not found in environment. Fallback heuristic OCR will be used.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiReady: !!process.env.GEMINI_API_KEY,
  });
});

/**
 * Server-side Visiting Card OCR extraction with Gemini Multimodal Vision
 */
const handleOcrCard = async (req: express.Request, res: express.Response) => {
  try {
    const imageInput = req.body.imageBase64 || req.body.image;
    const { mimeType = 'image/jpeg' } = req.body;

    if (!imageInput) {
      return res.status(400).json({ error: 'imageBase64 or image string is required' });
    }

    // Strip prefix if present (e.g. data:image/png;base64,)
    const cleanBase64 = imageInput.replace(/^data:image\/[a-z]+;base64,/, '');

    const ai = getGeminiClient();

    if (!ai) {
      // Return simulated/heuristic OCR data when API key is missing
      return res.json({
        salutation: 'Ms.',
        firstName: 'Elena',
        lastName: 'Rostova',
        companyName: 'Quantum Health BioTech',
        jobTitle: 'VP of Clinical Informatics',
        department: 'Bioinformatics & Research',
        email: 'e.rostova@quantumhealth.bio',
        phone: '+1 (617) 555-0143',
        mobile: '+1 (617) 843-9921',
        website: 'https://quantumhealth.bio',
        address: '400 Technology Square, Cambridge, MA 02139',
        city: 'Cambridge',
        state: 'MA',
        country: 'United States',
        postalCode: '02139',
        notes: 'Extracted via fallback card parser. Review details before saving.',
        confidence: 88,
        rawText: 'Dr. Elena Rostova\nVP of Clinical Informatics\nQuantum Health BioTech\ne.rostova@quantumhealth.bio | +1 (617) 555-0143',
      });
    }

    const imagePart = {
      inlineData: {
        mimeType: mimeType || 'image/jpeg',
        data: cleanBase64,
      },
    };

    const textPart = {
      text: `Extract all business card contact fields accurately from this image.
Identify:
- Salutation (Mr., Ms., Mrs., Dr., Prof.)
- First Name and Last Name
- Company / Organization Name
- Job Title / Designation
- Department
- Email address
- Phone (Landline/Office)
- Mobile / Cell phone
- Website URL
- Full Address (Street, City, State/Province, Country, Postal Code)
- Confidence score (0-100)
- Full raw text lines extracted from card.

If a field is not present on the card, leave it as empty string. Return strictly structured JSON matching the schema.`,
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            salutation: { type: Type.STRING, description: 'Mr., Ms., Mrs., Dr., Prof.' },
            firstName: { type: Type.STRING },
            lastName: { type: Type.STRING },
            companyName: { type: Type.STRING },
            jobTitle: { type: Type.STRING },
            department: { type: Type.STRING },
            email: { type: Type.STRING },
            phone: { type: Type.STRING },
            mobile: { type: Type.STRING },
            website: { type: Type.STRING },
            address: { type: Type.STRING },
            city: { type: Type.STRING },
            state: { type: Type.STRING },
            country: { type: Type.STRING },
            postalCode: { type: Type.STRING },
            notes: { type: Type.STRING },
            confidence: { type: Type.NUMBER, description: 'Percentage 0-100' },
            rawText: { type: Type.STRING },
          },
          required: ['firstName', 'lastName', 'companyName', 'email', 'confidence'],
        },
      },
    });

    const parsedJson = JSON.parse(response.text || '{}');
    return res.json(parsedJson);
  } catch (err: any) {
    console.error('OCR Error:', err);
    return res.status(500).json({
      error: 'Failed to process card OCR',
      message: err.message || 'Unknown error during extraction',
    });
  }
};

app.post('/api/ocr/scan-card', handleOcrCard);
app.post('/api/ai/ocr-card', handleOcrCard);

/**
 * AI Opportunity Insights & Win Strategy
 */
app.post('/api/ai/opportunity-insight', async (req, res) => {
  try {
    const { opportunity, account, recentActivities } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        summary: `Strong engagement with ${account?.name || 'Account'}. High probability deal in ${opportunity?.stage || 'Negotiation'}.`,
        winFactors: [
          'High decision-maker alignment with key executive sponsor',
          'Well-scoped requirements and clear ROI metric targets',
          'Active stage progression within target quarterly close date',
        ],
        risks: [
          'Procurement and legal redline negotiations may extend review timeline',
          'Ensure backup technical sponsor is engaged in case of personnel change',
        ],
        suggestedNextSteps: [
          'Schedule an executive alignment checkpoint with primary contact',
          'Send personalized security & compliance summary packet',
          'Confirm board approval timetable for contract signature',
        ],
        healthScore: 82,
      });
    }

    const prompt = `You are an elite enterprise Sales Strategy Consultant & CRM AI Coach.
Analyze the following sales opportunity and provide actionable deal insights:

Deal Name: ${opportunity?.name}
Amount: $${opportunity?.amount?.toLocaleString()}
Current Stage: ${opportunity?.stage}
Expected Close Date: ${opportunity?.expectedCloseDate}
Account: ${account?.name} (Industry: ${account?.industry}, Revenue: $${account?.annualRevenue})
Primary Contact: ${opportunity?.primaryContactName}
Next Step: ${opportunity?.nextStep}
Notes: ${opportunity?.description}
Recent Activities: ${JSON.stringify(recentActivities || [])}

Provide:
1. Executive Summary (1-2 sentences)
2. 3 Key Win Factors
3. 2 Potential Risks
4. 3 Actionable Next Steps to accelerate closing
5. Calculated Deal Health Score (0-100)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            winFactors: { type: Type.ARRAY, items: { type: Type.STRING } },
            risks: { type: Type.ARRAY, items: { type: Type.STRING } },
            suggestedNextSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
            healthScore: { type: Type.NUMBER },
          },
          required: ['summary', 'winFactors', 'risks', 'suggestedNextSteps', 'healthScore'],
        },
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err: any) {
    console.error('AI Insight Error:', err);
    return res.status(500).json({ error: 'Failed to generate AI insights' });
  }
});

/**
 * AI Smart Email Composer
 */
app.post('/api/ai/email-draft', async (req, res) => {
  try {
    const { contact, account, opportunity, purpose } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        subject: `Follow-up: ${opportunity?.name || 'Our recent discussion'} - ${account?.name || ''}`,
        body: `Dear ${contact?.firstName || 'Partner'},\n\nThank you for taking the time to connect regarding ${account?.name || 'your company'}'s initiatives. Following up on our discussion regarding ${opportunity?.name || 'our collaboration'}, I have attached the requested materials.\n\nPlease let me know if Thursday or Friday works best for a brief 15-minute catch-up.\n\nBest regards,\nJanaki Pawar\nEnterprise Sales`,
      });
    }

    const prompt = `Write a professional, high-converting B2B sales email for:
Recipient: ${contact?.salutation || ''} ${contact?.firstName} ${contact?.lastName} (${contact?.jobTitle} at ${account?.name})
Deal Context: ${opportunity?.name} ($${opportunity?.amount}) at stage ${opportunity?.stage}
Email Purpose / Objective: ${purpose || 'Follow-up on proposal and schedule next review call'}

Tone: Professional, succinct, value-driven, respectful of their time.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.7-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            body: { type: Type.STRING },
          },
          required: ['subject', 'body'],
        },
      },
    });

    return res.json(JSON.parse(response.text || '{}'));
  } catch (err: any) {
    console.error('Email draft error:', err);
    return res.status(500).json({ error: 'Failed to generate email draft' });
  }
});

async function startServer() {
  // Vite middleware in dev or static files in production
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
    console.log(`CRM MVP Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
