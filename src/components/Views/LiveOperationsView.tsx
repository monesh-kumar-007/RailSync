import React from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync } from '../../context/RailSyncContext';

export const LiveOperationsView: React.FC = () => {
  const {
    liveAlerts,
    dismissAlert,
    triggerEmergencyReoptimization,
    recentAuditLogs,
    selectedCorridor,
    isOptimizing
  } = useRailSync();

  const activeAlertsCount = liveAlerts.filter((a) => !a.resolved).length;

  return (
    <div id="live-operations-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Live Operations Control &amp; Dispatch
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time track possession monitors, dynamic conflict alarms, and emergency re-scheduling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => triggerEmergencyReoptimization()}
            disabled={isOptimizing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
          >
            <Icon name="auto_awesome" size={15} className={isOptimizing ? 'animate-spin' : ''} />
            {isOptimizing ? 'Re-optimizing...' : 'Trigger Global AI Re-Optimization'}
          </button>
        </div>
      </div>

      {/* Grid: Alarms on Left, Corridor Status & Logs on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Alarms Panel (Col 1-5) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Icon name="warning" size={16} className="text-amber-500" />
                <h2 className="text-sm font-bold text-slate-900">
                  Active Alarms &amp; Incidents
                </h2>
              </div>
              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                {activeAlertsCount} Unresolved
              </span>
            </div>

            <div className="space-y-3">
              {liveAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border transition-all ${
                    alert.resolved
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : alert.severity === 'Critical'
                      ? 'bg-rose-50/70 border-rose-200'
                      : alert.severity === 'Warning'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        alert.severity === 'Critical'
                          ? 'bg-rose-500 text-white'
                          : alert.severity === 'Warning'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {alert.severity} • {alert.department}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {alert.timestamp}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 mt-2">{alert.title}</h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{alert.message}</p>
                  <span className="text-[10px] font-mono text-indigo-600 mt-1 block">
                    Location: {alert.section}
                  </span>

                  {!alert.resolved && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex justify-end gap-2">
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="px-2.5 py-1 text-[11px] bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-semibold cursor-pointer shadow-2xs"
                      >
                        Acknowledge
                      </button>
                      {alert.requiresReoptimization && (
                        <button
                          onClick={() => triggerEmergencyReoptimization()}
                          className="px-2.5 py-1 text-[11px] bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold cursor-pointer"
                        >
                          Auto Re-Optimize
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section Dispatch Schematic & Audit Logs (Col 6-12) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Corridor Track Schematic Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Live Sectional Occupancy: {selectedCorridor.name}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time electronic interlocking signal states and train block sections.
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-mono font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Live 1-sec Poll
              </span>
            </div>

            {/* Visual Railway Track Schematic */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
              {/* UP Line schematic */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 font-mono mb-1.5">
                  <span className="font-semibold text-slate-700">UP LINE (Delhi → Kanpur)</span>
                  <span>Section 4: MP 12-14 (Auto Block)</span>
                </div>
                <div className="relative h-11 bg-slate-200/80 rounded-lg border border-slate-300 flex items-center px-3">
                  <div className="w-full h-1 bg-slate-400 relative flex items-center justify-between">
                    {/* Track nodes */}
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" title="Signal S-10 (Green)"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" title="Signal S-12 (Green)"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500 ring-2 ring-white" title="Signal S-14 (Caution)"></div>
                    <div className="w-3 h-3 rounded-full bg-rose-500 ring-2 ring-white" title="Signal S-16 (Danger / Block Active)"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" title="Signal S-18 (Green)"></div>
                  </div>

                  {/* Active Train on Track */}
                  <div
                    className="absolute left-[20%] -top-1 bg-indigo-700 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-xs flex items-center gap-1"
                    title="12302 Howrah Rajdhani - 118 km/h"
                  >
                    🚆 12302 (118 km/h)
                  </div>

                  {/* Maintenance Block zone */}
                  <div
                    className="absolute left-[65%] w-[25%] top-1.5 bottom-1.5 bg-amber-500/20 border border-amber-500 rounded flex items-center justify-center text-[10px] font-bold text-amber-900"
                  >
                    ⚠️ Planned Block MP 12-14
                  </div>
                </div>
              </div>

              {/* DN Line schematic */}
              <div>
                <div className="flex justify-between text-xs text-slate-500 font-mono mb-1.5">
                  <span className="font-semibold text-slate-700">DN LINE (Kanpur → Delhi)</span>
                  <span>Section 4: MP 12-14 (Clear Track)</span>
                </div>
                <div className="relative h-11 bg-slate-200/80 rounded-lg border border-slate-300 flex items-center px-3">
                  <div className="w-full h-1 bg-slate-400 relative flex items-center justify-between">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white"></div>
                  </div>

                  <div
                    className="absolute left-[70%] -top-1 bg-indigo-800 text-white px-2 py-0.5 rounded text-[10px] font-bold shadow-xs flex items-center gap-1"
                    title="22436 Vande Bharat - 130 km/h"
                  >
                    🚄 22436 (130 km/h)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Icon name="history" size={16} className="text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900">
                Operations Audit Trail &amp; AI Re-Optimization Log
              </h2>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {recentAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-xs flex justify-between items-start"
                >
                  <div>
                    <span className="font-bold text-indigo-700 block">{log.action}</span>
                    <span className="text-[11px] text-slate-600">{log.impact}</span>
                    <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                      Operator: {log.user}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {log.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
