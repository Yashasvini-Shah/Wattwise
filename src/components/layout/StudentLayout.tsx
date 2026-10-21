import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const StudentLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-cyan-500/30">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6">
        <Outlet />
      </main>
    </div>
  );
};
