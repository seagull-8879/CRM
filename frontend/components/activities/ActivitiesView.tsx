import React, { useState } from 'react';
import {
  Clock,
  Search,
  Mail,
  Phone,
  Calendar,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useCrm } from '../../context/CrmContext';

export const ActivitiesView: React.FC = () => {
  const { activities } = useCrm();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const filteredActivities = activities.filter((act) => {
    const matchSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.relatedToName && act.relatedToName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      act.userName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchType = typeFilter === 'ALL' || act.type === typeFilter;
    return matchSearch && matchType;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'Email':
        return <Mail className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />;
      case 'Call':
        return <Phone className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'Meeting':
        return <Calendar className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      case 'Stage Change':
        return <TrendingUp className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'OCR Card Scan':
        return <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  return (
    <div id="crm-activities-view" className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-[#111625] p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-xs transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">Audit Trail & Activity Log</h1>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-0.5 rounded-full">
              {activities.length} Events Logged
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Immutable timeline of sales communications, deal stage advancements, OCR card ingestions, and record modifications
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#111625] p-4 border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs flex flex-wrap items-center gap-3 transition-colors">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by keyword, user, or object..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 bg-slate-50 dark:bg-[#0E121E] border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
        >
          <option value="ALL">All Activity Types</option>
          <option value="Email">Emails</option>
          <option value="Call">Phone Calls</option>
          <option value="Meeting">Meetings</option>
          <option value="Stage Change">Deal Stage Changes</option>
          <option value="OCR Card Scan">OCR Card Scans</option>
          <option value="Note">Notes</option>
        </select>
      </div>

      {/* Timeline Stream */}
      <div className="bg-white dark:bg-[#111625] border border-slate-200 dark:border-slate-800/80 rounded-2xl shadow-xs p-6 transition-colors">
        <div className="space-y-6 relative before:absolute before:left-5 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
          {filteredActivities.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No audit logs found for the selected criteria.
            </div>
          ) : (
            filteredActivities.map((act) => (
              <div key={act.id} className="relative pl-12 flex flex-col sm:flex-row sm:items-start justify-between gap-3 group">
                {/* Node icon */}
                <div className="absolute left-2.5 top-0 w-6 h-6 rounded-full bg-white dark:bg-[#111625] border-2 border-slate-300 dark:border-slate-700 group-hover:border-purple-500 flex items-center justify-center -translate-x-1/2 transition-colors shadow-2xs">
                  {getActivityIcon(act.type)}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-xs">{act.title}</span>
                    <span className="text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2 py-0.2 rounded-md">
                      {act.type}
                    </span>
                    {act.relatedToName && (
                      <span className="text-[10px] text-purple-600 dark:text-purple-400 font-medium bg-purple-500/10 border border-purple-500/20 px-2 py-0.2 rounded-md">
                        {act.relatedToType}: {act.relatedToName}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-400 whitespace-pre-line leading-relaxed">
                    {act.description}
                  </p>
                </div>

                <div className="text-right shrink-0 text-[11px] text-slate-400 sm:pt-0.5">
                  <div className="font-medium text-slate-700 dark:text-slate-300">{act.userName}</div>
                  <div>{new Date(act.timestamp).toLocaleString()}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
