import React, { useState } from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync } from '../../context/RailSyncContext';

export const AnalyticsView: React.FC = () => {
  const { metrics } = useRailSync();
  const [timeRange, setTimeRange] = useState<'30' | '90' | '365'>('30');
  const [activeResourceFilter, setActiveResourceFilter] = useState<'all' | 'machinery' | 'crew'>('all');

  return (
    <div id="analytics-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Corridor Analytics &amp; Safety ROI
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quantitative analysis of block compression, punctuality recovery, and multi-department synchronization.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-xs">
          <button
            onClick={() => setTimeRange('30')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              timeRange === '30' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setTimeRange('90')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              timeRange === '90' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Last Quarter
          </button>
          <button
            onClick={() => setTimeRange('365')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              timeRange === '365' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Annual FY26
          </button>
        </div>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric Card 1: Block Hours Saved */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 flex flex-col shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Block Hours Saved
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon name="timer" size={18} />
            </div>
          </div>

          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {metrics.blockHoursSaved.toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 mb-1 flex items-center font-bold">
              <Icon name="trending_up" size={14} className="mr-0.5" />
              {metrics.blockHoursSavedTrendPct}%
            </span>
          </div>

          {/* Dynamic 7-Bar Chart */}
          <div className="h-20 mt-auto w-full flex items-end justify-between gap-1.5 pt-2">
            <div className="w-full bg-indigo-100 rounded-t-xs h-[30%]" title="Week 1: 420 hrs"></div>
            <div className="w-full bg-indigo-100 rounded-t-xs h-[45%]" title="Week 2: 630 hrs"></div>
            <div className="w-full bg-indigo-200 rounded-t-xs h-[35%]" title="Week 3: 490 hrs"></div>
            <div className="w-full bg-indigo-300 rounded-t-xs h-[60%]" title="Week 4: 840 hrs"></div>
            <div className="w-full bg-indigo-400 rounded-t-xs h-[55%]" title="Week 5: 770 hrs"></div>
            <div className="w-full bg-indigo-500 rounded-t-xs h-[80%]" title="Week 6: 1,120 hrs"></div>
            <div className="w-full bg-indigo-600 rounded-t-xs h-[100%]" title="Current: 1,420 hrs"></div>
          </div>
        </div>

        {/* Metric Card 2: Asset Availability */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 flex flex-col shadow-xs">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Asset Availability
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Icon name="train" size={18} />
            </div>
          </div>

          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold font-mono text-slate-900">
              {metrics.assetAvailability}%
            </span>
            <span className="text-xs text-emerald-600 mb-1 flex items-center font-bold">
              <Icon name="trending_up" size={14} className="mr-0.5" />
              {metrics.assetAvailabilityTrendPct}%
            </span>
          </div>

          {/* Dynamic 6-Bar Availability Track */}
          <div className="h-20 mt-auto w-full flex items-end justify-between gap-2 pt-2">
            <div className="w-full bg-slate-100 rounded-xs h-full relative" title="Zone 1: 89.0%">
              <div className="absolute bottom-0 w-full bg-slate-300 rounded-xs h-[89%]"></div>
            </div>
            <div className="w-full bg-slate-100 rounded-xs h-full relative" title="Zone 2: 91.0%">
              <div className="absolute bottom-0 w-full bg-slate-300 rounded-xs h-[91%]"></div>
            </div>
            <div className="w-full bg-slate-100 rounded-xs h-full relative" title="Zone 3: 92.0%">
              <div className="absolute bottom-0 w-full bg-slate-300 rounded-xs h-[92%]"></div>
            </div>
            <div className="w-full bg-slate-100 rounded-xs h-full relative" title="Zone 4: 90.0%">
              <div className="absolute bottom-0 w-full bg-slate-300 rounded-xs h-[90%]"></div>
            </div>
            <div className="w-full bg-slate-100 rounded-xs h-full relative" title="Zone 5: 94.0%">
              <div className="absolute bottom-0 w-full bg-slate-300 rounded-xs h-[94%]"></div>
            </div>
            <div className="w-full bg-slate-100 rounded-xs h-full relative" title="RailSync AI: 95.4%">
              <div
                className="absolute bottom-0 w-full bg-emerald-600 rounded-xs transition-all duration-500"
                style={{ height: `${metrics.assetAvailability}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Metric Card 3: Bundled Tasks Donut */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 flex flex-col items-center justify-center relative shadow-xs">
          <div className="w-full flex justify-between items-start mb-2 absolute top-5 px-5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Bundled Tasks
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon name="layers" size={18} />
            </div>
          </div>

          <div className="relative w-28 h-28 mt-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-slate-100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="text-indigo-600 transition-all duration-500"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${metrics.bundledPct}, 100`}
                strokeWidth="4"
              />
              <path
                className="text-slate-300 transition-all duration-500"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeDasharray={`${metrics.singlePct}, 100`}
                strokeDashoffset={`-${metrics.bundledPct}`}
                strokeWidth="4"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold font-mono text-slate-900">
                {metrics.bundledTasksCount}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase">Tasks</span>
            </div>
          </div>

          <div className="w-full flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600"></span>
              <span className="text-xs text-slate-600 font-medium">
                Bundled ({metrics.bundledPct}%)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="text-xs text-slate-600 font-medium">
                Single ({metrics.singlePct}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Section */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">
          Performance Comparison: Conventional vs RailSync AI
        </h2>

        <div className="bg-white border border-slate-200/90 rounded-xl overflow-hidden shadow-xs">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 p-3.5">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Metric
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 text-center">
              Conventional Method
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-indigo-700 text-center flex justify-center items-center gap-1.5">
              <Icon name="psychology" size={16} /> RailSync AI
            </div>
          </div>

          {/* Row 1: Average Block Duration */}
          <div className="grid grid-cols-3 p-4 border-b border-slate-100 hover:bg-slate-50/80 transition-colors items-center text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <Icon name="timer" size={16} />
              </div>
              <span className="font-semibold text-slate-900">
                Average Block Duration
              </span>
            </div>
            <div className="text-center font-mono font-medium text-slate-500">
              {metrics.conventionalAvgBlockHours.toFixed(1)} Hours
            </div>
            <div className="text-center font-mono font-bold text-emerald-700 bg-emerald-50 rounded-lg py-1 mx-6 border border-emerald-200">
              {metrics.aiAvgBlockHours.toFixed(1)} Hours
            </div>
          </div>

          {/* Row 2: Weekly Conflicts */}
          <div className="grid grid-cols-3 p-4 border-b border-slate-100 hover:bg-slate-50/80 transition-colors items-center text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <Icon name="warning" size={16} />
              </div>
              <span className="font-semibold text-slate-900">
                Weekly Conflicts
              </span>
            </div>
            <div className="text-center font-mono font-medium text-slate-500">
              {metrics.conventionalWeeklyConflicts} Incidents
            </div>
            <div className="text-center font-mono font-bold text-emerald-700 bg-emerald-50 rounded-lg py-1 mx-6 border border-emerald-200">
              {metrics.aiWeeklyConflicts} Incidents
            </div>
          </div>

          {/* Row 3: Network Availability */}
          <div className="grid grid-cols-3 p-4 hover:bg-slate-50/80 transition-colors items-center text-xs">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <Icon name="security" size={16} />
              </div>
              <span className="font-semibold text-slate-900">
                Network Availability
              </span>
            </div>
            <div className="text-center font-mono font-medium text-slate-500">
              {metrics.conventionalNetworkAvailability.toFixed(1)}%
            </div>
            <div className="text-center font-mono font-bold text-emerald-700 bg-emerald-50 rounded-lg py-1 mx-6 border border-emerald-200">
              {metrics.aiNetworkAvailability.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Interactive Charts Area */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resource Utilization Interactive Chart */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Resource Utilization
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Equipment and crew deployment across synchronized block windows.
              </p>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/80 text-[11px]">
              <button
                onClick={() => setActiveResourceFilter('all')}
                className={`px-2.5 py-0.5 rounded-md font-semibold cursor-pointer ${activeResourceFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                All
              </button>
              <button
                onClick={() => setActiveResourceFilter('machinery')}
                className={`px-2.5 py-0.5 rounded-md font-semibold cursor-pointer ${activeResourceFilter === 'machinery' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Machines
              </button>
              <button
                onClick={() => setActiveResourceFilter('crew')}
                className={`px-2.5 py-0.5 rounded-md font-semibold cursor-pointer ${activeResourceFilter === 'crew' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500'}`}
              >
                Crews
              </button>
            </div>
          </div>

          <div className="h-56 p-4 flex flex-col justify-end bg-slate-50 rounded-xl border border-slate-200">
            <div className="grid grid-cols-5 gap-3 h-40 items-end">
              <div className="flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">88%</span>
                <div className="w-full bg-indigo-600 rounded-t h-[88%] transition-all group-hover:bg-indigo-700" title="09-3X Tamping Machines: 88% utilized"></div>
                <span className="text-[10px] font-mono text-slate-600 truncate w-full text-center">Tampers</span>
              </div>

              <div className="flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">92%</span>
                <div className="w-full bg-indigo-600 rounded-t h-[92%] transition-all group-hover:bg-indigo-700" title="DETC 8W Tower Wagons: 92% utilized"></div>
                <span className="text-[10px] font-mono text-slate-600 truncate w-full text-center">DETC</span>
              </div>

              <div className="flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">74%</span>
                <div className="w-full bg-indigo-600 rounded-t h-[74%] transition-all group-hover:bg-indigo-700" title="BCM Ballast Cleaners: 74% utilized"></div>
                <span className="text-[10px] font-mono text-slate-600 truncate w-full text-center">BCM</span>
              </div>

              <div className="flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">95%</span>
                <div className="w-full bg-slate-300 rounded-t h-[95%] transition-all group-hover:bg-indigo-600" title="Track Gang Crews: 95% active"></div>
                <span className="text-[10px] font-mono text-slate-600 truncate w-full text-center">TMS Gang</span>
              </div>

              <div className="flex flex-col items-center gap-1 group">
                <span className="text-[10px] font-mono text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">82%</span>
                <div className="w-full bg-slate-300 rounded-t h-[82%] transition-all group-hover:bg-indigo-600" title="Signaling Tech Teams: 82% active"></div>
                <span className="text-[10px] font-mono text-slate-600 truncate w-full text-center">S&amp;T Team</span>
              </div>
            </div>
          </div>
        </div>

        {/* Delay Impact Analysis Interactive Scatter / Curve Plot */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Delay Impact Analysis
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Passenger train regulation minutes vs corridor block duration.
              </p>
            </div>
            <span className="text-[11px] font-mono text-slate-400 font-semibold">
              R² = 0.94 Correlation
            </span>
          </div>

          <div className="h-56 p-4 flex flex-col justify-between bg-slate-50 rounded-xl border border-slate-200 relative overflow-hidden">
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>High Delay (120m)</span>
              <span>Optimal Shadow Zone (&lt;20m)</span>
            </div>

            {/* Scatter points representation */}
            <div className="relative h-32 w-full">
              {/* Conventional points */}
              <div className="absolute top-[20%] left-[80%] w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200" title="Conventional unbundled block: 12h, 110 min delay"></div>
              <div className="absolute top-[30%] left-[75%] w-3 h-3 rounded-full bg-rose-500 ring-2 ring-rose-200" title="Conventional separate TMS: 8h, 75 min delay"></div>
              <div className="absolute top-[40%] left-[65%] w-3 h-3 rounded-full bg-amber-500 ring-2 ring-amber-200" title="Conventional separate TDMS: 6h, 50 min delay"></div>

              {/* RailSync AI points */}
              <div className="absolute bottom-[20%] left-[25%] w-4 h-4 rounded-full bg-emerald-600 ring-4 ring-emerald-100 animate-pulse" title="RailSync AI Bundled Block: 4h, 14 min delay"></div>
              <div className="absolute bottom-[28%] left-[30%] w-3 h-3 rounded-full bg-indigo-600 ring-2 ring-indigo-200" title="RailSync AI Block: 3.5h, 18 min delay"></div>
              <div className="absolute bottom-[15%] left-[20%] w-3 h-3 rounded-full bg-emerald-600 ring-2 ring-emerald-200" title="RailSync AI Block: 2.5h, 8 min delay"></div>

              {/* Trend line */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M 15 90 Q 50 60 85 15" fill="none" stroke="#94a3b8" strokeDasharray="3,3" strokeWidth="1" />
              </svg>
            </div>

            <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono border-t border-slate-200 pt-2">
              <span className="flex items-center gap-1 text-emerald-700 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span> RailSync AI Bundled
              </span>
              <span className="flex items-center gap-1 text-rose-600 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span> Conventional Unbundled
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
