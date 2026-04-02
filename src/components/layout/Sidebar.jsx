'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Utensils, 
  ClipboardList, 
  UserCog,
  LogOut,
  ChevronRight,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const adminItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Reservas', icon: Calendar, path: '/pagina' },
  { label: 'Clientes', icon: Users, path: '/clientes' },
  { label: 'Platillos', icon: Utensils, path: '/platillos' },
  { label: 'Pedidos', icon: ClipboardList, path: '/pedidos' },
  { label: 'Empleados', icon: UserCog, path: '/meseros' },
];

const empleadoItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { label: 'Reservas', icon: Calendar, path: '/pagina' },
  { label: 'Platillos', icon: Utensils, path: '/platillos' },
  { label: 'Pedidos', icon: ClipboardList, path: '/pedidos' },
];

export const Sidebar = ({ role = 'empleado' }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(false);
  const items = role === 'admin' ? adminItems : empleadoItems;

  const handleLogout = () => {
    localStorage.removeItem('usuario');
    router.push('/login');
  };

  return (
    <div 
      className="fixed left-0 top-0 h-screen z-50 flex items-center pl-4 pointer-events-none"
    >
      <motion.aside
        initial={false}
        animate={{ width: isExpanded ? 240 : 80 }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        className={clsx(
          "pointer-events-auto flex flex-col glass-effect border-white/10 rounded-3xl h-[90vh] shadow-2xl overflow-hidden transition-all duration-300"
        )}
      >
        {/* Logo / Toggle Area */}
        <div className="p-6 flex items-center justify-center">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Utensils className="text-black" size={20} />
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-2 mt-4">
          {items.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => router.push(item.path)}
                className={clsx(
                  "w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group relative",
                  isActive 
                    ? "bg-primary text-black shadow-lg shadow-primary/20" 
                    : "text-zinc-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <div className={clsx("min-w-[24px]", isActive ? "text-black" : "group-hover:text-primary transition-colors")}>
                  <Icon size={22} />
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute right-2 w-1.5 h-1.5 rounded-full bg-black"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 p-3 rounded-2xl text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <div className="min-w-[24px]">
              <LogOut size={22} />
            </div>
            {isExpanded && (
              <span className="font-medium text-sm">Cerrar Sesión</span>
            )}
          </button>
        </div>
      </motion.aside>
    </div>
  );
};
