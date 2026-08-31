import React from 'react';
import { Icon } from '../Common/Icon';
import { useRailSync } from '../../context/RailSyncContext';
import { SimulationScenario } from '../../types';

export const WhatIfSimulatorView: React.FC = () => {
  const {
    selectedCorridor,
    activeScenario,
    setActiveScenario,
    resolveActiveScenario,
    showToast
  } = useRailSync();

  const injectScenario = (type: SimulationScenario['type']) => {
    let scenario: SimulationScenario;

    switch (type) {
      case 'emergency_defect':
        scenario = {
          id: `SIM-DEF-${Date.now()}`,
          title: 'Emergency Rail Fracture Detected (MP 13.5)',
          type: 'emergency_defect',
          severity: 'Critical',
          section: 'Sec 4 (Tundla - Etawah)',
          description: 'Ultrasonic flaw detector (USFD) reports urgent rail weld discontinuity on UP Fast Line.',
          additionalDelayPredicted: 45,
          conflictsDetected: 3,
          resolved: false
        };
        break;
      case 'section_closure':
        scenario = {
          id: `SIM-OHE-${Date.now()}`,
          title: 'Unscheduled OHE 25kV Catenary Power Trip',
          type: 'section_closure',
          severity: 'Critical',
          section: 'Sec 2 (Ghaziabad - Aligarh)',
          description: 'Sudden overhead equipment insulator flashover trips 25kV traction feeder on DN Line.',
          additionalDelayPredicted: 70,
          conflictsDetected: 5,
          resolved: false
        };
        break;
      case 'traffic_surge':
        scenario = {
          id: `SIM-TRF-${Date.now()}`,
          title: 'Special Express & Freight Traffic Influx (+35%)',
          type: 'traffic_surge',
          severity: 'Moderate',
          section: 'Entire Corridor',
          description: '6 unscheduled festival superfast rakes injected into peak night freight slots.',
          additionalDelayPredicted: 30,
          conflictsDetected: 2,
          resolved: false
        };
        break;
      case 'fog_weather':
        scenario = {
          id: `SIM-FOG-${Date.now()}`,
          title: 'Dense Fog Visibility Restriction (Speed ≤ 60km/h)',
          type: 'fog_weather',
          severity: 'Moderate',
          section: 'Northern Sector',
          description: 'Severe winter visibility drops below 200m; all locos limited to 60 km/h with detonators.',
          additionalDelayPredicted: 85,
          conflictsDetected: 6,
          resolved: false
        };
        break;
    }

    setActiveScenario(scenario);
    showToast(`Simulation Injected: ${scenario.title}`, 'warning');
  };

  return (
    <div id="what-if-simulator-view" className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Operational What-If Scenario Sandbox
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Simulate real-time track fractures, traction power outages, fog speed limits, and evaluate AI re-planning.
          </p>
        </div>

        {activeScenario && (
          <div className="flex items-center gap-2">
            {!activeScenario.resolved && (
              <button
                id="resolve-scenario-btn"
                onClick={() => resolveActiveScenario()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Icon name="auto_awesome" size={15} />
                Generate AI Mitigation Plan
              </button>
            )}
            <button
              onClick={() => {
                setActiveScenario(null);
                showToast('Simulation sandbox reset to baseline.', 'info');
              }}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
            >
              <Icon name="restart_alt" size={15} className="text-slate-500" />
              Reset Simulation
            </button>
          </div>
        )}
      </div>

      {/* Scenario Injection Palette */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => injectScenario('emergency_defect')}
          className="bg-white border border-slate-200/90 hover:border-rose-400 rounded-xl p-4 cursor-pointer transition-all shadow-xs hover:shadow-sm group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Icon name="gpp_bad" size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">Track Failure</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
            Add Emergency Defect
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Inject an ultrasonic rail fracture at MP 13.5 requiring an immediate 2.5h block.
          </p>
          <span className="text-xs font-semibold text-indigo-600 mt-3 inline-flex items-center gap-1">
            Inject Failure <Icon name="arrow_forward" size={13} />
          </span>
        </div>

        <div
          onClick={() => injectScenario('section_closure')}
          className="bg-white border border-slate-200/90 hover:border-amber-400 rounded-xl p-4 cursor-pointer transition-all shadow-xs hover:shadow-sm group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Icon name="flash_off" size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600">Traction Tripping</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
            Close Track Section (OHE)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Simulate 0 kV catenary trip on DN Line (Sec 2 GZB-ALJN) with stranded electric locos.
          </p>
          <span className="text-xs font-semibold text-indigo-600 mt-3 inline-flex items-center gap-1">
            Inject Failure <Icon name="arrow_forward" size={13} />
          </span>
        </div>

        <div
          onClick={() => injectScenario('traffic_surge')}
          className="bg-white border border-slate-200/90 hover:border-indigo-400 rounded-xl p-4 cursor-pointer transition-all shadow-xs hover:shadow-sm group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Icon name="trending_up" size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">+35% Surge</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
            Increase Traffic Volume
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Inject 6 Festival Holiday Special Superfast rakes into midnight headway slots.
          </p>
          <span className="text-xs font-semibold text-indigo-600 mt-3 inline-flex items-center gap-1">
            Inject Surge <Icon name="arrow_forward" size={13} />
          </span>
        </div>

        <div
          onClick={() => injectScenario('fog_weather')}
          className="bg-white border border-slate-200/90 hover:border-sky-400 rounded-xl p-4 cursor-pointer transition-all shadow-xs hover:shadow-sm group"
        >
          <div className="flex justify-between items-center mb-3">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <Icon name="foggy" size={18} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600">Weather</span>
          </div>
          <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
            Adverse Fog (Speed ≤ 60km/h)
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Reduce corridor speed ceiling from 130 km/h to 60 km/h for visibility protection.
          </p>
          <span className="text-xs font-semibold text-indigo-600 mt-3 inline-flex items-center gap-1">
            Inject Weather <Icon name="arrow_forward" size={13} />
          </span>
        </div>
      </div>

      {/* Active Scenario Impact Assessment */}
      {activeScenario ? (
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={`w-2.5 h-2.5 rounded-full ${
                    activeScenario.resolved ? 'bg-emerald-500' : 'bg-rose-500 animate-ping'
                  }`}
                />
                <h2 className="text-base font-bold text-slate-900">
                  {activeScenario.title}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {activeScenario.description} • Section: {activeScenario.section}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded text-xs font-bold uppercase border ${
                  activeScenario.resolved
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}
              >
                {activeScenario.resolved ? 'Recovery Plan Active' : 'Unmitigated Disruptions'}
              </span>
            </div>
          </div>

          {/* Before vs After Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Predicted Train Delay
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-rose-600">
                  +{activeScenario.resolved ? '12 mins' : `${activeScenario.additionalDelayPredicted} mins`}
                </span>
                {activeScenario.resolved && (
                  <span className="text-xs font-semibold text-emerald-700">
                    (73% mitigated)
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500">Cumulative passenger delay</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Detected Spatial Conflicts
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-slate-900">
                  {activeScenario.resolved ? '0 Conflicts' : `${activeScenario.conflictsDetected} Active Conflicts`}
                </span>
              </div>
              <span className="text-[11px] text-slate-500">Overlapping track occupations</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
                Corridor Punctuality Impact
              </span>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold font-mono text-indigo-600">
                  {activeScenario.resolved ? '94.8%' : '79.2%'}
                </span>
                <span className="text-xs text-slate-400">vs 95.4% normal</span>
              </div>
              <span className="text-[11px] text-slate-500">SLA adherence rating</span>
            </div>
          </div>

          {/* Recovery Strategy Output */}
          <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-200 space-y-2">
            <span className="text-xs font-bold text-indigo-700 flex items-center gap-1.5 uppercase tracking-wider">
              <Icon name="psychology" size={16} />
              AI Recovery Plan Summary
            </span>
            <ul className="text-xs text-slate-700 space-y-1 list-disc list-inside">
              <li>12302 Howrah Rajdhani held for 12 mins at Tundla Siding (Speed step restored on clearing).</li>
              <li>CONCOR Container Rake 99821 diverted to loop line 4 to grant unimpeded corridor slot.</li>
              <li>Emergency Weld Repair crew allocated immediate 90-min shadow block on UP line.</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/90 rounded-xl p-12 text-center shadow-xs space-y-2">
          <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Icon name="psychology" size={26} />
          </div>
          <h2 className="text-base font-bold text-slate-900">No Simulation Scenario Currently Active</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Select one of the scenario triggers above to simulate an operational failure or demand surge on {selectedCorridor.name}.
          </p>
        </div>
      )}
    </div>
  );
};
