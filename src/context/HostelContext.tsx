import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Room, AdminSettings, AlertItem, AiRecommendation } from '../types/hostel';
import {
  loadRoomsData,
  saveRoomsData,
  loadAdminSettings,
  saveAdminSettings,
  loadAlertsData,
  saveAlertsData,
  loadRecommendationsData,
  saveRecommendationsData,
  resetAllToDefaults,
} from '../utils/storage';

interface HostelContextType {
  rooms: Room[];
  settings: AdminSettings;
  alerts: AlertItem[];
  recommendations: AiRecommendation[];
  toggleAppliance: (roomId: string, applianceId: string) => void;
  toggleResidentPresence: (roomId: string, residentId: string) => void;
  updateSettings: (newSettings: Partial<AdminSettings>) => void;
  updateRoomLimit: (roomId: string, limit: number) => void;
  dismissAlert: (alertId: string) => void;
  clearAllAlerts: () => void;
  applyRecommendation: (recId: string) => void;
  resetSystemData: () => void;
  getRoomById: (roomId: string) => Room | undefined;
}

const HostelContext = createContext<HostelContextType | undefined>(undefined);

export const HostelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<Room[]>(() => loadRoomsData());
  const [settings, setSettings] = useState<AdminSettings>(() => loadAdminSettings());
  const [alerts, setAlerts] = useState<AlertItem[]>(() => loadAlertsData());
  const [recommendations, setRecommendations] = useState<AiRecommendation[]>(() =>
    loadRecommendationsData()
  );

  // Sync to local storage
  useEffect(() => {
    saveRoomsData(rooms);
  }, [rooms]);

  useEffect(() => {
    saveAdminSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveAlertsData(alerts);
  }, [alerts]);

  useEffect(() => {
    saveRecommendationsData(recommendations);
  }, [recommendations]);

  // Recalculate room usage and budget status helper
  const recalculateRoom = useCallback(
    (room: Room, currentSettings: AdminSettings): Room => {
      const activeWatts = room.appliances.reduce(
        (sum, app) => sum + (app.isOn ? app.powerWatts : 0),
        0
      );

      // Estimate monthly usage adjustments based on current power load variation
      const dailyKwh = Math.max(0.5, Math.round((activeWatts * 0.018 * 24) * 10) / 10);
      const monthlyKwh = Math.max(15, Math.round((dailyKwh * 30) * 10) / 10);

      const limit = room.customLimit ?? currentSettings.monthlyChargeLimit;
      const estimatedCost = monthlyKwh * currentSettings.electricityRate;

      let status: 'normal' | 'warning' | 'exceeded' = 'normal';
      if (estimatedCost > limit) {
        status = 'exceeded';
      } else if (estimatedCost > limit * 0.85) {
        status = 'warning';
      }

      return {
        ...room,
        activePowerWatts: activeWatts,
        dailyUsageKwh: dailyKwh,
        monthlyUsageKwh: monthlyKwh,
        status,
      };
    },
    []
  );

  // Toggle appliance status for a room
  const toggleAppliance = (roomId: string, applianceId: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== roomId) return room;

        const updatedAppliances = room.appliances.map((app) =>
          app.id === applianceId ? { ...app, isOn: !app.isOn } : app
        );

        return recalculateRoom(
          {
            ...room,
            appliances: updatedAppliances,
          },
          settings
        );
      })
    );
  };

  // Toggle resident presence
  const toggleResidentPresence = (roomId: string, residentId: string) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== roomId) return room;

        const updatedResidents = room.residents.map((res) =>
          res.id === residentId ? { ...res, isPresent: !res.isPresent } : res
        );

        return {
          ...room,
          residents: updatedResidents,
        };
      })
    );
  };

  // Update admin settings
  const updateSettings = (newSettings: Partial<AdminSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      // Recalculate all rooms with updated settings (e.g. rate or limit changed)
      setRooms((prevRooms) => prevRooms.map((r) => recalculateRoom(r, updated)));
      return updated;
    });
  };

  // Update custom room budget limit
  const updateRoomLimit = (roomId: string, limit: number) => {
    setRooms((prevRooms) =>
      prevRooms.map((room) => {
        if (room.id !== roomId) return room;
        return recalculateRoom({ ...room, customLimit: limit }, settings);
      })
    );
  };

  // Alert management
  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === alertId ? { ...a, dismissed: true } : a)));
  };

  const clearAllAlerts = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, dismissed: true })));
  };

  // Apply AI Recommendation
  const applyRecommendation = (recId: string) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, applied: true } : r))
    );

    const rec = recommendations.find((r) => r.id === recId);
    if (rec && rec.roomId) {
      // e.g. turn off AC in target room
      setRooms((prevRooms) =>
        prevRooms.map((room) => {
          if (room.id !== rec.roomId) return room;
          const updatedApps = room.appliances.map((app) =>
            app.type === 'ac' ? { ...app, isOn: false } : app
          );
          return recalculateRoom({ ...room, appliances: updatedApps }, settings);
        })
      );
    }
  };

  // System reset to defaults
  const resetSystemData = () => {
    const res = resetAllToDefaults();
    setRooms(res.rooms);
    setSettings(res.settings);
    setAlerts(res.alerts);
    setRecommendations(res.recs);
  };

  const getRoomById = (roomId: string) => {
    return rooms.find((r) => r.id === roomId);
  };

  return (
    <HostelContext.Provider
      value={{
        rooms,
        settings,
        alerts,
        recommendations,
        toggleAppliance,
        toggleResidentPresence,
        updateSettings,
        updateRoomLimit,
        dismissAlert,
        clearAllAlerts,
        applyRecommendation,
        resetSystemData,
        getRoomById,
      }}
    >
      {children}
    </HostelContext.Provider>
  );
};

export const useHostel = (): HostelContextType => {
  const context = useContext(HostelContext);
  if (!context) {
    throw new Error('useHostel must be used within a HostelProvider');
  }
  return context;
};
