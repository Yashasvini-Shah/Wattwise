import type { AuthState, Room, AdminSettings, AlertItem, AiRecommendation } from '../types/hostel';
import { generateInitialRooms, defaultSettings, initialAlerts, initialRecommendations } from './mockData';

const KEYS = {
  AUTH: 'wattwise_auth_session',
  ROOMS: 'wattwise_rooms_data_v1',
  SETTINGS: 'wattwise_admin_settings_v1',
  ALERTS: 'wattwise_alerts_data_v1',
  RECOMMENDATIONS: 'wattwise_ai_recs_v1',
};

// Safe JSON parser helper
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return fallback;
    return JSON.parse(item) as T;
  } catch (error) {
    console.error(`Error loading key "${key}" from localStorage:`, error);
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key "${key}" to localStorage:`, error);
  }
}

// Auth state
export const loadAuthState = (): AuthState => {
  return loadFromStorage<AuthState>(KEYS.AUTH, {
    isAuthenticated: false,
    user: null,
  });
};

export const saveAuthState = (state: AuthState): void => {
  saveToStorage(KEYS.AUTH, state);
};

export const clearAuthState = (): void => {
  localStorage.removeItem(KEYS.AUTH);
};

// Rooms state
export const loadRoomsData = (): Room[] => {
  const rooms = loadFromStorage<Room[]>(KEYS.ROOMS, []);
  if (!rooms || rooms.length === 0) {
    const initial = generateInitialRooms();
    saveRoomsData(initial);
    return initial;
  }
  return rooms;
};

export const saveRoomsData = (rooms: Room[]): void => {
  saveToStorage(KEYS.ROOMS, rooms);
};

// Admin settings
export const loadAdminSettings = (): AdminSettings => {
  return loadFromStorage<AdminSettings>(KEYS.SETTINGS, defaultSettings);
};

export const saveAdminSettings = (settings: AdminSettings): void => {
  saveToStorage(KEYS.SETTINGS, settings);
};

// Alerts state
export const loadAlertsData = (): AlertItem[] => {
  const alerts = loadFromStorage<AlertItem[]>(KEYS.ALERTS, []);
  if (!alerts || alerts.length === 0) {
    saveAlertsData(initialAlerts);
    return initialAlerts;
  }
  return alerts;
};

export const saveAlertsData = (alerts: AlertItem[]): void => {
  saveToStorage(KEYS.ALERTS, alerts);
};

// Recommendations state
export const loadRecommendationsData = (): AiRecommendation[] => {
  const recs = loadFromStorage<AiRecommendation[]>(KEYS.RECOMMENDATIONS, []);
  if (!recs || recs.length === 0) {
    saveRecommendationsData(initialRecommendations);
    return initialRecommendations;
  }
  return recs;
};

export const saveRecommendationsData = (recs: AiRecommendation[]): void => {
  saveToStorage(KEYS.RECOMMENDATIONS, recs);
};

// Complete Reset helper for testing
export const resetAllToDefaults = (): {
  rooms: Room[];
  settings: AdminSettings;
  alerts: AlertItem[];
  recs: AiRecommendation[];
} => {
  const rooms = generateInitialRooms();
  const settings = { ...defaultSettings };
  const alerts = [...initialAlerts];
  const recs = [...initialRecommendations];

  saveRoomsData(rooms);
  saveAdminSettings(settings);
  saveAlertsData(alerts);
  saveRecommendationsData(recs);

  return { rooms, settings, alerts, recs };
};
