export type Role = 'admin' | 'student';

export interface Resident {
  id: string;
  name: string;
  isPresent: boolean;
}

export type ApplianceType = 'light' | 'fan' | 'ac' | 'lamp' | 'laptop' | 'fridge' | 'heater';

export interface Appliance {
  id: string;
  name: string;
  type: ApplianceType;
  powerWatts: number;
  isOn: boolean;
  controllableByStudent: boolean;
}

export interface Room {
  id: string; // e.g. "301"
  floor: number; // 1 - 5
  roomNumber: number; // e.g. 301
  residents: Resident[]; // 4 residents
  temperature: number; // °C
  humidity: number; // %
  appliances: Appliance[];
  activePowerWatts: number;
  dailyUsageKwh: number;
  monthlyUsageKwh: number;
  customLimit?: number;
  status: 'normal' | 'warning' | 'exceeded';
}

export interface AlertItem {
  id: string;
  roomId: string;
  roomNumber: string;
  floor: number;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  dismissed: boolean;
}

export interface AiRecommendation {
  id: string;
  title: string;
  category: 'efficiency' | 'occupancy' | 'anomaly' | 'peak_saving';
  roomId?: string;
  description: string;
  potentialSavings: string;
  impact: 'high' | 'medium' | 'low';
  actionText: string;
  applied: boolean;
}

export interface AdminSettings {
  electricityRate: number; // per kWh (e.g. 0.15)
  monthlyChargeLimit: number; // per room limit (e.g. 50)
  currencySymbol: string; // '$' or '₹'
  studentPreviewMode: boolean;
  autoAlertThresholdWatts: number; // default e.g. 1500W
  simulatedTimeOfDay: string; // e.g. "14:30"
}

export interface AuthState {
  isAuthenticated: boolean;
  user: {
    username: string;
    role: Role;
    roomId?: string;
    floorId?: number;
  } | null;
}

export interface HourlyEnergyPoint {
  hour: string;
  totalKw: number;
  averageWattsPerRoom: number;
  cost: number;
}

export interface ApplianceBreakdown {
  name: string;
  value: number; // percentage or kWh
  color: string;
}
