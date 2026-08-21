import { Router, Request, Response } from 'express';
import { crmService } from '../services/crm.service';

export const contactsRouter = Router();

// GET all contacts
contactsRouter.get('/', (req: Request, res: Response) => {
  const contacts = crmService.getContacts();
  res.json({ data: contacts, total: contacts.length });
});

// GET single contact
contactsRouter.get('/:id', (req: Request, res: Response) => {
  const contact = crmService.getContactById(req.params.id);
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json(contact);
});

// CREATE contact
contactsRouter.post('/', (req: Request, res: Response) => {
  try {
    const newContact = crmService.createContact(req.body);
    crmService.logActivity({
      type: 'Note',
      title: `Contact Created: ${newContact.firstName} ${newContact.lastName}`,
      description: `${newContact.jobTitle} at ${newContact.accountName}`,
      relatedToType: 'Contact',
      relatedToId: newContact.id,
      relatedToName: `${newContact.firstName} ${newContact.lastName}`,
      userId: newContact.ownerId,
      userName: newContact.ownerName,
    });
    res.status(201).json(newContact);
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to create contact', message: err.message });
  }
});

// UPDATE contact
contactsRouter.put('/:id', (req: Request, res: Response) => {
  const updated = crmService.updateContact(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json(updated);
});

// DELETE contact
contactsRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = crmService.deleteContact(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json({ success: true, id: req.params.id });
});
