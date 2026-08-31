import React from 'react';
import {
  Search,
  GitBranch,
  Bell,
  Download,
  Settings,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  X
} from 'lucide-react';
import { useRailSync } from '../../context/RailSyncContext';

export const TopAppBar: React.FC = () => {
  const {
    filters,
    setFilters,
    corridors,
    selectedCorridorId,
    setSelectedCorridorId,
    liveAlerts,
    isOptimizing,
    isReoptimizing,
    setIsNotificationsDrawerOpen,
    setIsExportModalOpen,
    setActiveTab
  } = useRailSync();

  const unreadAlerts = liveAlerts.filter((a) => !a.resolved);

  return (
    <header
      id="top-app-bar"
      className="sticky top-0 z-20 h-16 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 flex items-center justify-between shadow-xs select-none"
    >
      {/* Left: Search & Corridor Selector */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Global Search Bar */}
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          />
          <input
            id="global-search-input"
            type="text"
            value={filters.searchQuery}
            onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
            placeholder="Search MR-ID, section, train #..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-100/80 border border-slate-200 rounded-lg text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {filters.searchQuery && (
            <button
              onClick={() => setFilters((prev) => ({ ...prev, searchQuery: '' }))}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Corridor Selector dropdown */}
        <div className="hidden md:flex items-center gap-2 bg-slate-100/90 border border-slate-200/90 px-3 py-1.5 rounded-lg shadow-2xs">
          <GitBranch size={14} className="text-indigo-600" />
          <select
            id="corridor-selector"
            value={selectedCorridorId}
            onChange={(e) => setSelectedCorridorId(e.target.value)}
            className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-none cursor-pointer pr-1"
          >
            {corridors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right: Operational Status and Actions */}
      <div className="flex items-center gap-3">
        {/* Live status badge */}
        <div
          id="system-status-indicator"
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
            isOptimizing || isReoptimizing
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-2xs'
              : unreadAlerts.length > 0
              ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-2xs'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
          }`}
        >
          {isOptimizing || isReoptimizing ? (
            <RefreshCw size={13} className="animate-spin text-indigo-600" />
          ) : unreadAlerts.length > 0 ? (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          ) : (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          )}

          <span className="font-semibold text-[11px] tracking-tight">
            {isOptimizing
              ? 'CP-SAT Solver Solving...'
              : isReoptimizing
              ? 'Emergency Re-Routing...'
              : unreadAlerts.length > 0
              ? `${unreadAlerts.length} Caution Alarms`
              : 'System Operational'}
          </span>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 border-l border-slate-200 pl-3">
          <button
            id="top-notifications-btn"
            onClick={() => setIsNotificationsDrawerOpen(true)}
            title="Telemetry Alarms & Notifications"
            className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Bell size={17} />
            {unreadAlerts.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>

          <button
            id="top-quick-export-btn"
            onClick={() => setIsExportModalOpen(true)}
            title="Export Operations Report"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Download size={17} />
          </button>

          <button
            id="top-settings-btn"
            onClick={() => setActiveTab('settings')}
            title="Settings & Optimization Parameters"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <Settings size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};
