import { Router, Request, Response } from 'express';
import { crmService } from '../services/crm.service';

export const opportunitiesRouter = Router();

// GET all opportunities
opportunitiesRouter.get('/', (req: Request, res: Response) => {
  const opps = crmService.getOpportunities();
  res.json({ data: opps, total: opps.length });
});

// GET single opportunity
opportunitiesRouter.get('/:id', (req: Request, res: Response) => {
  const opp = crmService.getOpportunityById(req.params.id);
  if (!opp) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }
  res.json(opp);
});

// CREATE opportunity
opportunitiesRouter.post('/', (req: Request, res: Response) => {
  try {
    const newOpp = crmService.createOpportunity(req.body);
    crmService.logActivity({
      type: 'Stage Changed',
      title: `Opportunity Created: ${newOpp.name}`,
      description: `Amount: $${newOpp.amount.toLocaleString()} | Initial Stage: ${newOpp.stage}`,
      relatedToType: 'Opportunity',
      relatedToId: newOpp.id,
      relatedToName: newOpp.name,
      userId: newOpp.ownerId,
      userName: newOpp.ownerName,
    });
    res.status(201).json(newOpp);
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to create opportunity', message: err.message });
  }
});

// UPDATE opportunity (or Stage change)
opportunitiesRouter.put('/:id', (req: Request, res: Response) => {
  const existing = crmService.getOpportunityById(req.params.id);
  const updated = crmService.updateOpportunity(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  if (existing && existing.stage !== updated.stage) {
    crmService.logActivity({
      type: 'Stage Changed',
      title: `Stage Updated for ${updated.name}`,
      description: `Progressed from "${existing.stage}" to "${updated.stage}" (Probability: ${updated.probability}%)`,
      relatedToType: 'Opportunity',
      relatedToId: updated.id,
      relatedToName: updated.name,
      userId: updated.ownerId,
      userName: updated.ownerName,
    });
  }

  res.json(updated);
});

// DELETE opportunity
opportunitiesRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = crmService.deleteOpportunity(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }
  res.json({ success: true, id: req.params.id });
});
