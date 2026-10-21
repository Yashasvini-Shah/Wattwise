import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Zap,
  ShieldCheck,
  UserCheck,
  WifiOff,
  Building,
  KeyRound,
  AlertCircle,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Badge } from '../components/common/Badge';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin, loginStudent } = useAuth();

  const [activeTab, setActiveTab] = useState<'student' | 'admin'>('student');

  // Admin state
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');

  // Student state
  const [selectedFloor, setSelectedFloor] = useState<number>(3);
  const [selectedRoom, setSelectedRoom] = useState<string>('301');
  const [studentPassword, setStudentPassword] = useState('');

  // Error feedback
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Dynamic rooms calculated based on floor
  const floorRooms = Array.from({ length: 5 }, (_, i) => `${selectedFloor}0${i + 1}`);

  const handleFloorChange = (floor: number) => {
    setSelectedFloor(floor);
    const defaultRoomForFloor = `${floor}01`;
    setSelectedRoom(defaultRoomForFloor);
    setErrorMessage(null);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (adminUsername.trim() !== 'admin') {
      setErrorMessage('Invalid admin username. Username must be "admin".');
      return;
    }

    const res = loginAdmin(adminPassword);
    if (res.success) {
      navigate('/admin/overview');
    } else {
      setErrorMessage(res.error || 'Authentication failed');
    }
  };

  const handleStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedRoom) {
      setErrorMessage('Please select a room.');
      return;
    }

    const res = loginStudent(selectedFloor, selectedRoom, studentPassword);
    if (res.success) {
      navigate('/student/dashboard');
    } else {
      setErrorMessage(res.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 sm:p-6 bg-slate-950 relative overflow-hidden">
      {/* Background ambient lighting effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Offline Notice Badge */}
      <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
        <Badge variant="slate" size="md" icon={<WifiOff className="w-4 h-4 text-emerald-400" />}>
          Offline Private Simulation • No External APIs Required
        </Badge>
      </div>

      {/* Main Glassmorphism Authentication Card */}
      <div className="w-full max-w-lg glass-panel p-6 sm:p-8 border border-slate-800 shadow-2xl relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500 to-emerald-400 text-slate-950 shadow-xl shadow-cyan-500/25 mb-3">
            <Zap className="h-8 w-8 fill-slate-950 stroke-slate-950" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white m-0">
            Watt<span className="text-cyan-400">Wise</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">Hostel Energy Management & Monitoring System</p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 rounded-xl bg-slate-900/90 border border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'student'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            Student Login
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setErrorMessage(null);
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all ${
              activeTab === 'admin'
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Login
          </button>
        </div>

        {/* Error Alert Message */}
        {errorMessage && (
          <div className="mb-6 flex items-start gap-3 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
          </div>
        )}

        {/* STUDENT LOGIN FORM */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentSubmit} className="space-y-5">
            {/* Step 1: Select Floor */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                Select Hostel Floor
              </label>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((floor) => (
                  <button
                    key={floor}
                    type="button"
                    onClick={() => handleFloorChange(floor)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedFloor === floor
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Floor {floor}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Select Room */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Select Room on Floor {selectedFloor}
              </label>
              <div className="grid grid-cols-5 gap-2">
                {floorRooms.map((roomNum) => (
                  <button
                    key={roomNum}
                    type="button"
                    onClick={() => {
                      setSelectedRoom(roomNum);
                      setErrorMessage(null);
                    }}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      selectedRoom === roomNum
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    Room {roomNum}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">
                Account ID: <code className="text-cyan-300 bg-slate-900 px-1.5 py-0.5 rounded">room{selectedRoom}</code> (Shared by 4 room residents)
              </p>
            </div>

            {/* Password input */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                placeholder="Enter password (default: 12345)"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[11px] text-slate-400">Demo Password: <strong className="text-cyan-400 font-mono">12345</strong></span>
                <button
                  type="button"
                  onClick={() => setStudentPassword('12345')}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Auto-fill demo pass
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:from-cyan-400 hover:to-emerald-400 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              Enter Room {selectedRoom} Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* ADMIN LOGIN FORM */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={adminUsername}
                onChange={(e) => setAdminUsername(e.target.value)}
                placeholder="admin"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-slate-400" />
                Password
              </label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors"
              />
              <div className="flex justify-between items-center mt-1.5">
                <span className="text-[11px] text-slate-400">Demo Admin Pass: <strong className="text-cyan-400 font-mono">12345</strong></span>
                <button
                  type="button"
                  onClick={() => {
                    setAdminUsername('admin');
                    setAdminPassword('12345');
                  }}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  Auto-fill admin demo
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 hover:from-cyan-400 hover:to-emerald-400 shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
            >
              Access Admin Control Center
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Footer Info */}
      <footer className="mt-8 text-center text-xs text-slate-400">
        WattWise Offline Hostel Energy Management System • Designed for Final Year Demonstration
      </footer>
    </div>
  );
};
