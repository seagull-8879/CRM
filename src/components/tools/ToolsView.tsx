import React, { useState } from 'react';
import {
  Wrench,
  CheckSquare,
  Clock,
  ScanLine,
  Mail,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';
import { TasksView } from '../tasks/TasksView';
import { ActivitiesView } from '../activities/ActivitiesView';

export const ToolsView: React.FC = () => {
  const { setIsOcrScannerOpen, setIsEmailComposerOpen, setEmailComposerData, tasks, activities } = useCrm();
  const [subTab, setSubTab] = useState<'tasks' | 'activities'>('tasks');

  const pendingTasksCount = tasks.filter((t) => t.status !== 'Completed').length;

  return (
    <div id="crm-tools-view" className="space-y-6">
      {/* Sub-Header / Tool Switcher */}
      <div className="bg-[#121215] border-b border-zinc-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-zinc-100 tracking-tight flex items-center gap-2">
                <Wrench className="w-5 h-5 text-blue-400" />
                <span>Sales Tools & Operations</span>
              </h1>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Task management, audit timeline, and multimodal sales intelligence
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Quick Action: Scan Visiting Card */}
            <button
              onClick={() => setIsOcrScannerOpen(true)}
              className="px-3.5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>Scan Visiting Card</span>
              <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.2 rounded font-semibold ml-1">
                AI
              </span>
            </button>

            {/* Quick Action: AI Email Composer */}
            <button
              onClick={() => {
                setEmailComposerData(null);
                setIsEmailComposerOpen(true);
              }}
              className="px-3.5 py-2 bg-[#18181B] hover:bg-[#202024] text-zinc-200 border border-zinc-700 hover:border-zinc-600 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>Smart Email Composer</span>
              <Sparkles className="w-3 h-3 text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="max-w-7xl mx-auto flex items-center gap-2 mt-4">
          <button
            onClick={() => setSubTab('tasks')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'tasks'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <CheckSquare className="w-4 h-4" />
            <span>Sales Tasks</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                subTab === 'tasks' ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {pendingTasksCount}
            </span>
          </button>

          <button
            onClick={() => setSubTab('activities')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer ${
              subTab === 'activities'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Audit Trail & Activity Log</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                subTab === 'activities' ? 'bg-white/20 text-white' : 'bg-zinc-800 text-zinc-400'
              }`}
            >
              {activities.length}
            </span>
          </button>
        </div>
      </div>

      {/* Main SubTab Content */}
      <div>
        {subTab === 'tasks' && <TasksView />}
        {subTab === 'activities' && <ActivitiesView />}
      </div>
    </div>
  );
};
