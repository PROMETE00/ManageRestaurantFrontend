'use client';

import React, { useState, useEffect } from 'react';
import { User, Bell, Search, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export const Navbar = ({ usuario }) => {
  const [horaActual, setHoraActual] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    return () => clearInterval(timerId);
  }, []);

  const formatoHora = horaActual.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  const getTurno = () => {
    const horaNum = horaActual.getHours();
    if (horaNum < 6) return 'Madrugada';
    if (horaNum < 12) return 'Mañana';
    if (horaNum < 18) return 'Tarde';
    return 'Noche';
  };

  return (
    <nav className="w-full h-20 flex items-center justify-between px-8 border-b border-white/5 bg-background/50 backdrop-blur-xl sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="text-primary">Golden</span> Plate Bistro
          </h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-medium">
            Sistema de Gestión Premium
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Time and Turn */}
        <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex flex-col items-end border-r border-white/10 pr-4">
            <span className="text-sm font-bold text-white tabular-nums tracking-wider">{formatoHora}</span>
            <span className="text-[10px] text-zinc-500 font-medium">{getTurno()}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-400">
            <CalendarIcon size={16} className="text-primary" />
            <span className="text-xs font-medium">
              {new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </div>

        {/* Notifications & Search */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-zinc-400 transition-colors">
            <Search size={20} />
          </button>
          <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white/5 text-zinc-400 transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-background" />
          </button>
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-white/10">
          <div className="flex flex-col items-end">
            <span className="text-sm font-bold text-white">{usuario?.nombre || 'Usuario'}</span>
            <span className="text-[10px] text-primary font-bold uppercase tracking-wider">{usuario?.rol || 'Empleado'}</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700 to-zinc-800 border border-white/10 flex items-center justify-center shadow-inner">
            <User size={20} className="text-white" />
          </div>
        </div>
      </div>
    </nav>
  );
};
