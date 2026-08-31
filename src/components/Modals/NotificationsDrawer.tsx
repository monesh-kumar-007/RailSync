import React from 'react';
import { Bell, X, AlertTriangle, Sparkles, Check } from 'lucide-react';
import { useRailSync } from '../../context/RailSyncContext';

export const NotificationsDrawer: React.FC = () => {
  const {
    isNotificationDrawerOpen,
    setIsNotificationDrawerOpen,
    liveAlerts,
    dismissAlert,
    triggerEmergencyReoptimization
  } = useRailSync();

  if (!isNotificationDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationDrawerOpen(false)}
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-slate-200 shadow-2xl p-6 flex flex-col justify-between animate-slide-in-right">
          {/* Header */}
          <div>
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Bell size={20} className="text-indigo-600" />
                <h2 className="text-base font-bold text-slate-900">Divisional Alerts &amp; Telemetry</h2>
              </div>
              <button
                onClick={() => setIsNotificationDrawerOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X size={18} />
              </button>
            </div>

            {/* Notification List */}
            <div className="mt-4 space-y-3 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
              {liveAlerts.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No active operational alerts.
                </div>
              ) : (
                liveAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      alert.resolved
                        ? 'bg-slate-50 border-slate-200 opacity-60'
                        : alert.severity === 'Critical'
                        ? 'bg-rose-50/80 border-rose-200'
                        : alert.severity === 'Warning'
                        ? 'bg-amber-50/80 border-amber-200'
                        : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-900">{alert.title}</span>
                      <span className="font-mono text-[10px] text-slate-400">{alert.timestamp}</span>
                    </div>

                    <p className="text-slate-600 text-[11px]">{alert.message}</p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      Location: {alert.section} • Dept: {alert.department}
                    </div>

                    {!alert.resolved && (
                      <div className="pt-2 border-t border-slate-200/60 flex justify-end gap-2">
                        <button
                          onClick={() => dismissAlert(alert.id)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-50 text-[10px] font-semibold border border-slate-200 text-slate-700 cursor-pointer shadow-2xs"
                        >
                          Acknowledge
                        </button>
                        {alert.requiresReoptimization && (
                          <button
                            onClick={() => {
                              triggerEmergencyReoptimization();
                              setIsNotificationDrawerOpen(false);
                            }}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-semibold cursor-pointer"
                          >
                            Re-Optimize Corridor
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
            <span className="text-[11px] text-emerald-600 font-mono font-medium flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              COA Server: Connected
            </span>
            <button
              onClick={() => setIsNotificationDrawerOpen(false)}
              className="px-4 py-1.5 bg-slate-100 border border-slate-200/80 rounded-lg text-xs font-semibold hover:bg-slate-200 text-slate-700 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
