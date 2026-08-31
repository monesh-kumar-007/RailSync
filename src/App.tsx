import React from 'react';
import { RailSyncProvider, useRailSync } from './context/RailSyncContext';
import { Sidebar } from './components/Navigation/Sidebar';
import { TopAppBar } from './components/Navigation/TopAppBar';
import { ToastContainer } from './components/Common/Toast';

import { OverviewView } from './components/Views/OverviewView';
import { BlockPlannerView } from './components/Views/BlockPlannerView';
import { MaintenanceRequestsView } from './components/Views/MaintenanceRequestsView';
import { AIPrioritizationView } from './components/Views/AIPrioritizationView';
import { CorridorScheduleView } from './components/Views/CorridorScheduleView';
import { WhatIfSimulatorView } from './components/Views/WhatIfSimulatorView';
import { LiveOperationsView } from './components/Views/LiveOperationsView';
import { AnalyticsView } from './components/Views/AnalyticsView';
import { SettingsView } from './components/Views/SettingsView';

import { ManualOverrideModal } from './components/Modals/ManualOverrideModal';
import { NewRequestModal } from './components/Modals/NewRequestModal';
import { NotificationsDrawer } from './components/Modals/NotificationsDrawer';
import { ExportReportModal } from './components/Modals/ExportReportModal';

const AppContent: React.FC = () => {
  const { activeTab } = useRailSync();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900 antialiased select-text">
      {/* Fixed Left Sidebar (260px) */}
      <Sidebar />

      {/* Main Content Area (calc(100vw - 260px)) */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden ml-[260px]">
        {/* Sticky Top Header */}
        <TopAppBar />

        {/* Dynamic Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto bg-slate-50 p-6 lg:p-8">
          <div className="max-w-[1600px] mx-auto w-full">
            {activeTab === 'overview' && <OverviewView />}
            {activeTab === 'block_planner' && <BlockPlannerView />}
            {activeTab === 'maintenance_requests' && <MaintenanceRequestsView />}
            {activeTab === 'ai_prioritization' && <AIPrioritizationView />}
            {activeTab === 'corridor_schedule' && <CorridorScheduleView />}
            {activeTab === 'what_if_simulator' && <WhatIfSimulatorView />}
            {activeTab === 'live_operations' && <LiveOperationsView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'settings' && <SettingsView />}
          </div>
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <ManualOverrideModal />
      <NewRequestModal />
      <NotificationsDrawer />
      <ExportReportModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <RailSyncProvider>
      <AppContent />
    </RailSyncProvider>
  );
}
