import React from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync, ActiveTab } from '../../context/RailSyncContext';

interface NavItem {
  id: ActiveTab;
  label: string;
  iconName: string;
  badge?: number;
}

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    maintenanceRequests,
    liveAlerts,
    setIsNotificationsDrawerOpen
  } = useRailSync();

  const pendingCount = maintenanceRequests.filter((r) => r.status === 'Pending').length;
  const unreadAlertsCount = liveAlerts.filter((a) => !a.resolved).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', iconName: 'dashboard' },
    { id: 'block_planner', label: 'Block Planner', iconName: 'calendar_month' },
    {
      id: 'maintenance_requests',
      label: 'Maintenance Requests',
      iconName: 'build',
      badge: pendingCount > 0 ? pendingCount : undefined
    },
    { id: 'ai_prioritization', label: 'AI Prioritization', iconName: 'psychology' },
    { id: 'corridor_schedule', label: 'Corridor Schedule', iconName: 'alt_route' },
    { id: 'what_if_simulator', label: 'What-If Simulator', iconName: 'memory' },
    {
      id: 'live_operations',
      label: 'Live Operations',
      iconName: 'monitoring',
      badge: unreadAlertsCount > 0 ? unreadAlertsCount : undefined
    },
    { id: 'analytics', label: 'Analytics', iconName: 'bar_chart' },
    { id: 'settings', label: 'Settings', iconName: 'settings' }
  ];

  return (
    <aside
      id="main-sidebar"
      className="fixed left-0 top-0 bottom-0 w-[260px] bg-slate-950 text-slate-100 border-r border-slate-800 flex flex-col z-30 select-none shadow-xl"
    >
      {/* Brand Header */}
      <div className="flex items-center px-5 h-16 border-b border-slate-800/80 gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
          <Icon name="train" size={20} />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-base text-white tracking-tight">RailSync</span>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-700/50">
              IR-AI
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-normal leading-tight">
            AI-Driven Block Planning
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto py-4 px-3 flex flex-col gap-1">
        <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Corridor Management
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-150 cursor-pointer ${
                isActive
                  ? 'bg-slate-800 text-white font-semibold shadow-inner border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/90'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  name={item.iconName}
                  size={18}
                  className={`transition-colors ${
                    isActive ? 'text-emerald-400' : 'text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>

              {item.badge !== undefined && item.badge > 0 && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    item.id === 'live_operations'
                      ? 'bg-rose-500 text-white animate-pulse'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Profile Footer */}
      <div className="border-t border-slate-800/90 p-3 flex flex-col gap-1.5 bg-slate-950/80">
        <button
          id="sidebar-notifications-btn"
          onClick={() => setIsNotificationsDrawerOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Icon name="notifications" size={16} />
            <span>Alerts &amp; SCADA</span>
          </div>
          {unreadAlertsCount > 0 ? (
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              {unreadAlertsCount} active
            </span>
          ) : (
            <span className="text-[10px] text-slate-500">Live</span>
          )}
        </button>

        <div
          id="sidebar-profile-card"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-slate-900/90 border border-slate-800/80"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-900/60 border border-indigo-700/60 flex items-center justify-center text-indigo-300 font-bold text-xs">
            NR
          </div>
          <div className="flex flex-col min-w-0 text-left">
            <span className="text-xs font-semibold text-slate-200 truncate">
              NR Division Control
            </span>
            <span className="text-[10px] text-slate-400 truncate">
              Chief Traffic Controller
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};
