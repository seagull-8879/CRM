import { Router, Request, Response } from 'express';
import { crmService } from '../services/crm.service';

export const tasksRouter = Router();

// GET all tasks
tasksRouter.get('/', (req: Request, res: Response) => {
  const tasks = crmService.getTasks();
  res.json({ data: tasks, total: tasks.length });
});

// CREATE task
tasksRouter.post('/', (req: Request, res: Response) => {
  try {
    const newTask = crmService.createTask(req.body);
    res.status(201).json(newTask);
  } catch (err: any) {
    res.status(400).json({ error: 'Failed to create task', message: err.message });
  }
});

// UPDATE task
tasksRouter.put('/:id', (req: Request, res: Response) => {
  const updated = crmService.updateTask(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(updated);
});

// DELETE task
tasksRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = crmService.deleteTask(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json({ success: true, id: req.params.id });
});
