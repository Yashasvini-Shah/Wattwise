import type { Room, AdminSettings } from '../types/hostel';

export const exportRoomsToCsv = (rooms: Room[], settings: AdminSettings): void => {
  const headers = [
    'Room Number',
    'Floor',
    'Active Load (Watts)',
    'Daily Usage (kWh)',
    'Monthly Usage (kWh)',
    `Est. Monthly Cost (${settings.currencySymbol})`,
    `Budget Limit (${settings.currencySymbol})`,
    'Limit Status',
    'Present Residents',
    'Active Appliances',
  ];

  const rows = rooms.map((room) => {
    const cost = (room.monthlyUsageKwh * settings.electricityRate).toFixed(2);
    const limit = (room.customLimit ?? settings.monthlyChargeLimit).toFixed(2);
    const presentCount = room.residents.filter((r) => r.isPresent).length;
    const activeAppCount = room.appliances.filter((a) => a.isOn).length;

    return [
      room.roomNumber,
      `Floor ${room.floor}`,
      room.activePowerWatts,
      room.dailyUsageKwh.toFixed(1),
      room.monthlyUsageKwh.toFixed(1),
      cost,
      limit,
      room.status.toUpperCase(),
      `${presentCount} / 4`,
      `${activeAppCount} / ${room.appliances.length}`,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `WattWise_Hostel_Energy_Report_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
