import React, { useState } from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync } from '../../context/RailSyncContext';
import { Department, PriorityLevel, MaintenanceRequest } from '../../types';

export const MaintenanceRequestsView: React.FC = () => {
  const {
    filteredRequests,
    filters,
    setFilters,
    setIsNewRequestModalOpen,
    deleteMaintenanceRequest,
    runMockCPSATOptimization,
    showToast
  } = useRailSync();

  const [selectedReq, setSelectedReq] = useState<MaintenanceRequest | null>(null);

  const tmsCount = filteredRequests.filter((r) => r.department === 'TMS').length;
  const smmsCount = filteredRequests.filter((r) => r.department === 'SMMS').length;
  const tdmsCount = filteredRequests.filter((r) => r.department === 'TDMS').length;

  return (
    <div id="maintenance-requests-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Maintenance Requests (TMS / SMMS / TDMS)
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master repository of track, signaling, and traction maintenance requests across zones.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="new-request-btn"
            onClick={() => setIsNewRequestModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Icon name="add" size={16} />
            Add Maintenance Request
          </button>
        </div>
      </div>

      {/* Subsystem Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          onClick={() => setFilters((prev) => ({ ...prev, department: prev.department === 'TMS' ? 'ALL' : 'TMS' }))}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition-all shadow-xs ${
            filters.department === 'TMS' ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200/90 hover:border-amber-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">TMS (Track Subsystem)</span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Icon name="build" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{tmsCount}</span>
            <span className="text-xs text-slate-500">Active track possessions</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">USFD, Deep Screening, Tamping</span>
        </div>

        <div
          onClick={() => setFilters((prev) => ({ ...prev, department: prev.department === 'SMMS' ? 'ALL' : 'SMMS' }))}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition-all shadow-xs ${
            filters.department === 'SMMS' ? 'border-blue-500 ring-2 ring-blue-500/20' : 'border-slate-200/90 hover:border-blue-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">SMMS (Signal &amp; Telecom)</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Icon name="sensors" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{smmsCount}</span>
            <span className="text-xs text-slate-500">Active signaling jobs</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">Point Machines, Axle Counters, EI</span>
        </div>

        <div
          onClick={() => setFilters((prev) => ({ ...prev, department: prev.department === 'TDMS' ? 'ALL' : 'TDMS' }))}
          className={`bg-white border rounded-xl p-4 cursor-pointer transition-all shadow-xs ${
            filters.department === 'TDMS' ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/90 hover:border-emerald-400'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">TDMS (Traction / OHE)</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Icon name="bolt" size={15} />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-bold text-slate-900">{tdmsCount}</span>
            <span className="text-xs text-slate-500">Active traction jobs</span>
          </div>
          <span className="text-[11px] text-slate-400 block mt-1">25kV OHE, Isolators, Cantilevers</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Department Pills */}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Dept:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            {(['ALL', 'TMS', 'SMMS', 'TDMS'] as const).map((dept) => (
              <button
                key={dept}
                onClick={() => setFilters((prev) => ({ ...prev, department: dept }))}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                  filters.department === dept
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {dept === 'ALL' ? 'All Subsystems' : dept}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 mx-1"></div>

          {/* Priority Pills */}
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Priority:</span>
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80">
            {(['ALL', 'P1', 'P2', 'P3', 'P4'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setFilters((prev) => ({ ...prev, priority: p as PriorityLevel | 'ALL' }))}
                className={`px-2.5 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                  filters.priority === p
                    ? 'bg-white text-indigo-700 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => runMockCPSATOptimization()}
            className="px-3 py-1.5 text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Icon name="auto_awesome" size={14} className="text-indigo-600" />
            Bundle Selected with CP-SAT
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Request ID</th>
                <th className="py-2.5 px-3">Subsystem / Title</th>
                <th className="py-2.5 px-3">Corridor &amp; Section</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">AI Priority</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400 text-xs">
                    No maintenance requests match the current filters.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr
                    key={req.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3 px-3 font-mono font-bold text-indigo-700">
                      {req.id}
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        SLA: {req.slaDeadlineHours}h remaining
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{req.title}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                            req.department === 'TMS'
                              ? 'bg-amber-50 text-amber-800 border border-amber-200'
                              : req.department === 'SMMS'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          }`}
                        >
                          {req.department}
                        </span>
                        <span className="text-[11px] text-slate-500 truncate max-w-xs">
                          {req.defectType}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-slate-600">
                      <div className="font-medium">{req.section}</div>
                      <span className="text-[11px] font-mono text-slate-400">
                        {req.trackLine} (KM {req.startKm}-{req.endKm})
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-medium text-slate-700">
                      {req.durationHours} hrs
                      <span className="block text-[10px] text-slate-400 font-sans font-normal">
                        Crew: {req.crewRequired}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-14 bg-slate-100 rounded-full h-1.5 overflow-hidden border border-slate-200/50">
                          <div
                            className={`h-full ${
                              req.calculatedAIPriority > 80
                                ? 'bg-rose-500'
                                : req.calculatedAIPriority > 60
                                ? 'bg-amber-500'
                                : 'bg-indigo-600'
                            }`}
                            style={{ width: `${req.calculatedAIPriority}%` }}
                          />
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {req.calculatedAIPriority}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-400">
                        Tier {req.priority}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          req.status === 'Approved'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : req.status === 'Optimized'
                            ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                            : 'bg-slate-100 text-slate-600 border-slate-200'
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setSelectedReq(req)}
                          title="Inspect Defect Details"
                          className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        >
                          <Icon name="visibility" size={16} />
                        </button>

                        <button
                          onClick={() => deleteMaintenanceRequest(req.id)}
                          title="Delete Request"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        >
                          <Icon name="delete" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Slide-Over / Modal if selected */}
      {selectedReq && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-xs font-mono text-indigo-600 font-bold">{selectedReq.id}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{selectedReq.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReq(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium">Subsystem:</span>
                  <span className="font-semibold text-slate-800">{selectedReq.deptFullName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Corridor Section:</span>
                  <span className="font-semibold text-slate-800">{selectedReq.section}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block font-medium">Defect / Job Type:</span>
                  <span className="font-semibold text-slate-800">{selectedReq.defectType}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Required Duration:</span>
                  <span className="font-semibold text-slate-800">{selectedReq.durationHours} Hours</span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block font-medium mb-1">Required Machinery &amp; Tooling:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedReq.machineryRequired.map((m, i) => (
                    <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {selectedReq.notes && (
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-slate-700">
                  <strong className="text-slate-900">Inspection Notes:</strong> {selectedReq.notes}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setSelectedReq(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setSelectedReq(null);
                  runMockCPSATOptimization(selectedReq.corridorId);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Bundle in Block Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
