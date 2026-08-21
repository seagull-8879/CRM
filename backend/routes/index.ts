import { Router } from 'express';
import { ocrRouter } from './ocr.routes';
import { aiRouter } from './ai.routes';
import { accountsRouter } from './accounts.routes';
import { contactsRouter } from './contacts.routes';
import { opportunitiesRouter } from './opportunities.routes';
import { tasksRouter } from './tasks.routes';
import { activitiesRouter } from './activities.routes';
import { crmService } from '../services/crm.service';

export const apiRouter = Router();

// Health Check
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiReady: !!process.env.GEMINI_API_KEY,
    service: 'CRM MVP Full-Stack API Engine',
  });
});

// Users
apiRouter.get('/users', (req, res) => {
  res.json({ data: crmService.getUsers() });
});

// Reset Demo Data
apiRouter.post('/reset-data', (req, res) => {
  crmService.seedInitialData();
  res.json({ success: true, message: 'CRM data reset to initial state' });
});

// Mount Resource Routers
apiRouter.use('/ocr', ocrRouter);
apiRouter.use('/ai', aiRouter);
apiRouter.use('/accounts', accountsRouter);
apiRouter.use('/contacts', contactsRouter);
apiRouter.use('/opportunities', opportunitiesRouter);
apiRouter.use('/tasks', tasksRouter);
apiRouter.use('/activities', activitiesRouter);
