import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  Trash2,
  Edit2,
  Building2,
  TrendingUp,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { TaskModal } from './TaskModal';
import { Task, TaskPriority, TaskStatus } from '../../types';

export const TasksView: React.FC = () => {
  const { tasks, toggleTaskStatus, deleteTask } = useCrm();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.relatedToName && t.relatedToName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'ALL' || t.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = tasks.filter((t) => t.status !== 'Completed').length;
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;

  return (
    <div id="crm-tasks-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Sales Tasks</h1>
            <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2.5 py-0.5 rounded-full">
              {pendingCount} Pending
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage deal milestones, customer follow-up actions, and team assignments
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTask(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-600/20 transition-all active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#161619] p-4 border border-zinc-800 rounded-2xl shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks by title, related entity..."
            className="w-full pl-9 pr-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="ALL">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="px-3 py-2 bg-[#121215] border border-zinc-800 rounded-lg text-xs text-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="ALL">All Priorities</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>
      </div>

      {/* Tasks Table */}
      <div className="bg-[#161619] border border-zinc-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#121215] border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4 w-10">Status</th>
                <th className="py-3.5 px-4">Task Details</th>
                <th className="py-3.5 px-4">Related To</th>
                <th className="py-3.5 px-4">Priority</th>
                <th className="py-3.5 px-4">Due Date</th>
                <th className="py-3.5 px-4">Assigned To</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/80">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-zinc-500">
                    No tasks found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr
                    key={task.id}
                    className={`hover:bg-[#1C1C20] transition-colors ${
                      task.status === 'Completed' ? 'opacity-60 bg-black/20' : ''
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <input
                        type="checkbox"
                        checked={task.status === 'Completed'}
                        onChange={() => toggleTaskStatus(task.id)}
                        className="w-4 h-4 accent-blue-600 rounded cursor-pointer bg-zinc-800 border-zinc-700"
                      />
                    </td>

                    <td className="py-3.5 px-4">
                      <div
                        className={`font-semibold text-zinc-100 ${
                          task.status === 'Completed' ? 'line-through text-zinc-500' : ''
                        }`}
                      >
                        {task.title}
                      </div>
                      {task.description && (
                        <div className="text-[11px] text-zinc-400 mt-0.5 line-clamp-1">
                          {task.description}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      {task.relatedToName ? (
                        <span className="font-medium flex items-center gap-1 text-zinc-200">
                          {task.relatedToType === 'Account' && <Building2 className="w-3 h-3 text-zinc-400" />}
                          {task.relatedToType === 'Opportunity' && <TrendingUp className="w-3 h-3 text-zinc-400" />}
                          <span>{task.relatedToName}</span>
                        </span>
                      ) : (
                        <span className="text-zinc-500">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          task.priority === 'High'
                            ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            : task.priority === 'Medium'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                            : 'bg-zinc-800 text-zinc-300 border-zinc-700'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300 whitespace-nowrap">
                      {task.dueDate}
                    </td>

                    <td className="py-3.5 px-4 text-zinc-300">
                      {task.assignedToName}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setEditingTask(task);
                            setIsModalOpen(true);
                          }}
                          className="p-1 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="p-1 text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-md transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />
    </div>
  );
};
