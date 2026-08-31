import React, { useState } from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync } from '../../context/RailSyncContext';

export const ManualOverrideModal: React.FC = () => {
  const {
    isManualOverrideOpen,
    setIsManualOverrideOpen,
    activePlan,
    manualOverridePlan,
    maintenanceRequests
  } = useRailSync();

  if (!isManualOverrideOpen || !activePlan) return null;

  const [startTime, setStartTime] = useState(activePlan.proposedStart);
  const [endTime, setEndTime] = useState(activePlan.proposedEnd);
  const [trackLine, setTrackLine] = useState(activePlan.trackLine);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(
    activePlan.tasks.map((t) => t.id)
  );

  const toggleTask = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((taskId) => taskId !== id) : [...prev, id]
    );
  };

  const handleApply = () => {
    const startHour = parseInt(startTime.split(':')[0], 10) + parseInt(startTime.split(':')[1], 10) / 60;
    const endHour = parseInt(endTime.split(':')[0], 10) + parseInt(endTime.split(':')[1], 10) / 60;
    const duration = Math.max(1, +(endHour - startHour).toFixed(1));

    const updatedTasks = maintenanceRequests.filter((r) => selectedTaskIds.includes(r.id));

    manualOverridePlan(activePlan.id, {
      proposedStart: startTime,
      proposedEnd: endTime,
      durationHours: duration > 0 ? duration : 4.0,
      trackLine,
      tasks: updatedTasks
    });

    setIsManualOverrideOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-2xl w-full p-6 shadow-2xl space-y-4 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Icon name="edit" size={18} className="text-indigo-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Manual Override: {activePlan.id}</h2>
              <p className="text-xs text-slate-500">
                Adjust AI proposed block duration, shift time windows, or select bundled tasks.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsManualOverrideOpen(false)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            <Icon name="close" size={18} />
          </button>
        </div>

        {/* Time Window Shifting */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">Proposed Start (IST)</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">Proposed End (IST)</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">Track Possession Line</label>
            <select
              value={trackLine}
              onChange={(e) => setTrackLine(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="UP Line">UP Line (Delhi → Kanpur)</option>
              <option value="DN Line">DN Line (Kanpur → Delhi)</option>
              <option value="Both Lines">Both Lines (Full Corridor Block)</option>
            </select>
          </div>
        </div>

        {/* Task Bundling Selector */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-800 block">
            Select Tasks Included in this Shadow Block ({selectedTaskIds.length} Selected)
          </label>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1 border border-slate-200 rounded-lg p-2 bg-slate-50">
            {maintenanceRequests.map((req) => {
              const isChecked = selectedTaskIds.includes(req.id);
              return (
                <div
                  key={req.id}
                  onClick={() => toggleTask(req.id)}
                  className={`flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-colors ${
                    isChecked
                      ? 'bg-indigo-50 border border-indigo-200'
                      : 'bg-white border border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div>
                      <span className="text-xs font-bold text-indigo-700 mr-2 font-mono">{req.id}</span>
                      <span className="text-xs font-medium text-slate-900">{req.title}</span>
                      <span className="text-[10px] text-slate-500 block">
                        {req.department} • {req.section} • {req.durationHours}h
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-indigo-600 font-mono">{req.durationHours} hrs</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Safety Warning Check */}
        <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-900 flex items-center gap-2">
          <Icon name="warning" size={16} className="text-amber-600 shrink-0" />
          <span>
            Manual override bypasses default CP-SAT timetable optimization. Ensure COA Section Controller confirms headway clearance.
          </span>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => setIsManualOverrideOpen(false)}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs shadow-xs cursor-pointer"
          >
            Apply Manual Override
          </button>
        </div>
      </div>
    </div>
  );
};
