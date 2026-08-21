import React, { useState, useEffect } from 'react';
import { X, CheckSquare, Calendar, Building2, TrendingUp, User as UserIcon } from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { Task, TaskPriority, TaskStatus } from '../../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, taskToEdit }) => {
  const { accounts, opportunities, contacts, currentUser, addTask, updateTask } = useCrm();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Medium');
  const [status, setStatus] = useState<TaskStatus>('Pending');
  const [relatedType, setRelatedType] = useState<'Account' | 'Opportunity' | 'Contact' | 'None'>('Opportunity');
  const [relatedId, setRelatedId] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setStatus(taskToEdit.status);
      setRelatedType((taskToEdit.relatedToType as any) || 'None');
      setRelatedId(taskToEdit.relatedToId || '');
    } else {
      setTitle('');
      setDescription('');
      const d = new Date();
      d.setDate(d.getDate() + 3);
      setDueDate(d.toISOString().split('T')[0]);
      setPriority('Medium');
      setStatus('Pending');
      setRelatedType('Opportunity');
      setRelatedId(opportunities[0]?.id || '');
    }
  }, [taskToEdit, isOpen, opportunities]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let relatedName = '';
    if (relatedType === 'Account') {
      relatedName = accounts.find((a) => a.id === relatedId)?.name || '';
    } else if (relatedType === 'Opportunity') {
      relatedName = opportunities.find((o) => o.id === relatedId)?.name || '';
    } else if (relatedType === 'Contact') {
      const c = contacts.find((cnt) => cnt.id === relatedId);
      relatedName = c ? `${c.firstName} ${c.lastName}` : '';
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      dueDate: dueDate || new Date().toISOString().split('T')[0],
      priority,
      status,
      assignedToId: currentUser?.id || 'usr-1',
      assignedToName: currentUser?.name || 'Janaki Pawar',
      relatedToType: relatedType !== 'None' ? relatedType : undefined,
      relatedToId: relatedType !== 'None' ? relatedId : undefined,
      relatedToName: relatedType !== 'None' ? relatedName : undefined,
    };

    if (taskToEdit) {
      updateTask(taskToEdit.id, payload);
    } else {
      addTask(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-[#161619] rounded-2xl border border-zinc-800 shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-[#121215]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-100">
                {taskToEdit ? 'Edit Task' : 'New Sales Task'}
              </h3>
              <p className="text-xs text-zinc-400">Track action items and milestone follow-ups</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-zinc-300">
          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Prepare security compliance response"
              className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Due Date *</label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-zinc-300 mb-1">Related Object</label>
              <select
                value={relatedType}
                onChange={(e) => {
                  setRelatedType(e.target.value as any);
                  setRelatedId('');
                }}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="Opportunity">Opportunity</option>
                <option value="Account">Account</option>
                <option value="Contact">Contact</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          {relatedType !== 'None' && (
            <div>
              <label className="block font-semibold text-zinc-300 mb-1">
                Link to {relatedType}
              </label>
              <select
                value={relatedId}
                onChange={(e) => setRelatedId(e.target.value)}
                className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              >
                <option value="">-- Select {relatedType} --</option>
                {relatedType === 'Opportunity' &&
                  opportunities.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name} (${o.amount.toLocaleString()})
                    </option>
                  ))}
                {relatedType === 'Account' &&
                  accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                {relatedType === 'Contact' &&
                  contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.firstName} {c.lastName} ({c.accountName})
                    </option>
                  ))}
              </select>
            </div>
          )}

          <div>
            <label className="block font-semibold text-zinc-300 mb-1">Description / Notes</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Additional details regarding this task..."
              className="w-full px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-zinc-100 placeholder:text-zinc-600 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-all active:scale-[0.98] cursor-pointer"
            >
              {taskToEdit ? 'Save Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
