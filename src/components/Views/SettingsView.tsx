import React from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync } from '../../context/RailSyncContext';

export const SettingsView: React.FC = () => {
  const { showToast } = useRailSync();

  const handleSave = () => {
    showToast('System configuration & CP-SAT solver parameters saved.', 'success');
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div id="settings-view" className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          System Settings &amp; Solver Configuration
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Configure safety constraint thresholds, Indian Railways zone parameters, and CP-SAT solver tuning.
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-5">
        {/* CP-SAT Solver Tuning */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Icon name="tune" size={18} className="text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Optimization Engine Parameters (CP-SAT)</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Solver Time Limit (seconds)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-400 block">Max computational search cutoff for integer solver</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Minimum Safety Headway Buffer (minutes)</label>
              <input
                type="number"
                defaultValue={15}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-400 block">Enforced time gap before and after block possession</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Power Block Grounding Buffer (minutes)</label>
              <input
                type="number"
                defaultValue={20}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
              <span className="text-[11px] text-slate-400 block">OHE discharge rod placement and permit-to-work clearance</span>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Premium Train Protection Strictness</label>
              <select
                defaultValue="strict"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500 font-medium text-xs cursor-pointer"
              >
                <option value="strict">Strict (0 Regulation for Vande Bharat / Rajdhani)</option>
                <option value="balanced">Balanced (Max 15 min regulation allowed)</option>
                <option value="relaxed">Relaxed (Max 30 min regulation allowed)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Divisional Control Persona */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Icon name="domain" size={18} className="text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Divisional Control Assignment</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Active Railway Zone</label>
              <select
                defaultValue="NR"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-indigo-500 font-medium text-xs cursor-pointer"
              >
                <option value="NR">Northern Railway (Delhi Division)</option>
                <option value="NCR">North Central Railway (Prayagraj Division)</option>
                <option value="WR">Western Railway (Mumbai Division)</option>
                <option value="ER">Eastern Railway (Howrah Division)</option>
                <option value="SR">Southern Railway (Chennai Division)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Controller Role</label>
              <input
                type="text"
                defaultValue="Chief Traffic Controller (Co-ordination) & Dy. COM"
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-medium text-xs"
              />
            </div>
          </div>
        </div>

        {/* Prototype Reset & Actions */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="font-bold text-slate-900 text-xs">Reset Simulation State</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Re-initialize all maintenance orders, timetable schedules, and metrics to default values.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Icon name="restart_alt" size={14} />
              Reset to Defaults
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Icon name="save" size={14} />
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
