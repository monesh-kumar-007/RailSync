import React, { useState } from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync } from '../../context/RailSyncContext';

export const BlockPlannerView: React.FC = () => {
  const {
    corridors,
    selectedCorridorId,
    setSelectedCorridorId,
    selectedCorridor,
    bundledPlans,
    activePlan,
    runMockCPSATOptimization,
    isOptimizing,
    approvePlan,
    setIsManualOverrideOpen,
    trainSchedules
  } = useRailSync();

  const [selectedTrackLine, setSelectedTrackLine] = useState<'UP Line' | 'DN Line' | 'Both'>('UP Line');
  const [activeTabSub, setActiveTabSub] = useState<'gantt' | 'matrix' | 'constraints'>('gantt');

  const hours = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];

  return (
    <div id="block-planner-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Intelligent Block Planner &amp; Bundling
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            CP-SAT constraint programming engine synchronizing Track, Signal, and Traction possessions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="planner-optimize-btn"
            onClick={() => runMockCPSATOptimization()}
            disabled={isOptimizing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <Icon name="auto_awesome" size={15} className={isOptimizing ? 'animate-spin' : ''} />
            {isOptimizing ? 'Running CP-SAT Solver...' : 'Generate Optimal Block'}
          </button>

          <button
            id="planner-override-btn"
            onClick={() => setIsManualOverrideOpen(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <Icon name="tune" size={15} className="text-slate-500" />
            Manual Override
          </button>
        </div>
      </div>

      {/* Control Bar: Corridor Selector, Track Filter, Sub-view Tabs */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Corridor:
            </span>
            <select
              id="block-corridor-select"
              value={selectedCorridorId}
              onChange={(e) => setSelectedCorridorId(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              {corridors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.totalKm} km)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            {(['UP Line', 'DN Line', 'Both'] as const).map((line) => (
              <button
                key={line}
                onClick={() => setSelectedTrackLine(line)}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                  selectedTrackLine === line
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {line}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            <button
              onClick={() => setActiveTabSub('gantt')}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                activeTabSub === 'gantt'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Corridor Gantt
            </button>
            <button
              onClick={() => setActiveTabSub('matrix')}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                activeTabSub === 'matrix'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Bundling Matrix
            </button>
            <button
              onClick={() => setActiveTabSub('constraints')}
              className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                activeTabSub === 'constraints'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Safety Rules (CP-SAT)
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area based on sub-tab */}
      {activeTabSub === 'gantt' && (
        <div className="space-y-4">
          {/* Gantt Timeline Container */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  24-Hour Corridor Possession &amp; Timetable Timeline
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Shadow block window placed between 01:30 and 05:30 to minimize passenger train regulation.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-emerald-600"></span> AI Shadow Block (Bundled)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-indigo-600"></span> Passenger Express
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-slate-500"></span> Freight Rake
                </span>
              </div>
            </div>

            {/* Time Axis */}
            <div className="border-b border-slate-200 pb-2 grid grid-cols-12 text-center font-mono text-[11px] text-slate-400 font-semibold">
              {hours.map((h, i) => (
                <div key={i} className="border-r border-slate-100 last:border-r-0">
                  {h}
                </div>
              ))}
            </div>

            {/* Track Lanes */}
            <div className="space-y-4 pt-4">
              {/* UP Line Lane */}
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span> UP Track (Delhi → Kanpur Central)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">130 km/h Rated</span>
                </div>

                <div className="relative h-16 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                  {/* Grid hour lines */}
                  <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                    {hours.map((_, i) => (
                      <div key={i} className="border-r border-slate-200/60 h-full"></div>
                    ))}
                  </div>

                  {/* Bundled Shadow Block (01:30 - 05:30) */}
                  <div
                    className="absolute top-1.5 bottom-1.5 left-[6.25%] w-[16.6%] bg-emerald-600 hover:bg-emerald-700 rounded-md text-white p-1 text-[11px] font-bold flex flex-col justify-center items-center shadow-xs transition-all cursor-pointer z-10 border border-emerald-400"
                    title="Bundled Block: TMS (Track) + SMMS (Signal) + TDMS (OHE) synchronized"
                    onClick={() => setIsManualOverrideOpen(true)}
                  >
                    <span>⚡ AI BUNDLED BLOCK (4h)</span>
                    <span className="text-[9px] opacity-90 font-normal">3 Depts • MP 12-14</span>
                  </div>

                  {/* Train Slots */}
                  <div
                    className="absolute top-1.5 bottom-1.5 left-[3.1%] w-[14.5%] bg-indigo-700/85 rounded text-white px-2 py-0.5 text-[10px] flex items-center justify-between border border-indigo-400/50"
                    title="12302 Howrah Rajdhani - Regulated via loop line siding"
                  >
                    <span className="truncate">12302 Rajdhani</span>
                  </div>

                  <div
                    className="absolute top-1.5 bottom-1.5 left-[8.3%] w-[18.7%] bg-slate-600/80 rounded text-white px-2 py-0.5 text-[10px] flex items-center justify-between border border-slate-400/50"
                    title="Freight Container CONTR-99821 - Held at Tundla Junction"
                  >
                    <span className="truncate">Freight CONTR</span>
                  </div>

                  <div
                    className="absolute top-1.5 bottom-1.5 left-[25%] w-[11.4%] bg-indigo-800 rounded text-white px-2 py-0.5 text-[10px] font-bold flex items-center justify-center border border-indigo-400"
                    title="22436 Vande Bharat Express - Clear Line, 0 Delay"
                  >
                    <span className="truncate">22436 Vande Bharat</span>
                  </div>

                  <div
                    className="absolute top-1.5 bottom-1.5 left-[69.4%] w-[14.5%] bg-indigo-700/85 rounded text-white px-2 py-0.5 text-[10px] flex items-center justify-center border border-indigo-400/50"
                    title="12424 Dibrugarh Rajdhani"
                  >
                    <span className="truncate">12424 Rajdhani</span>
                  </div>
                </div>
              </div>

              {/* DN Line Lane */}
              <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span> DN Track (Kanpur → New Delhi)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">130 km/h Rated</span>
                </div>

                <div className="relative h-16 bg-slate-100 rounded-lg border border-slate-200 overflow-hidden">
                  <div className="absolute inset-0 grid grid-cols-12 pointer-events-none">
                    {hours.map((_, i) => (
                      <div key={i} className="border-r border-slate-200/60 h-full"></div>
                    ))}
                  </div>

                  <div className="absolute top-1.5 bottom-1.5 left-[27%] w-[13.8%] bg-indigo-700/85 rounded text-white px-2 py-0.5 text-[10px] flex items-center justify-center border border-indigo-400/50">
                    <span className="truncate">12004 Shatabdi</span>
                  </div>

                  <div className="absolute top-1.5 bottom-1.5 left-[4.8%] w-[16%] bg-sky-800/85 rounded text-white px-2 py-0.5 text-[10px] flex items-center justify-center border border-sky-400/50">
                    <span className="truncate">12876 Neelachal SF</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Footer */}
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-3">
              <div className="text-xs text-slate-500">
                <strong className="text-slate-800">Selected Block Window:</strong> 01:30 to 05:30 IST ({activePlan?.durationHours || 4.0} hrs) • Section: {activePlan?.section || 'Sec 4, MP 12-14'}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsManualOverrideOpen(true)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Adjust Block Slot
                </button>
                <button
                  onClick={() => activePlan && approvePlan(activePlan.id)}
                  className="px-3.5 py-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
                >
                  Approve &amp; Push to COA Timetable
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTabSub === 'matrix' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Multi-Department Compatibility Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Evaluates whether Track (TMS), Signal (SMMS), and Traction (TDMS) works can safely share the same corridor section.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-lg">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="p-3">Department Work</th>
                  <th className="p-3">TMS (Track Tamping/USFD)</th>
                  <th className="p-3">SMMS (Point/Signals)</th>
                  <th className="p-3">TDMS (OHE 25kV Shutdown)</th>
                  <th className="p-3">Bundling Rule</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">TMS (Track)</td>
                  <td className="p-3 text-slate-400">—</td>
                  <td className="p-3 text-emerald-600 font-bold">✓ Compatible</td>
                  <td className="p-3 text-emerald-600 font-bold">✓ Compatible</td>
                  <td className="p-3 text-xs text-slate-500">Can co-exist if crew zones separated by 500m</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">SMMS (Signals)</td>
                  <td className="p-3 text-emerald-600 font-bold">✓ Compatible</td>
                  <td className="p-3 text-slate-400">—</td>
                  <td className="p-3 text-emerald-600 font-bold">✓ Compatible</td>
                  <td className="p-3 text-xs text-slate-500">Requires interlocking bypass during point testing</td>
                </tr>
                <tr className="hover:bg-slate-50/80">
                  <td className="p-3 font-semibold text-slate-900">TDMS (Traction)</td>
                  <td className="p-3 text-emerald-600 font-bold">✓ Compatible</td>
                  <td className="p-3 text-emerald-600 font-bold">✓ Compatible</td>
                  <td className="p-3 text-slate-400">—</td>
                  <td className="p-3 text-xs text-slate-500">Requires 25kV power cut &amp; discharge grounding poles</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTabSub === 'constraints' && (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              CP-SAT Constraint Satisfaction Model Rules
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mathematical formulations enforced by the optimization solver to guarantee Indian Railways safety standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Icon name="security" size={16} className="text-emerald-600" />
                Hard Constraint 1: Zero Spatial Overlap Conflict
              </span>
              <p className="text-xs text-slate-600 mt-2 font-mono bg-white p-2.5 rounded border border-slate-200">
                ∀ i, j ∈ Requests, i ≠ j: Section(i) = Section(j) ⟹ [Start_i, End_i] ∩ [Start_j, End_j] = ∅ (unless verified bundle compatible).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Icon name="speed" size={16} className="text-indigo-600" />
                Hard Constraint 2: Premium Train Headway Protection
              </span>
              <p className="text-xs text-slate-600 mt-2 font-mono bg-white p-2.5 rounded border border-slate-200">
                Vande Bharat &amp; Rajdhani services (Tier 1 &amp; 2) cannot be subjected to block possession delays exceeding 15 minutes.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Icon name="bolt" size={16} className="text-amber-600" />
                Hard Constraint 3: Traction Power Isolation Window
              </span>
              <p className="text-xs text-slate-600 mt-2 font-mono bg-white p-2.5 rounded border border-slate-200">
                Power Block Duration(TDMS) must envelope all catenary adjacent operations with a minimum 15-minute grounding buffer.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Icon name="tune" size={16} className="text-purple-600" />
                Objective Function: Multi-Criteria Minimization
              </span>
              <p className="text-xs text-slate-600 mt-2 font-mono bg-white p-2.5 rounded border border-slate-200">
                min( w1 · ∑ Delay(Train_k) + w2 · BlockHours - w3 · BundledTasksCount )
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
