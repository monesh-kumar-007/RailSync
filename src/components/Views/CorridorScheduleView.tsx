import React, { useState } from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync } from '../../context/RailSyncContext';
import { TrainSchedule } from '../../types';

export const CorridorScheduleView: React.FC = () => {
  const {
    corridors,
    selectedCorridorId,
    setSelectedCorridorId,
    trainSchedules,
    updateTrainSchedule,
    showToast
  } = useRailSync();

  const [directionFilter, setDirectionFilter] = useState<'ALL' | 'UP' | 'DN'>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  const filteredTrains = trainSchedules.filter((t) => {
    if (t.corridorId !== selectedCorridorId) return false;
    if (directionFilter !== 'ALL' && t.direction !== directionFilter) return false;
    if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;
    return true;
  });

  const handleAdjustDelay = (train: TrainSchedule, delta: number) => {
    const newDelay = Math.max(0, train.delayMinutes + delta);
    const newStatus = newDelay === 0 ? 'On-Time' : newDelay > 15 ? 'Delayed' : 'Regulated';
    updateTrainSchedule(train.id, {
      delayMinutes: newDelay,
      status: newStatus
    });
    showToast(`${train.trainNumber} delay updated: ${newDelay}m (${newStatus})`, 'info');
  };

  return (
    <div id="corridor-schedule-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Corridor Timetable &amp; Train Master (COA)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sectional paths, headways, and real-time train delay regulation across key trunk routes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            id="timetable-corridor-select"
            value={selectedCorridorId}
            onChange={(e) => setSelectedCorridorId(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 shadow-2xs cursor-pointer"
          >
            {corridors.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.totalKm} km)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Headway & Path Gap Analysis Banner */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
              <Icon name="hourglass_top" size={14} />
              Optimal Maintenance Headway Window Detected
            </span>
            <h2 className="text-base font-bold text-slate-900">
              01:30 – 05:30 IST (4.0 Hours Clear Slot on UP Line)
            </h2>
            <p className="text-xs text-slate-500 max-w-2xl">
              Low passenger train density between Tundla and Etawah allows synchronized Track, Signal, and OHE possessions with minimal freight diversion.
            </p>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block font-medium">Corridor Line Capacity</span>
              <span className="text-sm font-bold text-slate-900">138% (High Congestion)</span>
            </div>
            <div className="w-10 h-10 rounded-full border-3 border-indigo-600 border-t-amber-500 flex items-center justify-center font-bold text-xs text-slate-900">
              88%
            </div>
          </div>
        </div>
      </div>

      {/* Train Schedule Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-100 pb-4">
          {/* Direction and Type Filters */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Direction:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
              {(['ALL', 'UP', 'DN'] as const).map((dir) => (
                <button
                  key={dir}
                  onClick={() => setDirectionFilter(dir)}
                  className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                    directionFilter === dir
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {dir === 'ALL' ? 'All Directions' : `${dir} Line`}
                </button>
              ))}
            </div>

            <div className="h-4 w-px bg-slate-200 mx-1"></div>

            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Type:</span>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
              {(['ALL', 'Vande Bharat', 'Rajdhani / Shatabdi', 'Mail / Express', 'Freight Container'] as const).map((typ) => (
                <button
                  key={typ}
                  onClick={() => setTypeFilter(typ)}
                  className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                    typeFilter === typ
                      ? 'bg-white text-indigo-700 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {typ}
                </button>
              ))}
            </div>
          </div>

          <span className="text-xs font-mono text-slate-400 font-semibold">
            Showing {filteredTrains.length} Services
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Train No &amp; Name</th>
                <th className="py-2.5 px-3">Category &amp; Priority</th>
                <th className="py-2.5 px-3">Direction</th>
                <th className="py-2.5 px-3">Slot (Entry → Exit)</th>
                <th className="py-2.5 px-3">Speed</th>
                <th className="py-2.5 px-3">Status &amp; Delay</th>
                <th className="py-2.5 px-3 text-right">Adjust Delay</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredTrains.map((train) => (
                <tr
                  key={train.id}
                  className="hover:bg-slate-50/80 transition-colors"
                >
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-indigo-700 text-xs">
                      {train.trainNumber}
                    </span>
                    <div className="text-xs font-semibold text-slate-900">{train.trainName}</div>
                  </td>

                  <td className="py-3 px-3">
                    <span className="text-xs font-medium text-slate-800 block">{train.type}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Priority Tier {train.priorityTier}
                    </span>
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        train.direction === 'UP'
                          ? 'bg-blue-50 text-blue-800 border border-blue-200'
                          : 'bg-indigo-50 text-indigo-800 border border-indigo-200'
                      }`}
                    >
                      {train.direction} Line
                    </span>
                  </td>

                  <td className="py-3 px-3 font-mono text-xs text-slate-800 font-semibold">
                    {train.scheduledEntry} → {train.scheduledExit}
                  </td>

                  <td className="py-3 px-3 font-mono text-xs text-slate-500">
                    {train.speedKmph} km/h
                  </td>

                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase border ${
                        train.status === 'On-Time'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : train.status === 'Regulated'
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-rose-50 text-rose-700 border-rose-200'
                      }`}
                    >
                      {train.status} {train.delayMinutes > 0 && `(+${train.delayMinutes}m)`}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleAdjustDelay(train, -5)}
                        disabled={train.delayMinutes <= 0}
                        title="Reduce delay by 5m"
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-200 disabled:opacity-30 cursor-pointer"
                      >
                        -5m
                      </button>
                      <button
                        onClick={() => handleAdjustDelay(train, 10)}
                        title="Add delay of 10m"
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded border border-slate-200 cursor-pointer"
                      >
                        +10m
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
