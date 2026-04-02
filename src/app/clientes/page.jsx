'use client';

import { api } from '@/lib/api';
import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users as UsersIcon, 
  Search, 
  UserPlus, 
  Trash2, 
  MoreVertical, 
  Phone, 
  Mail,
  Filter,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [search, setSearch] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      const user = JSON.parse(userJson);
      setUsuario(user);
      if (user.rol === 'empleado') {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
    setIsLoading(false);
  }, [router]);

  useEffect(() => {
    api.get('/clientes')
      .then(res => setClientes(res.data))
      .catch(err => console.error('Error al cargar clientes:', err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este cliente?')) return;
    
    setIsDeleting(id);
    try {
      await api.delete(`/clientes/${id}`);
      setClientes(clientes.filter(c => c.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar cliente');
    } finally {
      setIsDeleting(null);
    }
  };

  const filteredClientes = useMemo(() => {
    return clientes.filter(c =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.telefono && c.telefono.includes(search))
    );
  }, [clientes, search]);

  if (isLoading || !usuario) return null;

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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-4">
                  <UsersIcon className="text-primary" size={32} />
                  Gestión de Clientes
                </h1>
                <p className="text-zinc-400">Mantén el control de tu base de datos de clientes recurrentes.</p>
              </div>

              <Button 
                onClick={() => router.push('/clientes/nuevo')}
                className="px-6 py-5"
              >
                <UserPlus size={18} className="mr-2" />
                Nuevo Cliente
              </Button>
            </div>

            {/* Controls */}
            <div className="relative w-full md:w-96 group mb-10">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Buscar por nombre o teléfono..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-surface border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all shadow-xl shadow-black/20"
              />
            </div>

            {/* Content View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredClientes.map((cliente) => (
                  <motion.div
                    key={cliente.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                  >
                    <Card hover className="relative group overflow-hidden border-white/5 hover:border-primary/20">
                      <div className="absolute top-0 right-0 p-4">
                        <button 
                          onClick={() => handleDelete(cliente.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                        >
                          {isDeleting === cliente.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-center shadow-lg group-hover:border-primary/20 transition-colors">
                          <UserIcon className="text-zinc-400 group-hover:text-primary transition-colors" size={24} />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{cliente.nombre}</h3>
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-black">Cliente #{cliente.id}</span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-zinc-400 bg-white/5 p-3 rounded-xl border border-white/5">
                          <Phone size={14} className="text-primary" />
                          <span className="font-medium tracking-wide">{cliente.telefono || 'Sin teléfono'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-zinc-400 bg-white/5 p-3 rounded-xl border border-white/5">
                          <Mail size={14} className="text-primary" />
                          <span className="font-medium truncate">{cliente.email || 'cliente@ejemplo.com'}</span>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Última Visita: Hoy</span>
                        <Button variant="ghost" size="sm" className="text-[10px] uppercase font-bold tracking-widest h-8">
                          Historial
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {filteredClientes.length === 0 && (
              <div className="py-20 flex flex-col items-center justify-center text-zinc-500">
                <UsersIcon size={64} className="mb-6 opacity-10" />
                <h3 className="text-xl font-medium text-zinc-400">No se encontraron clientes</h3>
                <p className="text-sm">Intenta ajustar tu búsqueda o crea un nuevo cliente.</p>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

function UserIcon({ className, size }) {
  return (
    <svg 
      className={className} 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
