import React, { createContext, useContext, useState, useEffect } from 'react';
import type { AuthState, Role } from '../types/hostel';
import { loadAuthState, saveAuthState, clearAuthState } from '../utils/storage';

interface LoginCredentials {
  role: Role;
  username: string;
  password?: string;
  floorId?: number;
  roomId?: string;
}

interface AuthContextType {
  authState: AuthState;
  loginAdmin: (password: string) => { success: boolean; error?: string };
  loginStudent: (floorId: number, roomId: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => loadAuthState());

  useEffect(() => {
    saveAuthState(authState);
  }, [authState]);

  const loginAdmin = (password: string) => {
    if (password === '12345') {
      const newState: AuthState = {
        isAuthenticated: true,
        user: {
          username: 'admin',
          role: 'admin',
        },
      };
      setAuthState(newState);
      return { success: true };
    }
    return { success: false, error: 'Invalid admin password. Default is 12345.' };
  };

  const loginStudent = (floorId: number, roomId: string, password: string) => {
    // Shared room credential check, e.g. password "12345"
    if (password !== '12345') {
      return { success: false, error: 'Invalid password for selected room. Default password is 12345.' };
    }

    const expectedUsername = `room${roomId}`;
    const newState: AuthState = {
      isAuthenticated: true,
      user: {
        username: expectedUsername,
        role: 'student',
        roomId,
        floorId,
      },
    };
    setAuthState(newState);
    return { success: true };
  };

  const logout = () => {
    clearAuthState();
    setAuthState({
      isAuthenticated: false,
      user: null,
    });
  };

  const switchUser = () => {
    logout();
  };

  return (
    <AuthContext.Provider value={{ authState, loginAdmin, loginStudent, logout, switchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
