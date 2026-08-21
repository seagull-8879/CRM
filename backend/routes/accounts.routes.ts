import { Router, Request, Response } from 'express';
import { crmService } from '../services/crm.service';

export const accountsRouter = Router();

// GET all accounts
accountsRouter.get('/', (req: Request, res: Response) => {
  const accounts = crmService.getAccounts();
  res.json({ data: accounts, total: accounts.length });
});

// GET single account
accountsRouter.get('/:id', (req: Request, res: Response) => {
  const account = crmService.getAccountById(req.params.id);
  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json(account);
});

// CREATE account
accountsRouter.post('/', (req: Request, res: Response) => {
  try {
    const newAccount = crmService.createAccount(req.body);
    crmService.logActivity({
      type: 'Note',
      title: `Account Created: ${newAccount.name}`,
      description: `New ${newAccount.type} account created by ${newAccount.ownerName}`,
      relatedToType: 'Account',
      relatedToId: newAccount.id,
      relatedToName: newAccount.name,
      userId: newAccount.ownerId,
      userName: newAccount.ownerName,
    });
    res.status(201).json(newAccount);
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to create account', message: err.message });
  }
});

// UPDATE account
accountsRouter.put('/:id', (req: Request, res: Response) => {
  const updated = crmService.updateAccount(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json(updated);
});

// DELETE account
accountsRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = crmService.deleteAccount(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Account not found' });
  }
  res.json({ success: true, id: req.params.id });
});
