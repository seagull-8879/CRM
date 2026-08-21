import express, { Express } from 'express';
import path from 'path';
import { apiRouter } from './routes';
import { errorHandler } from './middleware/errorHandler';
import { config } from './config';

export function createServerApp(): Express {
  const app = express();

  // Request parsing with generous limits for multimodal card scans
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Mount API router
  app.use('/api', apiRouter);

  // Error handling middleware
  app.use(errorHandler);

  return app;
}

export default createServerApp;
