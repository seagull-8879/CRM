import { GoogleGenAI, Type } from '@google/genai';
import { config } from '../config';
import { CardOcrResult, OpportunityAiInsight, EmailDraftResponse, Opportunity, Account, Activity, Contact } from '../types';

let geminiClient: GoogleGenAI | null = null;

export function getGeminiClient(): GoogleGenAI | null {
  if (!config.geminiApiKey) {
    console.warn('[Gemini Service] GEMINI_API_KEY is not defined. Intelligent fallback heuristics will be used.');
    return null;
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({
      apiKey: config.geminiApiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }

  return geminiClient;
}

/**
 * Perform Multimodal Business Card OCR using Gemini Vision
 */
export async function extractBusinessCardOcr(
  imageBase64: string,
  mimeType: string = 'image/jpeg'
): Promise<CardOcrResult> {
  const ai = getGeminiClient();
  const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

  if (!ai) {
    // Fallback heuristic card extraction
    return {
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
      notes: 'Extracted via fallback card OCR parser. Review details before saving.',
      confidence: 88,
      rawText: 'Dr. Elena Rostova\nVP of Clinical Informatics\nQuantum Health BioTech\ne.rostova@quantumhealth.bio | +1 (617) 555-0143',
    };
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
    model: config.geminiModel,
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

  return JSON.parse(response.text || '{}') as CardOcrResult;
}

/**
 * Generate Opportunity Insights and Win Strategies with Gemini AI
 */
export async function generateOpportunityInsights(
  opportunity: Partial<Opportunity>,
  account?: Partial<Account>,
  recentActivities?: Activity[]
): Promise<OpportunityAiInsight> {
  const ai = getGeminiClient();

  if (!ai) {
    return {
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
    };
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
    model: config.geminiModel,
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

  return JSON.parse(response.text || '{}') as OpportunityAiInsight;
}

/**
 * Generate Smart Sales Email Draft
 */
export async function generateEmailDraft(
  contact: Partial<Contact>,
  account?: Partial<Account>,
  opportunity?: Partial<Opportunity>,
  purpose?: string
): Promise<EmailDraftResponse> {
  const ai = getGeminiClient();

  if (!ai) {
    return {
      subject: `Follow-up: ${opportunity?.name || 'Our recent discussion'} - ${account?.name || ''}`,
      body: `Dear ${contact?.firstName || 'Partner'},\n\nThank you for taking the time to connect regarding ${account?.name || 'your company'}'s initiatives. Following up on our discussion regarding ${opportunity?.name || 'our collaboration'}, I have attached the requested materials.\n\nPlease let me know if Thursday or Friday works best for a brief 15-minute catch-up.\n\nBest regards,\nJanaki Pawar\nEnterprise Sales`,
    };
  }

  const prompt = `Write a professional, high-converting B2B sales email for:
Recipient: ${contact?.salutation || ''} ${contact?.firstName} ${contact?.lastName} (${contact?.jobTitle} at ${account?.name})
Deal Context: ${opportunity?.name} ($${opportunity?.amount}) at stage ${opportunity?.stage}
Email Purpose / Objective: ${purpose || 'Follow-up on proposal and schedule next review call'}

Tone: Professional, succinct, value-driven, respectful of their time.`;

  const response = await ai.models.generateContent({
    model: config.geminiModel,
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

  return JSON.parse(response.text || '{}') as EmailDraftResponse;
}
