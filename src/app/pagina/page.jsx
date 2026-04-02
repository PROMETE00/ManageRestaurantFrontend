'use client';

import { api } from '@/lib/api';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, 
  ArrowUpDown, 
  Clock, 
  User, 
  MapPin, 
  Users, 
  Calendar as CalendarIcon,
  Filter,
  Plus,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

export default function ReservasListado() {
  const [reservas, setReservas] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [sortField, setSortField] = useState('hora');
  const [sortAsc, setSortAsc] = useState(true);
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (!userJson) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(userJson);
    setUsuario(user);
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    api.get('/reservas')
      .then(res => {
        const data = res.data.map(r => ({
          id: r.id,
          hora: r.hora?.slice(0, 5),
          pax: r.cantidad,
          mesa: r.mesa?.numero ?? '—',
          zona: r.mesa?.ubicacion ?? 'Desconocida',
          nombre: r.cliente?.nombre ?? 'Sin nombre',
          fecha: r.fecha ? new Date(r.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '—',
        }));
        setReservas(data);
      })
      .catch(err => console.error('Error al obtener reservas:', err));
  }, []);

  const reservasFiltradas = useMemo(() => {
    return reservas.filter(r =>
      r.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
      r.mesa.toString().includes(filtro)
    );
  }, [reservas, filtro]);

  const reservasOrdenadas = useMemo(() => {
    return [...reservasFiltradas].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (sortField === 'hora') {
        valA = parseInt((valA || '00:00').replace(':', ''), 10);
        valB = parseInt((valB || '00:00').replace(':', ''), 10);
      }

      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return sortAsc ? valA - valB : valB - valA;
    });
  }, [reservasFiltradas, sortField, sortAsc]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  if (isLoading) return null;

  if (usuario && usuario.rol !== 'admin' && usuario.rol !== 'empleado') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6 text-center">
        <Card className="max-w-md p-10 border-red-500/20 glass-effect">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Filter className="text-red-500" size={40} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Acceso Restringido</h1>
          <p className="text-zinc-400 mb-8">Solo el personal autorizado puede acceder a esta sección.</p>
          <Button onClick={() => router.push('/dashboard')} className="w-full">
            Volver al Inicio
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar usuario={usuario} />
      
      <div className="flex flex-1 relative">
        <Sidebar role={usuario?.rol} />

        <main className="flex-1 p-8 lg:p-12 overflow-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto"
          >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-4">
                  <CalendarIcon className="text-primary" size={32} />
                  Gestión de Reservas
                </h1>
                <p className="text-zinc-400">Administra y organiza todas las visitas de hoy.</p>
              </div>

              <Button 
                onClick={() => router.push('/reservas/nueva')}
                className="px-6 py-5"
              >
                <Plus size={18} className="mr-2" />
                Nueva Reserva
              </Button>
            </div>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar por cliente, mesa..."
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                  className="w-full bg-surface border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>

              <div className="flex items-center gap-2 bg-surface border border-white/5 rounded-2xl p-1 px-4 h-[46px]">
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest mr-2">Ordenar:</span>
                {[
                  { id: 'hora', label: 'Hora' },
                  { id: 'nombre', label: 'Cliente' },
                  { id: 'mesa', label: 'Mesa' }
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => handleSort(s.id)}
                    className={clsx(
                      "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5",
                      sortField === s.id 
                        ? "bg-primary text-black" 
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {s.label}
                    {sortField === s.id && (sortAsc ? <ChevronDown size={14} /> : <ChevronUp size={14} />)}
                  </button>
                ))}
              </div>
            </div>

            {/* Table/List View */}
            <Card padded={false} className="glass-effect border-white/5 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Hora</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Cliente</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Mesa / Zona</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Personas</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Fecha</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    <AnimatePresence mode="popLayout">
                      {reservasOrdenadas.map((r) => (
                        <motion.tr
                          key={r.id}
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="hover:bg-white/[0.02] transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                                <Clock size={16} />
                              </div>
                              <span className="text-sm font-bold text-white tracking-wider">{r.hora}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{r.nombre}</span>
                              <span className="text-[10px] text-zinc-500 uppercase font-medium">Reserva Confirmada</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="inline-flex flex-col items-center">
                              <span className="text-xs font-bold text-zinc-200">Mesa {r.mesa}</span>
                              <span className="text-[10px] text-zinc-500 flex items-center gap-1">
                                <MapPin size={10} className="text-primary" /> {r.zona}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800 border border-white/5 text-xs font-bold text-zinc-300">
                              <Users size={14} className="text-primary" />
                              {r.pax} pax
                            </div>
                          </td>
                          <td className="px-6 py-5">
                            <span className="text-xs text-zinc-400 font-medium">{r.fecha}</span>
                          </td>
                          <td className="px-6 py-5">
                            <Button variant="ghost" size="sm" className="text-xs">
                              Detalles
                            </Button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
              
              {reservasOrdenadas.length === 0 && (
                <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                  <CalendarIcon size={48} className="mb-4 opacity-10" />
                  <p className="text-sm">No se encontraron reservas con los filtros aplicados.</p>
                </div>
              )}
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
