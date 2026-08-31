import React, { createContext, useContext, useState, useMemo, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  Corridor,
  MaintenanceRequest,
  TrainScheduleItem,
  BundledBlockPlan,
  SystemMetrics,
  LiveAlert,
  WhatIfScenario,
  Department,
  PriorityLevel
} from '../types';
import {
  INITIAL_CORRIDORS,
  INITIAL_MAINTENANCE_REQUESTS,
  INITIAL_BUNDLED_PLANS,
  INITIAL_TRAIN_SCHEDULE,
  INITIAL_METRICS,
  INITIAL_LIVE_ALERTS
} from '../data/mockData';

export type ActiveTab =
  | 'overview'
  | 'block_planner'
  | 'maintenance_requests'
  | 'ai_prioritization'
  | 'corridor_schedule'
  | 'what_if_simulator'
  | 'live_operations'
  | 'analytics'
  | 'settings';

interface FilterState {
  searchQuery: string;
  department: Department | 'ALL';
  corridorId: string | 'ALL';
  priority: PriorityLevel | 'ALL';
  status: string | 'ALL';
}

interface AIPrioritizationParams {
  criticalitySlider: number; // 0 to 10
  safetyWeight: number;      // 0.1 to 1.0
  trafficDensityWeight: number; // 0.1 to 1.0
  slaUrgencyWeight: number;  // 0.1 to 1.0
  defectFocus: string[];     // selected defect IDs
}

interface RailSyncContextType {
  // Navigation & Tabs
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Corridors & Selection
  corridors: Corridor[];
  selectedCorridorId: string;
  setSelectedCorridorId: (id: string) => void;
  selectedCorridor: Corridor;

  // Maintenance Requests
  maintenanceRequests: MaintenanceRequest[];
  filteredRequests: MaintenanceRequest[];
  addMaintenanceRequest: (req: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'calculatedAIPriority' | 'status'>) => void;
  updateMaintenanceRequest: (id: string, updates: Partial<MaintenanceRequest>) => void;
  deleteMaintenanceRequest: (id: string) => void;

  // Block Plans & Optimization
  bundledPlans: BundledBlockPlan[];
  activePlan: BundledBlockPlan | undefined;
  isOptimizing: boolean;
  runMockCPSATOptimization: (corridorId?: string) => Promise<BundledBlockPlan>;
  approvePlan: (planId: string) => void;
  manualOverridePlan: (planId: string, updates: Partial<BundledBlockPlan>) => void;

  // Train Schedules
  trainSchedules: TrainScheduleItem[];
  updateTrainSchedule: (id: string, updates: Partial<TrainScheduleItem>) => void;

  // Metrics
  metrics: SystemMetrics;
  recentAuditLogs: { id: string; action: string; time: string; user: string; impact: string }[];

  // AI Prioritization Parameters
  aiParams: AIPrioritizationParams;
  setAIParams: React.Dispatch<React.SetStateAction<AIPrioritizationParams>>;
  updateDefectCriticality: (defectId: string, score: number) => void;

  // What-If Simulation
  scenarios: WhatIfScenario[];
  activeScenario: WhatIfScenario | null;
  injectScenario: (scenarioType: WhatIfScenario['type']) => void;
  applyRecoveryPlan: () => void;
  resetScenarios: () => void;

  // Live Operations
  liveAlerts: LiveAlert[];
  dismissAlert: (id: string) => void;
  triggerEmergencyReoptimization: () => Promise<void>;
  isReoptimizing: boolean;

  // Filters & Search
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;

  // UI Toast / Feedback
  toastMessage: { text: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (text: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: () => void;

  // Modals
  isManualOverrideOpen: boolean;
  setIsManualOverrideOpen: (open: boolean) => void;
  isNewRequestModalOpen: boolean;
  setIsNewRequestModalOpen: (open: boolean) => void;
  isExportModalOpen: boolean;
  setIsExportModalOpen: (open: boolean) => void;
  isNotificationsDrawerOpen: boolean;
  setIsNotificationsDrawerOpen: (open: boolean) => void;
}

const RailSyncContext = createContext<RailSyncContextType | undefined>(undefined);

export const RailSyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [corridors] = useState<Corridor[]>(INITIAL_CORRIDORS);
  const [selectedCorridorId, setSelectedCorridorId] = useState<string>('COR-ALPHA-7');

  const [maintenanceRequests, setMaintenanceRequests] = useState<MaintenanceRequest[]>(INITIAL_MAINTENANCE_REQUESTS);
  const [bundledPlans, setBundledPlans] = useState<BundledBlockPlan[]>(INITIAL_BUNDLED_PLANS);
  const [trainSchedules, setTrainSchedules] = useState<TrainScheduleItem[]>(INITIAL_TRAIN_SCHEDULE);
  const [metrics, setMetrics] = useState<SystemMetrics>(INITIAL_METRICS);
  const [liveAlerts, setLiveAlerts] = useState<LiveAlert[]>(INITIAL_LIVE_ALERTS);

  const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
  const [isReoptimizing, setIsReoptimizing] = useState<boolean>(false);

  // Modals state
  const [isManualOverrideOpen, setIsManualOverrideOpen] = useState<boolean>(false);
  const [isNewRequestModalOpen, setIsNewRequestModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isNotificationsDrawerOpen, setIsNotificationsDrawerOpen] = useState<boolean>(false);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage((prev) => (prev?.text === text ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setToastMessage(null);

  // AI Prioritization Parameters
  const [aiParams, setAIParams] = useState<AIPrioritizationParams>({
    criticalitySlider: 8.4,
    safetyWeight: 0.50,
    trafficDensityWeight: 0.30,
    slaUrgencyWeight: 0.20,
    defectFocus: ['DEF-01', 'DEF-02', 'DEF-03', 'DEF-04', 'DEF-05']
  });

  // What-If Simulation
  const [scenarios, setScenarios] = useState<WhatIfScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<WhatIfScenario | null>(null);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    department: 'ALL',
    corridorId: 'ALL',
    priority: 'ALL',
    status: 'ALL'
  });

  const resetFilters = () => {
    setFilters({
      searchQuery: '',
      department: 'ALL',
      corridorId: 'ALL',
      priority: 'ALL',
      status: 'ALL'
    });
  };

  // Recent Audit Logs
  const [recentAuditLogs, setRecentAuditLogs] = useState<{ id: string; action: string; time: string; user: string; impact: string }[]>([
    {
      id: 'LOG-109',
      action: 'Initial Corridor Alpha-7 Schedule Compiled',
      time: '08:00 AM',
      user: 'AI Solver CP-SAT',
      impact: 'Generated 3 bundled block windows'
    }
  ]);

  // Recalculate AI Priority for all maintenance requests whenever aiParams change
  useEffect(() => {
    setMaintenanceRequests((prev) =>
      prev.map((req) => {
        // Base formula: weighted combination of criticality, traffic density, and SLA urgency
        const critComponent = req.criticalityScore * 10 * aiParams.safetyWeight;
        const trafficComponent = (req.trackLine === 'UP Line' || req.trackLine === 'Both Lines' ? 85 : 70) * aiParams.trafficDensityWeight;
        const slaFactor = Math.max(10, 100 - (req.slaDeadlineHours / 72) * 50);
        const slaComponent = slaFactor * aiParams.slaUrgencyWeight;

        // Apply slider scaling if affected
        const sliderMultiplier = aiParams.criticalitySlider / 8.0;
        const calculatedScore = Math.min(99, Math.round((critComponent + trafficComponent + slaComponent) * sliderMultiplier * 0.95));

        return {
          ...req,
          calculatedAIPriority: Math.max(25, calculatedScore)
        };
      })
    );
  }, [aiParams]);

  // Selected corridor helper
  const selectedCorridor = useMemo(() => {
    return corridors.find((c) => c.id === selectedCorridorId) || corridors[0];
  }, [corridors, selectedCorridorId]);

  // Active plan for selected corridor
  const activePlan = useMemo(() => {
    return bundledPlans.find((p) => p.corridorId === selectedCorridorId && p.status !== 'Completed') || bundledPlans[0];
  }, [bundledPlans, selectedCorridorId]);

  // Filtered maintenance requests
  const filteredRequests = useMemo(() => {
    return maintenanceRequests.filter((req) => {
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchesId = req.id.toLowerCase().includes(q);
        const matchesTitle = req.title.toLowerCase().includes(q);
        const matchesSection = req.section.toLowerCase().includes(q);
        const matchesDefect = req.defectType.toLowerCase().includes(q);
        if (!matchesId && !matchesTitle && !matchesSection && !matchesDefect) return false;
      }
      if (filters.department !== 'ALL' && req.department !== filters.department) return false;
      if (filters.corridorId !== 'ALL' && req.corridorId !== filters.corridorId) return false;
      if (filters.priority !== 'ALL' && req.priority !== filters.priority) return false;
      if (filters.status !== 'ALL' && req.status !== filters.status) return false;
      return true;
    });
  }, [maintenanceRequests, filters]);

  // Approve Plan Action (Crucial requirement: dynamically updates metrics, removes items from pending, triggers celebration)
  const approvePlan = (planId: string) => {
    const targetPlan = bundledPlans.find((p) => p.id === planId);
    if (!targetPlan) return;

    if (targetPlan.status === 'Approved') {
      showToast(`Plan ${planId} is already approved and active in COA timetable.`, 'info');
      return;
    }

    // Update Plan status
    setBundledPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, status: 'Approved', approvedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) } : p))
    );

    // Update maintenance request statuses to 'Approved'
    const taskIds = targetPlan.tasks.map((t) => t.id);
    setMaintenanceRequests((prev) =>
      prev.map((req) => (taskIds.includes(req.id) ? { ...req, status: 'Approved' } : req))
    );

    // Increment system metrics
    const savedHours = targetPlan.impactAnalysis.blockHoursSaved;
    setMetrics((prev) => ({
      ...prev,
      blockHoursSaved: Math.round(prev.blockHoursSaved + savedHours),
      blockHoursSavedTrendPct: +(prev.blockHoursSavedTrendPct + 0.8).toFixed(1),
      assetAvailability: +(Math.min(98.8, prev.assetAvailability + 0.3)).toFixed(1),
      assetAvailabilityTrendPct: +(prev.assetAvailabilityTrendPct + 0.4).toFixed(1),
      bundledTasksCount: prev.bundledTasksCount + targetPlan.tasks.length,
      bundledPct: Math.min(88, prev.bundledPct + 1),
      singlePct: Math.max(12, prev.singlePct - 1),
      aiAvgBlockHours: 6.8,
      aiWeeklyConflicts: Math.max(1, prev.aiWeeklyConflicts - 1)
    }));

    // Add audit log
    setRecentAuditLogs((prev) => [
      {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        action: `Block Plan ${planId} Approved for execution`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: 'Chief Controller / Dy. COM (Safety)',
        impact: `Saved ${savedHours} block-hours, grouped ${targetPlan.tasks.length} inter-department tasks.`
      },
      ...prev
    ]);

    // Fire Confetti!
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {
      // safe fallback
    }

    showToast(`Plan ${planId} Approved! System metrics updated, +${savedHours} Block-Hours saved.`, 'success');
  };

  // Run Mock CP-SAT Optimization Solver
  const runMockCPSATOptimization = async (corridorId = selectedCorridorId): Promise<BundledBlockPlan> => {
    setIsOptimizing(true);
    showToast('Running CP-SAT Solver: Formulating multi-department constraints & timetable slots...', 'info');

    // Simulate solver delay for realism
    await new Promise((resolve) => setTimeout(resolve, 1400));

    // Find candidate pending requests in this corridor
    const candidates = maintenanceRequests.filter(
      (r) => r.corridorId === corridorId && (r.status === 'Pending' || r.status === 'Optimized')
    );

    const tasksToBundle = candidates.slice(0, 3);
    const totalSeparateHours = tasksToBundle.reduce((acc, t) => acc + t.durationHours, 0) || 11.5;
    const bundledDuration = Math.max(...tasksToBundle.map((t) => t.durationHours), 4.0);
    const savedHours = Math.max(2.5, +(totalSeparateHours - bundledDuration).toFixed(1));

    const newPlanId = `BLK-${corridorId.replace('COR-', '')}-${Math.floor(10 + Math.random() * 90)}`;
    const newPlan: BundledBlockPlan = {
      id: newPlanId,
      corridorId,
      corridorName: corridors.find((c) => c.id === corridorId)?.name || 'Corridor Alpha-7',
      section: tasksToBundle[0]?.section || 'Sec 4, MP 12-14',
      trackLine: tasksToBundle[0]?.trackLine || 'UP Line',
      proposedStart: '01:30',
      proposedEnd: '05:30',
      durationHours: bundledDuration,
      tasks: tasksToBundle.length > 0 ? tasksToBundle : INITIAL_MAINTENANCE_REQUESTS.slice(0, 3),
      safetyChecklist: {
        noUnsafeOverlaps: true,
        slaSatisfied: true,
        resourceConstraintsMet: true,
        powerIsolationConfirmed: true
      },
      impactAnalysis: {
        trainsRegulated: 2,
        totalDelayMinutes: 14,
        blockHoursSaved: savedHours,
        assetAvailabilityScore: +(95.0 + Math.random() * 1.5).toFixed(1)
      },
      status: 'Proposed'
    };

    setBundledPlans((prev) => [newPlan, ...prev.filter((p) => p.id !== newPlanId)]);

    // Update tasks to Optimized
    const taskIds = newPlan.tasks.map((t) => t.id);
    setMaintenanceRequests((prev) =>
      prev.map((req) => (taskIds.includes(req.id) ? { ...req, status: 'Optimized', bundledBlockId: newPlanId } : req))
    );

    setIsOptimizing(false);
    showToast(`Optimal Block ${newPlanId} generated with 0 safety conflicts!`, 'success');
    return newPlan;
  };

  // Manual Override
  const manualOverridePlan = (planId: string, updates: Partial<BundledBlockPlan>) => {
    setBundledPlans((prev) =>
      prev.map((p) => (p.id === planId ? { ...p, ...updates, status: 'Modified' } : p))
    );

    setRecentAuditLogs((prev) => [
      {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        action: `Manual Override applied to ${planId}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: 'Sr. Divisional Operations Manager (DOM)',
        impact: `Adjusted block parameters: ${updates.proposedStart || ''}-${updates.proposedEnd || ''}`
      },
      ...prev
    ]);

    showToast(`Manual adjustments applied to plan ${planId}.`, 'info');
  };

  // Add Maintenance Request
  const addMaintenanceRequest = (req: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'calculatedAIPriority' | 'status'>) => {
    const deptPrefix = req.department;
    const newId = `${deptPrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReq: MaintenanceRequest = {
      ...req,
      id: newId,
      status: 'Pending',
      calculatedAIPriority: Math.round(req.criticalityScore * 10),
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setMaintenanceRequests((prev) => [newReq, ...prev]);
    showToast(`New maintenance request ${newId} registered from ${req.department} subsystem.`, 'success');
  };

  const updateMaintenanceRequest = (id: string, updates: Partial<MaintenanceRequest>) => {
    setMaintenanceRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    );
  };

  const deleteMaintenanceRequest = (id: string) => {
    setMaintenanceRequests((prev) => prev.filter((r) => r.id !== id));
    showToast(`Maintenance request ${id} removed.`, 'info');
  };

  const updateTrainSchedule = (id: string, updates: Partial<TrainScheduleItem>) => {
    setTrainSchedules((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const updateDefectCriticality = (defectId: string, score: number) => {
    setAIParams((prev) => ({ ...prev, criticalitySlider: score }));
  };

  // What-If Simulation Injection
  const injectScenario = (scenarioType: WhatIfScenario['type']) => {
    let newScenario: WhatIfScenario;
    if (scenarioType === 'emergency_defect') {
      newScenario = {
        id: `SCEN-${Date.now().toString().slice(-4)}`,
        type: 'emergency_defect',
        title: 'Emergency USFD Rail Flaw Detected',
        description: 'Urgent transverse fracture identified at MP 13.5 (UP Line). Requires immediate 2.5-hour emergency block.',
        corridorId: 'COR-ALPHA-7',
        section: 'Sec 4, MP 12-14',
        severity: 9.5,
        additionalDelayPredicted: 45,
        conflictsDetected: 3,
        timestamp: 'Just now',
        resolved: false
      };
      // Inject urgent P1 request
      const urgentReq: MaintenanceRequest = {
        id: `EMG-${Math.floor(1000 + Math.random() * 9000)}`,
        title: 'EMERGENCY: Rail Fractured Weld Clamp & Replace',
        department: 'TMS',
        deptFullName: 'Track Management System (TMS)',
        corridorId: 'COR-ALPHA-7',
        section: 'Sec 4, MP 12-14',
        startKm: 313.5,
        endKm: 314.0,
        trackLine: 'UP Line',
        durationHours: 2.5,
        priority: 'P1',
        criticalityScore: 9.8,
        calculatedAIPriority: 98,
        defectType: 'Ultrasonic Rail Flaw (USFD - Transverse Fissure)',
        machineryRequired: ['Emergency Rail Clamp Kit', 'Portable Abrasive Rail Cutter'],
        crewRequired: 10,
        powerBlockRequired: false,
        trafficBlockRequired: true,
        slaDeadlineHours: 6,
        status: 'Pending',
        createdAt: 'Just now',
        notes: 'Speed restriction of 20 kmph imposed until block execution.'
      };
      setMaintenanceRequests((prev) => [urgentReq, ...prev]);
    } else if (scenarioType === 'section_closure') {
      newScenario = {
        id: `SCEN-${Date.now().toString().slice(-4)}`,
        type: 'section_closure',
        title: 'Sudden OHE Traction Line Tripping',
        description: 'Substation isolator breaker trip on DN Line (Sec 2 GZB-ALJN). 0 kV catenary tension.',
        corridorId: 'COR-ALPHA-7',
        section: 'Sec 2 (GZB-ALJN)',
        severity: 8.8,
        additionalDelayPredicted: 70,
        conflictsDetected: 4,
        timestamp: 'Just now',
        resolved: false
      };
    } else if (scenarioType === 'traffic_surge') {
      newScenario = {
        id: `SCEN-${Date.now().toString().slice(-4)}`,
        type: 'traffic_surge',
        title: 'Festival Season Passenger Surge (+35% Density)',
        description: '6 Holiday Special Superfast rakes injected into midnight headway slots.',
        corridorId: 'COR-ALPHA-7',
        section: 'All Sections',
        severity: 7.2,
        additionalDelayPredicted: 35,
        conflictsDetected: 2,
        timestamp: 'Just now',
        resolved: false
      };
    } else {
      newScenario = {
        id: `SCEN-${Date.now().toString().slice(-4)}`,
        type: 'fog_weather',
        title: 'Dense Fog & Reduced Visibility (<100m)',
        description: 'Fog safety protocol: Maximum speed capped at 60 kmph with detonators.',
        corridorId: 'COR-ALPHA-7',
        section: 'Northern Corridor',
        severity: 6.5,
        additionalDelayPredicted: 55,
        conflictsDetected: 2,
        timestamp: 'Just now',
        resolved: false
      };
    }

    setScenarios((prev) => [newScenario, ...prev]);
    setActiveScenario(newScenario);

    // Also update train delay predictions
    setTrainSchedules((prev) =>
      prev.map((t) => ({
        ...t,
        delayMinutes: t.delayMinutes + Math.round(newScenario.additionalDelayPredicted * 0.4),
        status: t.delayMinutes > 15 ? 'Delayed' : t.status
      }))
    );

    showToast(`Simulation Injected: ${newScenario.title} (${newScenario.conflictsDetected} conflicts detected).`, 'warning');
  };

  const applyRecoveryPlan = () => {
    if (!activeScenario) return;

    // Resolve scenario and re-align schedule
    setActiveScenario((prev) => (prev ? { ...prev, resolved: true } : null));
    setScenarios((prev) =>
      prev.map((s) => (s.id === activeScenario.id ? { ...s, resolved: true } : s))
    );

    // Normalize train schedules with optimized recovery paths
    setTrainSchedules((prev) =>
      prev.map((t) => ({
        ...t,
        delayMinutes: Math.max(0, Math.round(t.delayMinutes * 0.3)),
        status: 'On-Time'
      }))
    );

    showToast(`Recovery Plan Applied: Train paths re-slotted, delays mitigated by 70%.`, 'success');
  };

  const resetScenarios = () => {
    setActiveScenario(null);
    setScenarios([]);
    setTrainSchedules(INITIAL_TRAIN_SCHEDULE);
    showToast('Simulation state reset to baseline operations.', 'info');
  };

  // Live Operations Alert Actions
  const dismissAlert = (id: string) => {
    setLiveAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, resolved: true } : a)));
  };

  const triggerEmergencyReoptimization = async () => {
    setIsReoptimizing(true);
    showToast('Executing Emergency Re-Optimization: Dynamic Timetable Rerouting & Corridor Shadow Blocks...', 'warning');

    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Resolve active critical alerts
    setLiveAlerts((prev) =>
      prev.map((a) => ({ ...a, resolved: true }))
    );

    setRecentAuditLogs((prev) => [
      {
        id: `LOG-${Date.now().toString().slice(-4)}`,
        action: 'Emergency Dynamic Re-Optimization Executed',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        user: 'RailSync AI Live Engine',
        impact: 'Rerouted 2 Rajdhani services to loop lines; inserted 90-min shadow block.'
      },
      ...prev
    ]);

    setIsReoptimizing(false);
    showToast('Emergency Re-Optimization Complete: All corridor conflicts cleared.', 'success');
  };

  return (
    <RailSyncContext.Provider
      value={{
        activeTab,
        setActiveTab,
        corridors,
        selectedCorridorId,
        setSelectedCorridorId,
        selectedCorridor,
        maintenanceRequests,
        filteredRequests,
        addMaintenanceRequest,
        updateMaintenanceRequest,
        deleteMaintenanceRequest,
        bundledPlans,
        activePlan,
        isOptimizing,
        runMockCPSATOptimization,
        approvePlan,
        manualOverridePlan,
        trainSchedules,
        updateTrainSchedule,
        metrics,
        recentAuditLogs,
        aiParams,
        setAIParams,
        updateDefectCriticality,
        scenarios,
        activeScenario,
        injectScenario,
        applyRecoveryPlan,
        resetScenarios,
        liveAlerts,
        dismissAlert,
        triggerEmergencyReoptimization,
        isReoptimizing,
        filters,
        setFilters,
        resetFilters,
        toastMessage,
        showToast,
        dismissToast,
        isManualOverrideOpen,
        setIsManualOverrideOpen,
        isNewRequestModalOpen,
        setIsNewRequestModalOpen,
        isExportModalOpen,
        setIsExportModalOpen,
        isNotificationsDrawerOpen,
        setIsNotificationsDrawerOpen
      }}
    >
      {children}
    </RailSyncContext.Provider>
  );
};

export const useRailSync = () => {
  const context = useContext(RailSyncContext);
  if (!context) {
    throw new Error('useRailSync must be used within a RailSyncProvider');
  }
  return context;
};
