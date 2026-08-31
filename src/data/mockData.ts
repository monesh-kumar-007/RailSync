import {
  Corridor,
  MaintenanceRequest,
  TrainScheduleItem,
  BundledBlockPlan,
  DefectItem,
  SystemMetrics,
  LiveAlert
} from '../types';

export const INITIAL_CORRIDORS: Corridor[] = [
  {
    id: 'COR-ALPHA-7',
    name: 'Corridor Alpha-7 (New Delhi - Kanpur Central)',
    zone: 'Northern Railway / North Central Railway',
    totalKm: 440,
    sections: ['Sec 1 (NDLS-GZB)', 'Sec 2 (GZB-ALJN)', 'Sec 3 (ALJN-TDL)', 'Sec 4, MP 12-14 (TDL-ETW)', 'Sec 5 (ETW-CNB)'],
    activeBlocksCount: 3,
    pendingRequestsCount: 14,
    operationalStatus: 'Optimal'
  },
  {
    id: 'COR-BETA-3',
    name: 'Corridor Beta-3 (Mumbai Central - Vadodara)',
    zone: 'Western Railway',
    totalKm: 392,
    sections: ['Sec 1 (MMCT-BVI)', 'Sec 2 (BVI-VR)', 'Sec 3 (VR-BL)', 'Sec 4 (BL-ST)', 'Sec 5 (ST-BRC)'],
    activeBlocksCount: 2,
    pendingRequestsCount: 9,
    operationalStatus: 'Caution'
  },
  {
    id: 'COR-GAMMA-1',
    name: 'Corridor Gamma-1 (Howrah - DDU Mughalsarai)',
    zone: 'Eastern Railway / East Central Railway',
    totalKm: 650,
    sections: ['Sec 1 (HWH-BWN)', 'Sec 2 (BWN-ASN)', 'Sec 3 (ASN-DHN)', 'Sec 4 (DHN-GAYA)', 'Sec 5 (GAYA-DDU)'],
    activeBlocksCount: 4,
    pendingRequestsCount: 18,
    operationalStatus: 'Optimal'
  },
  {
    id: 'COR-DELTA-5',
    name: 'Corridor Delta-5 (Chennai Central - Vijayawada)',
    zone: 'Southern Railway / South Central Railway',
    totalKm: 430,
    sections: ['Sec 1 (MAS-GDR)', 'Sec 2 (GDR-NLR)', 'Sec 3 (NLR-OGL)', 'Sec 4 (OGL-TEL)', 'Sec 5 (TEL-BZA)'],
    activeBlocksCount: 1,
    pendingRequestsCount: 7,
    operationalStatus: 'Optimal'
  }
];

export const DEFECT_CATALOG: DefectItem[] = [
  {
    id: 'DEF-01',
    name: 'Ultrasonic Rail Flaw (USFD - Transverse Fissure)',
    department: 'TMS',
    defaultCriticality: 8.5,
    trafficImpactWeight: 0.85,
    safetyRiskMultiplier: 1.4,
    recommendedMachinery: 'Rail Cutting Machine & Mobile Flash-Butt Welder',
    standardDuration: 4.0
  },
  {
    id: 'DEF-02',
    name: 'Deep Ballast Screening & Track Geometry Correction',
    department: 'TMS',
    defaultCriticality: 6.0,
    trafficImpactWeight: 0.70,
    safetyRiskMultiplier: 1.1,
    recommendedMachinery: 'BCM-09 & 09-3X Dynamic Tamping Machine',
    standardDuration: 3.5
  },
  {
    id: 'DEF-03',
    name: 'Point Machine Backlash & Obstruction Test Failure',
    department: 'SMMS',
    defaultCriticality: 7.8,
    trafficImpactWeight: 0.90,
    safetyRiskMultiplier: 1.35,
    recommendedMachinery: 'Point Test Kit & Ground Connection Tooling',
    standardDuration: 2.5
  },
  {
    id: 'DEF-04',
    name: 'Electronic Interlocking (EI) Diagnostic & Standby Switch',
    department: 'SMMS',
    defaultCriticality: 7.0,
    trafficImpactWeight: 0.80,
    safetyRiskMultiplier: 1.25,
    recommendedMachinery: 'VDU Diagnostic Terminal & Optical Splicer',
    standardDuration: 2.0
  },
  {
    id: 'DEF-05',
    name: 'OHE Contact Wire Wear & Sag (Traction Surge)',
    department: 'TDMS',
    defaultCriticality: 8.0,
    trafficImpactWeight: 0.95,
    safetyRiskMultiplier: 1.3,
    recommendedMachinery: 'Self-Propelled 8-Wheeler Tower Wagon (DETC)',
    standardDuration: 3.5
  },
  {
    id: 'DEF-06',
    name: 'Neutral Section & Isolator Jumper Replacement',
    department: 'TDMS',
    defaultCriticality: 5.5,
    trafficImpactWeight: 0.65,
    safetyRiskMultiplier: 1.15,
    recommendedMachinery: 'Hydraulic Platform Wagon & Grounding Rods',
    standardDuration: 2.5
  }
];

export const INITIAL_MAINTENANCE_REQUESTS: MaintenanceRequest[] = [
  {
    id: 'MR-8921',
    title: 'Track Geometry Inspection & Weld Radiography',
    department: 'TMS',
    deptFullName: 'Track Management System (TMS)',
    corridorId: 'COR-ALPHA-7',
    section: 'Sec 4, MP 12-14',
    startKm: 312.4,
    endKm: 315.8,
    trackLine: 'UP Line',
    durationHours: 4.0,
    priority: 'P1',
    criticalityScore: 8.4,
    calculatedAIPriority: 92,
    defectType: 'Ultrasonic Rail Flaw (USFD - Transverse Fissure)',
    machineryRequired: ['USFD Testing Trolley', 'Mobile Welder'],
    crewRequired: 14,
    powerBlockRequired: false,
    trafficBlockRequired: true,
    slaDeadlineHours: 24,
    status: 'Optimized',
    bundledBlockId: 'BLK-ALPHA7-01',
    createdAt: '2026-08-30 08:30',
    notes: 'Severe acoustic flaw detected near turnout junction MP 13.2'
  },
  {
    id: 'MR-8922',
    title: 'Point Machine Overhaul & Track Circuit Tuning',
    department: 'SMMS',
    deptFullName: 'Signal & Telecom Management (SMMS)',
    corridorId: 'COR-ALPHA-7',
    section: 'Sec 4, MP 12-14',
    startKm: 313.1,
    endKm: 314.0,
    trackLine: 'UP Line',
    durationHours: 3.5,
    priority: 'P2',
    criticalityScore: 7.6,
    calculatedAIPriority: 88,
    defectType: 'Point Machine Backlash & Obstruction Test Failure',
    machineryRequired: ['Signaling Test Rake', 'Digital Multimeter & Oscilloscope'],
    crewRequired: 8,
    powerBlockRequired: false,
    trafficBlockRequired: true,
    slaDeadlineHours: 36,
    status: 'Optimized',
    bundledBlockId: 'BLK-ALPHA7-01',
    createdAt: '2026-08-30 09:15',
    notes: 'Micro-switch contact degradation observed during quarterly inspection'
  },
  {
    id: 'MR-8923',
    title: 'OHE Cantilever Realignment & Isolator Replacement',
    department: 'TDMS',
    deptFullName: 'Traction Distribution Management (TDMS)',
    corridorId: 'COR-ALPHA-7',
    section: 'Sec 4, MP 12-14',
    startKm: 312.0,
    endKm: 316.0,
    trackLine: 'UP Line',
    durationHours: 4.0,
    priority: 'P1',
    criticalityScore: 8.2,
    calculatedAIPriority: 90,
    defectType: 'OHE Contact Wire Wear & Sag (Traction Surge)',
    machineryRequired: ['8-Wheeler DETC Tower Wagon', 'Earthing Poles & Catenary Tensioner'],
    crewRequired: 12,
    powerBlockRequired: true,
    trafficBlockRequired: true,
    slaDeadlineHours: 24,
    status: 'Optimized',
    bundledBlockId: 'BLK-ALPHA7-01',
    createdAt: '2026-08-30 09:45',
    notes: 'High wind sag detected by pantograph optical monitoring'
  },
  {
    id: 'MR-7712',
    title: 'Ballast Tamping & Track Lifting',
    department: 'TMS',
    deptFullName: 'Track Management System (TMS)',
    corridorId: 'COR-ALPHA-7',
    section: 'Sec 2 (GZB-ALJN)',
    startKm: 78.5,
    endKm: 84.0,
    trackLine: 'DN Line',
    durationHours: 3.0,
    priority: 'P3',
    criticalityScore: 5.8,
    calculatedAIPriority: 64,
    defectType: 'Deep Ballast Screening & Track Geometry Correction',
    machineryRequired: ['09-3X Dynamic Tamping Machine'],
    crewRequired: 16,
    powerBlockRequired: false,
    trafficBlockRequired: true,
    slaDeadlineHours: 72,
    status: 'Pending',
    createdAt: '2026-08-30 11:00'
  },
  {
    id: 'MR-6540',
    title: 'Axle Counter Double-Head Sensor Calibration',
    department: 'SMMS',
    deptFullName: 'Signal & Telecom Management (SMMS)',
    corridorId: 'COR-BETA-3',
    section: 'Sec 3 (VR-BL)',
    startKm: 142.0,
    endKm: 143.5,
    trackLine: 'Both Lines',
    durationHours: 2.0,
    priority: 'P2',
    criticalityScore: 6.9,
    calculatedAIPriority: 75,
    defectType: 'Electronic Interlocking (EI) Diagnostic & Standby Switch',
    machineryRequired: ['Axle Calibration Kit'],
    crewRequired: 6,
    powerBlockRequired: false,
    trafficBlockRequired: true,
    slaDeadlineHours: 48,
    status: 'Pending',
    createdAt: '2026-08-30 12:20'
  },
  {
    id: 'MR-5491',
    title: 'Neutral Section Insulator Cleaning & Jumper Test',
    department: 'TDMS',
    deptFullName: 'Traction Distribution Management (TDMS)',
    corridorId: 'COR-GAMMA-1',
    section: 'Sec 4 (DHN-GAYA)',
    startKm: 388.0,
    endKm: 391.2,
    trackLine: 'DN Line',
    durationHours: 3.5,
    priority: 'P2',
    criticalityScore: 7.2,
    calculatedAIPriority: 81,
    defectType: 'Neutral Section & Isolator Jumper Replacement',
    machineryRequired: ['Tower Wagon', 'Discharge Rods'],
    crewRequired: 10,
    powerBlockRequired: true,
    trafficBlockRequired: true,
    slaDeadlineHours: 48,
    status: 'Pending',
    createdAt: '2026-08-30 13:00'
  }
];

export const INITIAL_BUNDLED_PLANS: BundledBlockPlan[] = [
  {
    id: 'BLK-ALPHA7-01',
    corridorId: 'COR-ALPHA-7',
    corridorName: 'Corridor Alpha-7 (New Delhi - Kanpur Central)',
    section: 'Sec 4, MP 12-14',
    trackLine: 'UP Line',
    proposedStart: '01:30',
    proposedEnd: '05:30',
    durationHours: 4.0,
    tasks: [
      INITIAL_MAINTENANCE_REQUESTS[0], // MR-8921 (TMS)
      INITIAL_MAINTENANCE_REQUESTS[1], // MR-8922 (SMMS)
      INITIAL_MAINTENANCE_REQUESTS[2], // MR-8923 (TDMS)
    ],
    safetyChecklist: {
      noUnsafeOverlaps: true,
      slaSatisfied: true,
      resourceConstraintsMet: true,
      powerIsolationConfirmed: true
    },
    impactAnalysis: {
      trainsRegulated: 2,
      totalDelayMinutes: 18,
      blockHoursSaved: 7.5,
      assetAvailabilityScore: 95.4
    },
    status: 'Proposed'
  }
];

export const INITIAL_TRAIN_SCHEDULE: TrainScheduleItem[] = [
  {
    id: 'TRN-22436',
    trainNumber: '22436',
    trainName: 'Vande Bharat Express (NDLS-BSB)',
    type: 'Vande Bharat',
    corridorId: 'COR-ALPHA-7',
    direction: 'DN',
    scheduledEntry: '06:00',
    scheduledExit: '08:45',
    priorityTier: 1,
    speedKmph: 130,
    status: 'On-Time',
    delayMinutes: 0
  },
  {
    id: 'TRN-12302',
    trainNumber: '12302',
    trainName: 'Howrah Rajdhani Express',
    type: 'Rajdhani / Shatabdi',
    corridorId: 'COR-ALPHA-7',
    direction: 'UP',
    scheduledEntry: '00:45',
    scheduledExit: '04:15',
    priorityTier: 2,
    speedKmph: 120,
    status: 'Regulated',
    delayMinutes: 12
  },
  {
    id: 'TRN-12004',
    trainNumber: '12004',
    trainName: 'Lucknow Shatabdi Express',
    type: 'Rajdhani / Shatabdi',
    corridorId: 'COR-ALPHA-7',
    direction: 'DN',
    scheduledEntry: '06:30',
    scheduledExit: '09:50',
    priorityTier: 2,
    speedKmph: 110,
    status: 'On-Time',
    delayMinutes: 0
  },
  {
    id: 'TRN-12424',
    trainNumber: '12424',
    trainName: 'Dibrugarh Town Rajdhani',
    type: 'Rajdhani / Shatabdi',
    corridorId: 'COR-ALPHA-7',
    direction: 'DN',
    scheduledEntry: '16:40',
    scheduledExit: '20:10',
    priorityTier: 2,
    speedKmph: 115,
    status: 'On-Time',
    delayMinutes: 0
  },
  {
    id: 'TRN-12876',
    trainNumber: '12876',
    trainName: 'Neelachal Superfast Express',
    type: 'Mail / Express',
    corridorId: 'COR-ALPHA-7',
    direction: 'UP',
    scheduledEntry: '01:10',
    scheduledExit: '05:00',
    priorityTier: 3,
    speedKmph: 100,
    status: 'Rerouted',
    delayMinutes: 6
  },
  {
    id: 'FRT-99821',
    trainNumber: 'CONTR-99821',
    trainName: 'CONCOR Double-Stack Container',
    type: 'Freight Container',
    corridorId: 'COR-ALPHA-7',
    direction: 'UP',
    scheduledEntry: '02:00',
    scheduledExit: '06:30',
    priorityTier: 4,
    speedKmph: 75,
    status: 'Regulated',
    delayMinutes: 20
  }
];

export const INITIAL_METRICS: SystemMetrics = {
  blockHoursSaved: 1420,
  blockHoursSavedTrendPct: 12.0,
  assetAvailability: 95.4,
  assetAvailabilityTrendPct: 2.1,
  bundledTasksCount: 342,
  bundledPct: 75,
  singlePct: 25,
  conventionalAvgBlockHours: 12.0,
  aiAvgBlockHours: 7.5,
  conventionalWeeklyConflicts: 8,
  aiWeeklyConflicts: 2,
  conventionalNetworkAvailability: 89.0,
  aiNetworkAvailability: 95.4
};

export const INITIAL_LIVE_ALERTS: LiveAlert[] = [
  {
    id: 'ALT-101',
    title: 'Track Circuit S-42 Low Impedance Warning',
    department: 'SMMS',
    section: 'Corridor Alpha-7 (Sec 4, MP 13.2)',
    severity: 'Warning',
    message: 'Monsoon water accumulation detected near point machine switch 11B.',
    timestamp: '2 mins ago',
    requiresReoptimization: true,
    resolved: false
  },
  {
    id: 'ALT-102',
    title: 'OHE Pantograph Optical Anomaly Detected',
    department: 'TDMS',
    section: 'Corridor Beta-3 (Sec 2, MP 88.4)',
    severity: 'Critical',
    message: 'Spike in contact pressure detected at 110 kmph on UP line.',
    timestamp: '14 mins ago',
    requiresReoptimization: true,
    resolved: false
  },
  {
    id: 'ALT-103',
    title: 'Scheduled Tamping Machine Crew Check-in',
    department: 'TMS',
    section: 'Corridor Gamma-1 (Sec 1, MP 24.0)',
    severity: 'Info',
    message: 'Machine 09-3X certified and positioned on siding line 3.',
    timestamp: '32 mins ago',
    requiresReoptimization: false,
    resolved: true
  }
];
