import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: 3000,
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: 'gemini-3.7-flash',
  isProduction: process.env.NODE_ENV === 'production',
};
