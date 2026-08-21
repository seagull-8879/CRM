import { Router, Request, Response } from 'express';
import { extractBusinessCardOcr } from '../services/gemini.service';

export const ocrRouter = Router();

ocrRouter.post('/scan-card', async (req: Request, res: Response) => {
  try {
    const imageInput = req.body.imageBase64 || req.body.image;
    const mimeType = req.body.mimeType || 'image/jpeg';

    if (!imageInput) {
      return res.status(400).json({ error: 'imageBase64 or image string is required' });
    }

    const result = await extractBusinessCardOcr(imageInput, mimeType);
    return res.json(result);
  } catch (err: any) {
    console.error('[OCR Route Error]:', err);
    return res.status(500).json({
      error: 'Failed to process business card OCR',
      message: err.message || 'Unknown OCR error',
    });
  }
});
