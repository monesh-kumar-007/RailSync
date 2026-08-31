import React from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Edit3,
  Sparkles,
  Clock,
  ArrowUpRight,
  Zap,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useRailSync } from '../../context/RailSyncContext';

export const OverviewView: React.FC = () => {
  const {
    selectedCorridor,
    activePlan,
    approvePlan,
    setIsManualOverrideOpen,
    runMockCPSATOptimization,
    isOptimizing,
    metrics,
    setActiveTab
  } = useRailSync();

  const isApproved = activePlan?.status === 'Approved';

  return (
    <div id="overview-view" className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              Plan Review &amp; Approval
            </h1>
            {isApproved && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                <CheckCircle2 size={13} className="text-emerald-600" />
                APPROVED IN TIMETABLE
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Review AI-proposed block planning for <span className="font-semibold text-slate-700">{selectedCorridor.name}</span> before final execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="overview-manual-override-btn"
            onClick={() => setIsManualOverrideOpen(true)}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-2xs hover:bg-slate-50 transition-all cursor-pointer"
          >
            <Edit3 size={14} className="text-slate-500" />
            Manual Override
          </button>

          <button
            id="overview-approve-plan-btn"
            onClick={() => activePlan && approvePlan(activePlan.id)}
            disabled={isApproved || isOptimizing}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer ${
              isApproved
                ? 'bg-emerald-600 text-white cursor-default opacity-90'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <CheckCircle2 size={15} />
            {isApproved ? 'Plan Approved' : 'Approve Plan'}
          </button>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Safety Checklist & Impact Summary (Col 1-4) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          {/* Safety Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Safety Checklist
                </h2>
                <span className="text-[11px] text-slate-400 font-mono">
                  CP-SAT Constraint Model v4.2
                </span>
              </div>
            </div>

            <ul className="flex flex-col gap-3.5">
              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    No Unsafe Overlaps
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Zero conflicting possessions detected in proposed blocks.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    SLA Satisfied
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Maintenance tasks grouped within required SLA windows.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    Resource Constraints Met
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    Crew (34 pax) &amp; DETC Tower Wagon allocations verified.
                  </p>
                </div>
              </li>

              <li className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={13} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-800">
                    OHE Power Isolation Coordinated
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                    TDMS 25kV traction shutdown synchronized with TMS/SMMS.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          {/* AI Plan Score & Efficiency Summary */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Optimization Metrics
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-semibold border border-indigo-100">
                {activePlan?.id || 'BLK-01'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">Combined Duration</span>
                <p className="text-lg font-bold text-slate-900 mt-0.5">
                  {activePlan?.durationHours || 4.0} Hours
                </p>
                <span className="text-[10px] font-medium text-emerald-600">vs 11.5h unbundled</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[11px] font-medium text-slate-500">Block-Hours Saved</span>
                <p className="text-lg font-bold text-emerald-600 mt-0.5">
                  +{activePlan?.impactAnalysis.blockHoursSaved || 7.5} hrs
                </p>
                <span className="text-[10px] font-medium text-slate-400">Single Shadow Block</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
              <span className="text-xs font-medium text-slate-500">Proposed Time Window</span>
              <span className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-2 py-1 rounded">
                {activePlan?.proposedStart || '01:30'} – {activePlan?.proposedEnd || '05:30'} (IST)
              </span>
            </div>
          </div>
        </div>

        {/* Plan Details & Bundled Tasks Table (Col 5-12) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          {/* Bundled Tasks Table Card */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  Bundled Tasks ({activePlan?.tasks.length || 0} Subsystems Synchronized)
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Joint corridor access for Track, Signal, and Traction engineering teams.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  id="reoptimize-block-btn"
                  onClick={() => runMockCPSATOptimization()}
                  disabled={isOptimizing}
                  className="px-3 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Sparkles size={13} className="text-indigo-600" />
                  {isOptimizing ? 'Solving...' : 'Re-Run CP-SAT Solver'}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-slate-600 font-semibold">
                    <th className="py-2.5 px-3">Task ID</th>
                    <th className="py-2.5 px-3">Department &amp; Work</th>
                    <th className="py-2.5 px-3">Location / Line</th>
                    <th className="py-2.5 px-3">Duration</th>
                    <th className="py-2.5 px-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {(activePlan?.tasks && activePlan.tasks.length > 0
                    ? activePlan.tasks
                    : []
                  ).map((task) => (
                    <tr
                      key={task.id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                        {task.id}
                        <span className="block text-[10px] text-slate-400 font-sans font-normal">
                          P{task.priority} (AI: {task.calculatedAIPriority})
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{task.title}</div>
                        <span
                          className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mt-1 ${
                            task.department === 'TMS'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : task.department === 'SMMS'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {task.department} • {task.deptFullName.split('(')[0]}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        <div className="font-medium">{task.section}</div>
                        <span className="text-[11px] font-mono text-slate-400">
                          {task.trackLine} (KM {task.startKm} - {task.endKm})
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium text-slate-700">
                        {task.durationHours} hrs
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                            task.status === 'Approved'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          }`}
                        >
                          {task.status === 'Approved' ? 'Approved' : 'Optimized'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Subsystem legend & Link to Gantt */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap justify-between items-center text-xs text-slate-500 gap-2">
              <div className="flex items-center gap-4 text-[11px]">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Track (TMS)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span> Signal (SMMS)
                </span>
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Traction (TDMS)
                </span>
              </div>
              <button
                onClick={() => setActiveTab('block_planner')}
                className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1 cursor-pointer text-xs"
              >
                <span>View Corridor Timetable Gantt</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Quick System Performance Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Cumulative Saved
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">
                  {metrics.blockHoursSaved}
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  +{metrics.blockHoursSavedTrendPct}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Block-hours saved this month</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Asset Availability
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">
                  {metrics.assetAvailability}%
                </span>
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5">
                  <TrendingUp size={12} />
                  +{metrics.assetAvailabilityTrendPct}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Corridor operational uptime</span>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Bundled Efficiency
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-slate-900">
                  {metrics.bundledPct}%
                </span>
                <span className="text-xs font-semibold text-indigo-600">
                  {metrics.bundledTasksCount} Tasks
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Multi-department sync rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
