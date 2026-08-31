import React from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync } from '../../context/RailSyncContext';
import { DEFECT_CATALOG } from '../../data/mockData';

export const AIPrioritizationView: React.FC = () => {
  const {
    aiParams,
    setAIParams,
    maintenanceRequests,
    runMockCPSATOptimization,
    isOptimizing
  } = useRailSync();

  // Sort maintenance requests by calculated AI Priority score in descending order
  const sortedRequests = [...maintenanceRequests].sort(
    (a, b) => b.calculatedAIPriority - a.calculatedAIPriority
  );

  const toggleDefectFocus = (defectId: string) => {
    setAIParams((prev) => ({
      ...prev,
      defectFocus: prev.defectFocus.includes(defectId)
        ? prev.defectFocus.filter((d) => d !== defectId)
        : [...prev.defectFocus, defectId]
    }));
  };

  return (
    <div id="ai-prioritization-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            AI Defect Prioritization &amp; Severity Lab
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Multi-factor scoring engine evaluating track ultrasonic flaws, point failures, and catenary sag.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => runMockCPSATOptimization()}
            disabled={isOptimizing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50"
          >
            <Icon name="auto_awesome" size={15} className={isOptimizing ? 'animate-spin' : ''} />
            {isOptimizing ? 'Optimizing...' : 'Re-Rank & Bundle Blocks'}
          </button>
        </div>
      </div>

      {/* Simulator Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Sliders & Formula Breakdown (Col 1-5) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Criticality Slider Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Defect Severity Sensitivity Slider
              </span>
              <span className="text-xl font-bold font-mono text-indigo-600">
                {aiParams.criticalitySlider.toFixed(1)} / 10.0
              </span>
            </div>

            {/* Slider input */}
            <div className="space-y-2">
              <input
                id="criticality-slider"
                type="range"
                min="0.0"
                max="10.0"
                step="0.1"
                value={aiParams.criticalitySlider}
                onChange={(e) =>
                  setAIParams((prev) => ({
                    ...prev,
                    criticalitySlider: parseFloat(e.target.value)
                  }))
                }
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>0.0 (Routine Inspection)</span>
                <span>5.0 (Moderate Wear)</span>
                <span className="text-rose-600 font-bold">10.0 (Immediate Risk)</span>
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Adjusting this slider dynamically scales the base criticality index for all pending TMS, SMMS, and TDMS maintenance orders in real time.
            </p>
          </div>

          {/* Multi-Criteria Weight Tuner */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <Icon name="balance" size={16} className="text-indigo-600" />
              <h2 className="text-sm font-bold text-slate-900">
                Mathematical Objective Weights
              </h2>
            </div>

            {/* Safety Risk Weight */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Safety / Structural Integrity (w_safety)</span>
                <span className="font-mono font-bold text-slate-900">{(aiParams.safetyWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={aiParams.safetyWeight}
                onChange={(e) => setAIParams((prev) => ({ ...prev, safetyWeight: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Traffic Density Weight */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">Traffic Density &amp; Line Speed (w_traffic)</span>
                <span className="font-mono font-bold text-indigo-600">{(aiParams.trafficDensityWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={aiParams.trafficDensityWeight}
                onChange={(e) => setAIParams((prev) => ({ ...prev, trafficDensityWeight: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* SLA Urgency Weight */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-700">SLA Window Deadline (w_sla)</span>
                <span className="font-mono font-bold text-emerald-600">{(aiParams.slaUrgencyWeight * 100).toFixed(0)}%</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="0.8"
                step="0.05"
                value={aiParams.slaUrgencyWeight}
                onChange={(e) => setAIParams((prev) => ({ ...prev, slaUrgencyWeight: parseFloat(e.target.value) }))}
                className="w-full h-2 bg-slate-200 rounded appearance-none cursor-pointer accent-emerald-600"
              />
            </div>

            {/* Live Formula Box */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs font-mono text-slate-800 space-y-1">
              <div className="font-bold text-slate-900">Live Scoring Formulation:</div>
              <div className="text-[11px] text-slate-500 leading-normal">
                Score = ( {aiParams.safetyWeight.toFixed(2)} × Crit + {aiParams.trafficDensityWeight.toFixed(2)} × Traffic + {aiParams.slaUrgencyWeight.toFixed(2)} × SLA ) × (Slider / 8.0)
              </div>
            </div>
          </div>

          {/* Defect Selection Toggles */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
            <h2 className="text-sm font-bold text-slate-900">
              Defect Category Focus
            </h2>
            <div className="space-y-2">
              {DEFECT_CATALOG.map((def) => {
                const isSelected = aiParams.defectFocus.includes(def.id);
                return (
                  <div
                    key={def.id}
                    onClick={() => toggleDefectFocus(def.id)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-200 ring-1 ring-indigo-200'
                        : 'bg-slate-50/60 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {isSelected ? (
                        <Icon name="check_box" size={18} className="text-indigo-600 shrink-0" />
                      ) : (
                        <Icon name="check_box_outline_blank" size={18} className="text-slate-400 shrink-0" />
                      )}
                      <div>
                        <span className="text-xs font-semibold text-slate-900 block">
                          {def.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {def.department} • Default Severity: {def.defaultCriticality}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-bold text-indigo-600">
                      {def.standardDuration}h
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Ranked Queue Table (Col 6-12) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Dynamically Re-Ranked Maintenance Queue
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Items dynamically sorted by computed AI Priority score in real time.
                </p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 font-mono font-semibold text-slate-700">
                {sortedRequests.length} Active Items
              </span>
            </div>

            <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Rank &amp; ID</th>
                    <th className="py-2.5 px-3">Title / Subsystem</th>
                    <th className="py-2.5 px-3">Section</th>
                    <th className="py-2.5 px-3">AI Score</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {sortedRequests.map((req, idx) => (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              idx === 0
                                ? 'bg-rose-500 text-white'
                                : idx === 1
                                ? 'bg-amber-500 text-white'
                                : idx === 2
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            #{idx + 1}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {req.id}
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900 leading-snug">{req.title}</div>
                        <span
                          className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${
                            req.department === 'TMS'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : req.department === 'SMMS'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {req.department}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-slate-600">
                        <div>{req.section}</div>
                        <span className="text-[10px] font-mono text-slate-400">{req.trackLine}</span>
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/60">
                            <div
                              className={`h-full transition-all duration-300 ${
                                req.calculatedAIPriority > 85
                                  ? 'bg-rose-500'
                                  : req.calculatedAIPriority > 70
                                  ? 'bg-amber-500'
                                  : 'bg-indigo-600'
                              }`}
                              style={{ width: `${Math.min(100, req.calculatedAIPriority)}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {req.calculatedAIPriority}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400 block mt-0.5">
                          {req.calculatedAIPriority > 85
                            ? 'CRITICAL (P1)'
                            : req.calculatedAIPriority > 70
                            ? 'ELEVATED (P2)'
                            : 'ROUTINE (P3)'}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold uppercase border ${
                            req.status === 'Optimized' || req.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
