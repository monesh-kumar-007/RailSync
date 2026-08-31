import React, { useState } from 'react';
import { FileDown, X, FileText } from 'lucide-react';
import { useRailSync } from '../../context/RailSyncContext';

export const ExportReportModal: React.FC = () => {
  const { isExportModalOpen, setIsExportModalOpen, metrics, selectedCorridor, showToast } = useRailSync();
  const [format, setFormat] = useState<'PDF' | 'CSV' | 'JSON'>('PDF');

  if (!isExportModalOpen) return null;

  const handleDownload = () => {
    showToast(`Corridor Optimization Report (${format}) exported successfully.`, 'success');
    setIsExportModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <FileDown size={20} className="text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Export Analytics &amp; Plan Report</h2>
          </div>
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 text-xs text-slate-700">
          <p className="text-slate-500">
            Generate an official Indian Railways corridor optimization brief containing bundled block logs, punctuality metrics, and resource savings.
          </p>

          <div className="bg-slate-50 p-3.5 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-500">Corridor:</span>
              <span className="font-semibold text-slate-900">{selectedCorridor.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Block-Hours Saved:</span>
              <span className="font-bold text-emerald-600 font-mono">{metrics.blockHoursSaved} hrs</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Asset Availability:</span>
              <span className="font-bold text-slate-900 font-mono">{metrics.assetAvailability}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Bundled Tasks Total:</span>
              <span className="font-semibold text-slate-900">{metrics.bundledTasksCount} Tasks</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="font-semibold text-slate-800 block">Export Format</label>
            <div className="grid grid-cols-3 gap-2">
              {(['PDF', 'CSV', 'JSON'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`py-2 text-xs font-semibold rounded-lg border cursor-pointer transition-all ${
                    format === fmt
                      ? 'bg-indigo-50 text-indigo-700 border-indigo-300 ring-1 ring-indigo-300'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {fmt} Document
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => setIsExportModalOpen(false)}
            className="px-4 py-2 border border-slate-200 text-slate-700 rounded-lg font-semibold hover:bg-slate-50 text-xs cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-xs shadow-xs cursor-pointer"
          >
            Download Report
          </button>
        </div>
      </div>
    </div>
  );
};
