import { Router, Request, Response } from 'express';
import {
  extractBusinessCardOcr,
  generateOpportunityInsights,
  generateEmailDraft,
} from '../services/gemini.service';

export const aiRouter = Router();

// Alias for card OCR
aiRouter.post('/ocr-card', async (req: Request, res: Response) => {
  try {
    const imageInput = req.body.imageBase64 || req.body.image;
    const mimeType = req.body.mimeType || 'image/jpeg';

    if (!imageInput) {
      return res.status(400).json({ error: 'imageBase64 or image string is required' });
    }

    const result = await extractBusinessCardOcr(imageInput, mimeType);
    return res.json(result);
  } catch (err: any) {
    console.error('[AI OCR Route Error]:', err);
    return res.status(500).json({
      error: 'Failed to extract business card data',
      message: err.message || 'Unknown error',
    });
  }
});

// Opportunity Deal Insights & Health Score
aiRouter.post('/opportunity-insight', async (req: Request, res: Response) => {
  try {
    const { opportunity, account, recentActivities } = req.body;
    const insights = await generateOpportunityInsights(opportunity, account, recentActivities);
    return res.json(insights);
  } catch (err: any) {
    console.error('[AI Opportunity Insight Error]:', err);
    return res.status(500).json({
      error: 'Failed to generate AI opportunity insights',
      message: err.message || 'Unknown error',
    });
  }
});

// Smart Sales Email Composer
aiRouter.post('/email-draft', async (req: Request, res: Response) => {
  try {
    const { contact, account, opportunity, purpose } = req.body;
    const emailDraft = await generateEmailDraft(contact, account, opportunity, purpose);
    return res.json(emailDraft);
  } catch (err: any) {
    console.error('[AI Email Draft Error]:', err);
    return res.status(500).json({
      error: 'Failed to generate AI email draft',
      message: err.message || 'Unknown error',
    });
  }
});
