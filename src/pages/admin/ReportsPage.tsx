import React from 'react';
import { useHostel } from '../../context/HostelContext';
import { exportRoomsToCsv } from '../../utils/exportCsv';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { FileSpreadsheet, Printer, Download, Building } from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { rooms, settings } = useHostel();

  const handleExportCsv = () => {
    exportRoomsToCsv(rooms, settings);
  };

  const handlePrint = () => {
    window.print();
  };

  const totalKw = (rooms.reduce((sum, r) => sum + r.activePowerWatts, 0) / 1000).toFixed(2);
  const totalCost = rooms
    .reduce((sum, r) => sum + r.monthlyUsageKwh * settings.electricityRate, 0)
    .toFixed(2);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Printable Report Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white m-0 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-emerald-400" />
            Hostel Energy Reports & Audit Export
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate formal CSV spreadsheets or print official energy usage statements
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:from-emerald-400 hover:to-cyan-400 shadow-md shadow-emerald-500/20 flex items-center gap-2 transition-all"
          >
            <Download className="w-4 h-4" /> Export CSV Spreadsheet
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-900 text-slate-200 border border-slate-700 hover:bg-slate-800 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-cyan-400" /> Print Statement
          </button>
        </div>
      </div>

      {/* Official Print Header (Only visible during window.print()) */}
      <div className="hidden print-only mb-6 text-slate-900 border-b pb-4">
        <h1 className="text-2xl font-bold">WattWise Hostel Energy Statement</h1>
        <p className="text-sm text-slate-600">
          Generated Date: {new Date().toLocaleDateString()} • System Rate: {settings.currencySymbol}
          {settings.electricityRate}/kWh
        </p>
        <div className="mt-2 text-xs text-slate-700">
          Total Hostel Power Load: <strong>{totalKw} kW</strong> | Total Estimated Bill:{' '}
          <strong>
            {settings.currencySymbol}
            {totalCost}
          </strong>
        </div>
      </div>

      {/* Main Table Container */}
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Floor</th>
                <th className="px-4 py-3">Active Load</th>
                <th className="px-4 py-3">Daily (kWh)</th>
                <th className="px-4 py-3">Monthly (kWh)</th>
                <th className="px-4 py-3">Est. Charge</th>
                <th className="px-4 py-3">Limit Cap</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {rooms.map((room) => {
                const cost = (room.monthlyUsageKwh * settings.electricityRate).toFixed(2);
                const limit = (room.customLimit ?? settings.monthlyChargeLimit).toFixed(2);

                return (
                  <tr key={room.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3 font-extrabold text-white font-sans">
                      Room {room.roomNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-sans">Floor {room.floor}</td>
                    <td className="px-4 py-3 text-cyan-400 font-bold">
                      {room.activePowerWatts} W
                    </td>
                    <td className="px-4 py-3">{room.dailyUsageKwh.toFixed(1)}</td>
                    <td className="px-4 py-3 text-slate-200">{room.monthlyUsageKwh.toFixed(1)}</td>
                    <td className="px-4 py-3 font-bold text-white">
                      {settings.currencySymbol}
                      {cost}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {settings.currencySymbol}
                      {limit}
                    </td>
                    <td className="px-4 py-3 font-sans">
                      {room.status === 'exceeded' ? (
                        <Badge variant="red" size="sm">
                          EXCEEDED
                        </Badge>
                      ) : room.status === 'warning' ? (
                        <Badge variant="amber" size="sm">
                          WARNING
                        </Badge>
                      ) : (
                        <Badge variant="emerald" size="sm">
                          NORMAL
                        </Badge>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
