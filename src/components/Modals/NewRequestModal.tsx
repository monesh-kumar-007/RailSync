import React, { useState } from 'react';
import { PlusCircle, X, Wrench, Radio, Zap, Check } from 'lucide-react';
import { useRailSync } from '../../context/RailSyncContext';
import { Department, PriorityLevel } from '../../types';

export const NewRequestModal: React.FC = () => {
  const {
    isNewRequestModalOpen,
    setIsNewRequestModalOpen,
    addMaintenanceRequest,
    corridors,
    selectedCorridorId
  } = useRailSync();

  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('TMS');
  const [corridorId, setCorridorId] = useState(selectedCorridorId);
  const [section, setSection] = useState('Sec 4, MP 12-14');
  const [trackLine, setTrackLine] = useState<'UP Line' | 'DN Line' | 'Both Lines'>('UP Line');
  const [durationHours, setDurationHours] = useState(3.5);
  const [priority, setPriority] = useState<PriorityLevel>('P2');
  const [criticalityScore, setCriticalityScore] = useState(7.5);
  const [defectType, setDefectType] = useState('Track Geometry & Ultrasonic Weld Radiography');
  const [crewRequired, setCrewRequired] = useState(12);
  const [powerBlockRequired, setPowerBlockRequired] = useState(false);
  const [trafficBlockRequired, setTrafficBlockRequired] = useState(true);
  const [notes, setNotes] = useState('');

  if (!isNewRequestModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const deptFullName = {
      TMS: 'Track Management System (TMS)',
      SMMS: 'Signal & Telecom Management (SMMS)',
      TDMS: 'Traction Distribution Management (TDMS)'
    }[department];

    addMaintenanceRequest({
      title,
      department,
      deptFullName,
      corridorId,
      section,
      startKm: 312.0,
      endKm: 315.5,
      trackLine,
      durationHours: Number(durationHours),
      priority,
      criticalityScore: Number(criticalityScore),
      defectType,
      machineryRequired: department === 'TMS' ? ['USFD Testing Trolley'] : department === 'SMMS' ? ['Signaling Tooling'] : ['DETC Tower Wagon'],
      crewRequired: Number(crewRequired),
      powerBlockRequired,
      trafficBlockRequired,
      slaDeadlineHours: priority === 'P1' ? 12 : priority === 'P2' ? 36 : 72,
      notes
    });

    setIsNewRequestModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <PlusCircle size={20} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">New Maintenance Request</h2>
          </div>
          <button
            onClick={() => setIsNewRequestModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Subsystem Department */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">Subsystem Department</label>
            <div className="grid grid-cols-3 gap-2">
              {(['TMS', 'SMMS', 'TDMS'] as const).map((dept) => (
                <button
                  type="button"
                  key={dept}
                  onClick={() => {
                    setDepartment(dept);
                    if (dept === 'TDMS') setPowerBlockRequired(true);
                  }}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border cursor-pointer transition-all ${
                    department === dept
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {dept === 'TMS' ? 'Track (TMS)' : dept === 'SMMS' ? 'Signal (SMMS)' : 'Traction (TDMS)'}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">Job Title / Description *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Ultrasonic Rail Flaw Weld Repair MP 13.5"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Corridor & Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Corridor</label>
              <select
                value={corridorId}
                onChange={(e) => setCorridorId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {corridors.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Section &amp; Post</label>
              <input
                type="text"
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Track Line & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Track Line</label>
              <select
                value={trackLine}
                onChange={(e) => setTrackLine(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="UP Line">UP Line</option>
                <option value="DN Line">DN Line</option>
                <option value="Both Lines">Both Lines</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Duration (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="12"
                value={durationHours}
                onChange={(e) => setDurationHours(parseFloat(e.target.value))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Priority Tier</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="P1">P1 (&lt;12h SLA)</option>
                <option value="P2">P2 (&lt;36h SLA)</option>
                <option value="P3">P3 (&lt;72h SLA)</option>
              </select>
            </div>
          </div>

          {/* Criticality & Crew */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-slate-800">Criticality Index (0-10)</span>
                <span className="font-bold text-indigo-600 font-mono">{criticalityScore}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.1"
                value={criticalityScore}
                onChange={(e) => setCriticalityScore(parseFloat(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-800">Crew Size (pax)</label>
              <input
                type="number"
                min="2"
                max="50"
                value={crewRequired}
                onChange={(e) => setCrewRequired(parseInt(e.target.value, 10))}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500 font-mono"
              />
            </div>
          </div>

          {/* Clearances */}
          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={trafficBlockRequired}
                onChange={(e) => setTrafficBlockRequired(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>Traffic Possession Block Required</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
              <input
                type="checkbox"
                checked={powerBlockRequired}
                onChange={(e) => setPowerBlockRequired(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>OHE 25kV Power Isolation Required</span>
            </label>
          </div>

          {/* Notes */}
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-800">Field Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Acoustic flaw detected on outer rail..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsNewRequestModalOpen(false)}
              className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs shadow-xs cursor-pointer"
            >
              Create Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
