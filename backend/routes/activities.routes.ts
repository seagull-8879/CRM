import { Router, Request, Response } from 'express';
import { crmService } from '../services/crm.service';

export const activitiesRouter = Router();

// GET all activities / audit trail
activitiesRouter.get('/', (req: Request, res: Response) => {
  const activities = crmService.getActivities();
  res.json({ data: activities, total: activities.length });
});

// LOG an activity
activitiesRouter.post('/', (req: Request, res: Response) => {
  try {
    const newActivity = crmService.logActivity(req.body);
    res.status(201).json(newActivity);
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to log activity', message: err.message });
  }
});
