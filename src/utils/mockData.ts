import type { Room, AlertItem, AiRecommendation, AdminSettings, HourlyEnergyPoint, Resident, Appliance } from '../types/hostel';

const RESIDENT_NAMES = [
  ['Alex Vance', 'Sam Rivera', 'Jordan Lee', 'Chris Morgan'],
  ['Ethan Hunt', 'Liam Neeson', 'Noah Smith', 'Oliver Brown'],
  ['Lucas Miller', 'Mason Davis', 'Logan Wilson', 'James Taylor'],
  ['Benjamin Clark', 'Henry White', 'Alexander Harris', 'Sebastian Martin'],
  ['Jack Thompson', 'Owen Garcia', 'Gabriel Martinez', 'Daniel Robinson'],
];

export const generateInitialRooms = (): Room[] => {
  const rooms: Room[] = [];

  for (let floor = 1; floor <= 5; floor++) {
    for (let roomIndex = 1; roomIndex <= 5; roomIndex++) {
      const roomNum = floor * 100 + roomIndex;
      const roomId = roomNum.toString();

      // Deterministic variation based on room number
      const namesIndex = (floor + roomIndex) % RESIDENT_NAMES.length;
      const residentNames = RESIDENT_NAMES[namesIndex];
      const residents: Resident[] = residentNames.map((name, i) => ({
        id: `${roomId}-res-${i + 1}`,
        name,
        isPresent: (roomIndex + i) % 2 === 0 || i === 0, // at least 1 resident present
      }));

      // Appliances configuration
      const isOverloadedRoom = roomNum === 304 || roomNum === 102 || roomNum === 405;
      const isHighCoolingRoom = roomNum === 203 || roomNum === 501;

      const appliances: Appliance[] = [
        {
          id: `${roomId}-app-1`,
          name: 'Ceiling Fan',
          type: 'fan',
          powerWatts: 65,
          isOn: true,
          controllableByStudent: true,
        },
        {
          id: `${roomId}-app-2`,
          name: 'Main LED Lights',
          type: 'light',
          powerWatts: 30,
          isOn: true,
          controllableByStudent: true,
        },
        {
          id: `${roomId}-app-3`,
          name: 'Desk Study Lamp',
          type: 'lamp',
          powerWatts: 15,
          isOn: (roomNum + 1) % 2 === 0,
          controllableByStudent: true,
        },
        {
          id: `${roomId}-app-4`,
          name: isHighCoolingRoom ? 'High Power AC (1.5 Ton)' : 'Air Conditioner',
          type: 'ac',
          powerWatts: isHighCoolingRoom ? 1500 : 1200,
          isOn: isOverloadedRoom || isHighCoolingRoom || roomNum % 2 === 1,
          controllableByStudent: true,
        },
        {
          id: `${roomId}-app-5`,
          name: 'Laptops & Chargers',
          type: 'laptop',
          powerWatts: 90,
          isOn: true,
          controllableByStudent: false,
        },
        {
          id: `${roomId}-app-6`,
          name: 'Compact Refrigerator',
          type: 'fridge',
          powerWatts: 150,
          isOn: true,
          controllableByStudent: false,
        },
      ];

      // Calculate active power load (Watts)
      const activeWatts = appliances.reduce((sum, app) => sum + (app.isOn ? app.powerWatts : 0), 0);

      // Usage estimations
      let monthlyKwh = Math.round((activeWatts * 0.024 * 30 * (0.8 + (roomIndex * 0.08))) * 10) / 10;
      if (isOverloadedRoom) {
        monthlyKwh = 380; // High consumption room exceeding budget
      }

      const dailyKwh = Math.round((monthlyKwh / 30) * 10) / 10;

      // Status determination
      let status: 'normal' | 'warning' | 'exceeded' = 'normal';
      const defaultLimitCost = 50; // $50 default limit
      const currentCostEst = monthlyKwh * 0.15; // default 0.15/kWh rate

      if (currentCostEst > defaultLimitCost) {
        status = 'exceeded';
      } else if (currentCostEst > defaultLimitCost * 0.85) {
        status = 'warning';
      }

      rooms.push({
        id: roomId,
        floor,
        roomNumber: roomNum,
        residents,
        temperature: Math.round((22 + (roomNum % 5) * 0.8) * 10) / 10,
        humidity: Math.round((48 + (roomNum % 4) * 3) * 10) / 10,
        appliances,
        activePowerWatts: activeWatts,
        dailyUsageKwh: dailyKwh,
        monthlyUsageKwh: monthlyKwh,
        status,
      });
    }
  }

  return rooms;
};

export const defaultSettings: AdminSettings = {
  electricityRate: 0.15,
  monthlyChargeLimit: 50.0,
  currencySymbol: '$',
  studentPreviewMode: false,
  autoAlertThresholdWatts: 1400,
  simulatedTimeOfDay: '14:30',
};

export const initialAlerts: AlertItem[] = [
  {
    id: 'alt-1',
    roomId: '304',
    roomNumber: '304',
    floor: 3,
    timestamp: '10 mins ago',
    severity: 'critical',
    title: 'Budget Limit Exceeded',
    message: 'Room 304 has crossed the monthly allocation limit ($50.00). Current estimate: $57.00.',
    dismissed: false,
  },
  {
    id: 'alt-2',
    roomId: '102',
    roomNumber: '102',
    floor: 1,
    timestamp: '25 mins ago',
    severity: 'warning',
    title: 'High Load Alert (1495W)',
    message: 'Simultaneous AC, Fridge, Fan, and high load devices detected in Room 102.',
    dismissed: false,
  },
  {
    id: 'alt-3',
    roomId: '405',
    roomNumber: '405',
    floor: 4,
    timestamp: '1 hour ago',
    severity: 'warning',
    title: 'Unattended Appliance Usage',
    message: 'Air Conditioner running while 0 residents are marked present in Room 405.',
    dismissed: false,
  },
  {
    id: 'alt-4',
    roomId: '203',
    roomNumber: '203',
    floor: 2,
    timestamp: '3 hours ago',
    severity: 'info',
    title: 'Optimal Cooling Efficiency',
    message: 'Room 203 lowered HVAC load by 18% following smart recommendation.',
    dismissed: false,
  },
];

export const initialRecommendations: AiRecommendation[] = [
  {
    id: 'rec-1',
    title: 'Automate Unoccupied AC Shutdown',
    category: 'occupancy',
    roomId: '405',
    description: 'Room 405 has AC turned on for over 3 hours while all 4 residents are out. Auto-off could save up to 4.5 kWh daily.',
    potentialSavings: '$18.50 / month',
    impact: 'high',
    actionText: 'Turn Off AC & Notify Room',
    applied: false,
  },
  {
    id: 'rec-2',
    title: 'Optimize Peak Time AC Setpoints (24°C)',
    category: 'peak_saving',
    description: 'Raising target AC temperature from 20°C to 24°C between 2:00 PM - 6:00 PM across Floor 3 reduces peak load spikes by 22%.',
    potentialSavings: '$42.00 / month',
    impact: 'high',
    actionText: 'Apply Floor 3 Eco Rule',
    applied: false,
  },
  {
    id: 'rec-3',
    title: 'LED Lighting Conversion Audit',
    category: 'efficiency',
    description: 'Replace remaining legacy fixtures in 4 rooms with 30W LED arrays to maintain brightness while reducing fixture power by 40%.',
    potentialSavings: '$12.80 / month',
    impact: 'medium',
    actionText: 'Schedule Audit Task',
    applied: false,
  },
  {
    id: 'rec-4',
    title: 'Detect Anomalous Standby Power',
    category: 'anomaly',
    roomId: '102',
    description: 'Room 102 displays consistent overnight load of 450W, indicating high vampire load or unapproved heavy electronics.',
    potentialSavings: '$15.20 / month',
    impact: 'medium',
    actionText: 'Send Alert to Room 102',
    applied: false,
  },
];

export const generate24HourTrend = (): HourlyEnergyPoint[] => {
  const hours = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00',
    '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  const baseLoads = [12.4, 10.8, 9.5, 11.2, 18.5, 24.2, 28.9, 34.5, 32.1, 38.4, 31.0, 20.2];

  return hours.map((hour, idx) => ({
    hour,
    totalKw: baseLoads[idx],
    averageWattsPerRoom: Math.round((baseLoads[idx] * 1000) / 25),
    cost: Math.round(baseLoads[idx] * 0.15 * 100) / 100,
  }));
};
