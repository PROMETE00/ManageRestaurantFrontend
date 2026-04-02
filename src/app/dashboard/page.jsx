'use client';

import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Map, Info, Calendar as CalendarIcon, Users as UsersIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Navbar } from '@/components/layout/Navbar';
import SidebarAdmin from '@/components/SideBarNavegacionAdmin';
import SidebarEmpleado from '@/components/SideBarNavegacionEmpleado';
import { clsx } from 'clsx';

function getMesaStyles(estado) {
  switch (estado) {
    case 'libre':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40';
    case 'reservada':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40';
    case 'ocupada':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40';
    case 'atendida':
      return 'bg-sky-500/10 text-sky-400 border-sky-500/20 hover:bg-sky-500/20 hover:border-sky-500/40';
    default:
      return 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:bg-zinc-700';
  }
}

export default function DashboardLayout() {
  const [usuario, setUsuario] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [mesasEstado, setMesasEstado] = useState({});
  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      setUsuario(JSON.parse(userJson));
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    api.get('/reservas')
      .then((res) => {
        const data = res.data.map((r) => ({
          hora: r.hora?.slice(0, 5),
          pax: r.cantidad,
          mesa: r.mesa?.numero,
          zona: r.mesa?.ubicacion ?? 'Desconocida',
          nombre: r.cliente?.nombre ?? 'Sin nombre',
        }));
        setReservas(data);
      })
      .catch((err) => console.error('Error al obtener reservas:', err));
  }, []);

  useEffect(() => {
    api.get('/mesas')
      .then((res) => {
        const nuevoMapa = {};
        res.data.forEach((m) => {
          nuevoMapa[m.numero] = m.estado ?? 'libre';
        });
        setMesasEstado(nuevoMapa);
      })
      .catch((err) => console.error('Error cargando estados de mesas:', err));
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar usuario={usuario} />
      
      <div className="flex flex-1 relative">
        {/* Sidebar wrapper */}
        <div className="w-20 lg:w-20 transition-all duration-300">
          {usuario?.rol === 'admin' ? <SidebarAdmin /> : <SidebarEmpleado />}
        </div>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                  <Map className="text-primary" size={28} />
                  Plano del Restaurante
                </h2>
                <p className="text-zinc-400 text-sm">Gestiona la ocupación y reservas en tiempo real.</p>
              </div>

              <div className="flex items-center gap-3">
                <Button 
                  onClick={() => router.push('/reservas/nueva')}
                  className="px-6 py-5"
                >
                  <Plus size={18} className="mr-2" />
                  Nueva Reserva
                </Button>
              </div>
            </div>

            {/* Status Legend */}
            <Card className="mb-8 p-4 flex flex-wrap items-center gap-6 bg-surface/30 border-white/5">
              <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Estado:</span>
              {[
                { label: 'Libre', color: 'bg-emerald-500' },
                { label: 'Reservada', color: 'bg-amber-500' },
                { label: 'Ocupada', color: 'bg-rose-500' },
                { label: 'Atendida', color: 'bg-sky-500' },
              ].map((status) => (
                <div key={status.label} className="flex items-center gap-2">
                  <div className={clsx("w-2 h-2 rounded-full", status.color)} />
                  <span className="text-xs text-zinc-300 font-medium">{status.label}</span>
                </div>
              ))}
            </Card>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 gap-4 auto-rows-[100px]">
              {[
                'tree', 'tree', 'mesa-1', 'tree', 'mesa-2', 'tree', 'tree',
                'mesa-3', 'mesa-4', 'bloque', 'mesa-5', 'mesa-6', 'mesa-7',
                'bloque', 'bloque', 'mesa-8', 'bloque', 'bloque', 'mesa-9',
                'sombrilla', 'tree', 'sombrilla', 'tree', 'sombrilla', 'tree',
                'mesa-10', 'bloque', 'bloque', 'bloque', 'bloque',
              ].map((item, i) => {
                if (item.startsWith('mesa')) {
                  const numeroMesa = parseInt(item.split('-')[1], 10);
                  const estado = mesasEstado[numeroMesa] ?? 'libre';
                  const reservaMesa = reservas.find((r) => r.mesa === numeroMesa);

                  return (
                    <motion.div
                      key={i}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push(`/mesas/${numeroMesa}`)}
                      className={clsx(
                        "cursor-pointer w-full h-full rounded-2xl flex flex-col items-center justify-center border transition-all duration-300 relative overflow-hidden group shadow-lg",
                        getMesaStyles(estado)
                      )}
                    >
                      <span className="text-xs uppercase tracking-tighter font-black opacity-60">Mesa</span>
                      <span className="text-xl font-bold">{numeroMesa}</span>
                      
                      {reservaMesa && (
                        <div className="mt-1 flex flex-col items-center">
                          <div className="flex items-center gap-1 text-[10px] font-bold">
                            <CalendarIcon size={10} />
                            {reservaMesa.hora}
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold">
                            <UsersIcon size={10} />
                            {reservaMesa.pax}
                          </div>
                        </div>
                      )}

                      {/* Glass shine effect on hover */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    </motion.div>
                  );
                }

                const iconos = {
                  tree: '/assets/icons/tree-svgrepo-com.svg',
                  bloque: '/assets/icons/chair-svgrepo-com.svg',
                  sombrilla: '/assets/icons/umbrella-sea-svgrepo-com.svg',
                };

                return (
                  <div key={i} className="w-full h-full flex justify-center items-center">
                    {iconos[item] && (
                      <motion.img
                        initial={{ opacity: 0.3 }}
                        whileHover={{ opacity: 0.6, scale: 1.1 }}
                        src={iconos[item]}
                        alt={item}
                        className="w-10 h-10 object-contain grayscale brightness-200 opacity-20 transition-all"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
