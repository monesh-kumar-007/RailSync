export type Department = 'TMS' | 'SMMS' | 'TDMS'; // TMS: Track, SMMS: Signals, TDMS: Traction
export type PriorityLevel = 'P1' | 'P2' | 'P3' | 'P4';
export type TaskStatus = 'Pending' | 'Optimized' | 'Approved' | 'In-Progress' | 'Completed' | 'Deferred';

export interface MaintenanceRequest {
  id: string; // e.g. "MR-8921", "TMS-4402"
  title: string;
  department: Department;
  deptFullName: string; // "Track Management System (TMS)", etc.
  corridorId: string;
  section: string; // e.g. "Sec 4, MP 12-14"
  startKm: number;
  endKm: number;
  trackLine: 'UP Line' | 'DN Line' | 'Both Lines' | 'Yard/Loop';
  durationHours: number;
  priority: PriorityLevel;
  criticalityScore: number; // 0 - 10
  calculatedAIPriority: number; // dynamically computed 0 - 100
  defectType: string;
  machineryRequired: string[];
  crewRequired: number;
  powerBlockRequired: boolean; // TDMS OHE shutdown
  trafficBlockRequired: boolean;
  slaDeadlineHours: number;
  status: TaskStatus;
  bundledBlockId?: string;
  createdAt: string;
  notes?: string;
}

export interface TrainScheduleItem {
  id: string;
  trainNumber: string;
  trainName: string;
  type: 'Vande Bharat' | 'Rajdhani / Shatabdi' | 'Mail / Express' | 'Freight Container' | 'Freight Heavy Haul';
  corridorId: string;
  direction: 'UP' | 'DN';
  scheduledEntry: string; // "04:30"
  scheduledExit: string;  // "07:15"
  priorityTier: 1 | 2 | 3 | 4; // 1 = highest (Vande Bharat), 4 = freight
  speedKmph: number;
  status: 'On-Time' | 'Delayed' | 'Regulated' | 'Rerouted';
  delayMinutes: number;
}

export interface BundledBlockPlan {
  id: string; // "BLK-ALPHA7-01"
  corridorId: string;
  corridorName: string;
  section: string;
  trackLine: 'UP Line' | 'DN Line' | 'Both Lines';
  proposedStart: string; // "01:30"
  proposedEnd: string;   // "05:30"
  durationHours: number;
  tasks: MaintenanceRequest[];
  safetyChecklist: {
    noUnsafeOverlaps: boolean;
    slaSatisfied: boolean;
    resourceConstraintsMet: boolean;
    powerIsolationConfirmed: boolean;
  };
  impactAnalysis: {
    trainsRegulated: number;
    totalDelayMinutes: number;
    blockHoursSaved: number;
    assetAvailabilityScore: number;
  };
  status: 'Proposed' | 'Approved' | 'Active' | 'Completed' | 'Modified';
  approvedAt?: string;
}

export interface Corridor {
  id: string;
  name: string;
  zone: string; // "Northern Railway", "Western Railway", etc.
  totalKm: number;
  sections: string[];
  activeBlocksCount: number;
  pendingRequestsCount: number;
  operationalStatus: 'Optimal' | 'Caution' | 'Congested' | 'Maintenance Active';
}

export interface DefectItem {
  id: string;
  name: string;
  department: Department;
  defaultCriticality: number; // 0 - 10
  trafficImpactWeight: number; // 0 - 1
  safetyRiskMultiplier: number;
  recommendedMachinery: string;
  standardDuration: number;
}

export interface WhatIfScenario {
  id: string;
  type: 'emergency_defect' | 'section_closure' | 'traffic_surge' | 'fog_weather';
  title: string;
  description: string;
  corridorId?: string;
  section: string;
  severity: number | string;
  additionalDelayPredicted: number;
  conflictsDetected: number;
  timestamp?: string;
  resolved: boolean;
}

export type TrainSchedule = TrainScheduleItem;
export type SimulationScenario = WhatIfScenario;

export interface LiveAlert {
  id: string;
  title: string;
  department: Department;
  section: string;
  severity: 'Critical' | 'Warning' | 'Info';
  message: string;
  timestamp: string;
  requiresReoptimization: boolean;
  resolved: boolean;
}

export interface SystemMetrics {
  blockHoursSaved: number; // e.g. 1420
  blockHoursSavedTrendPct: number; // +12%
  assetAvailability: number; // e.g. 95.4
  assetAvailabilityTrendPct: number; // +2.1%
  bundledTasksCount: number; // 342
  bundledPct: number; // 75%
  singlePct: number; // 25%
  conventionalAvgBlockHours: number; // 12.0
  aiAvgBlockHours: number; // 7.5
  conventionalWeeklyConflicts: number; // 8
  aiWeeklyConflicts: number; // 2
  conventionalNetworkAvailability: number; // 89.0
  aiNetworkAvailability: number; // 95.4
}
