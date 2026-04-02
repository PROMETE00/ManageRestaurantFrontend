'use client';

import { api } from '@/lib/api';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { Calendar, Clock, Users, MapPin, ChevronLeft, Save, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function NuevaReserva() {
  const router = useRouter();
  const [usuario, setUsuario] = useState(null);
  const [mesas, setMesas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    nombre: '',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    hora: '',
    pax: 1,
    mesa: '',
    zona: 'Comedor',
  });

  useEffect(() => {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      setUsuario(JSON.parse(userJson));
    } else {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    api.get('/mesas')
      .then(res => setMesas(res.data))
      .catch(err => console.error('Error al cargar mesas:', err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Crear o buscar cliente (simplificado)
      const clienteRes = await api.post('/clientes', {
        nombre: form.nombre,
        telefono: '000-000-0000',
      });

      const clienteId = clienteRes.data.id;

      // 2. Crear reserva
      await api.post('/reservas', {
        fecha: form.fecha,
        hora: form.hora,
        cantidad: parseInt(form.pax),
        cliente: { id: clienteId },
        mesa: { id: parseInt(form.mesa) },
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/pagina');
      }, 2000);
    } catch (err) {
      console.error('❌ Error al crear reserva:', err);
      setError('No se pudo crear la reserva. Por favor, verifica los datos.');
      setIsLoading(false);
    }
  };

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar usuario={usuario} />
      
      <div className="flex flex-1 relative">
        <Sidebar role={usuario.rol} />

        <main className="flex-1 p-8 lg:p-12 overflow-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            {/* Back Button */}
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-zinc-500 hover:text-primary transition-colors mb-6 group"
            >
              <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Volver</span>
            </button>

            <div className="mb-10 text-center">
              <h1 className="text-4xl font-bold text-white mb-3">Nueva Reserva</h1>
              <p className="text-zinc-400">Completa los detalles para agendar una nueva mesa.</p>
            </div>

            <Card className="glass-effect border-white/10 p-8 md:p-12 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
              
              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
                  >
                    <AlertCircle size={20} />
                    {error}
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex flex-col items-center gap-3 text-emerald-400 text-center"
                  >
                    <CheckCircle2 size={40} className="mb-2" />
                    <h3 className="font-bold text-lg">Reserva Confirmada</h3>
                    <p className="text-sm opacity-80 text-emerald-300">La reserva se ha registrado correctamente. Redirigiendo...</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Cliente Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Users size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Información del Cliente</h3>
                  </div>
                  <Input
                    label="Nombre Completo"
                    name="nombre"
                    placeholder="Ej: Sofía Martínez"
                    value={form.nombre}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="h-px bg-white/5 w-full" />

                {/* Detalles Section */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-primary">
                    <Calendar size={18} />
                    <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Detalles de la Reserva</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Fecha"
                      type="date"
                      name="fecha"
                      value={form.fecha}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Hora"
                      type="time"
                      name="hora"
                      value={form.hora}
                      onChange={handleChange}
                      required
                    />
                    <Input
                      label="Número de Personas (Pax)"
                      type="number"
                      name="pax"
                      min="1"
                      value={form.pax}
                      onChange={handleChange}
                      required
                    />
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider flex items-center gap-1.5">
                        <MapPin size={12} /> Zona Preferida
                      </label>
                      <select
                        name="zona"
                        value={form.zona}
                        onChange={handleChange}
                        className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary/40 focus:outline-none appearance-none cursor-pointer transition-all"
                      >
                        <option value="Comedor">Comedor Principal</option>
                        <option value="Terraza">Terraza Jardín</option>
                        <option value="Barra">Barra Lounge</option>
                        <option value="VIP">Zona Privada (VIP)</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider">
                      Seleccionar Mesa Disponible
                    </label>
                    <select
                      name="mesa"
                      value={form.mesa}
                      onChange={handleChange}
                      required
                      className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary/40 focus:outline-none appearance-none cursor-pointer transition-all"
                    >
                      <option value="">-- Elige una mesa --</option>
                      {mesas.map(mesa => (
                        <option key={mesa.id} value={mesa.id} className="bg-zinc-900">
                          {`Mesa ${mesa.numero} (${mesa.ubicacion}) - Capacidad: ${mesa.capacidad} pax`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.back()}
                    className="flex-1 py-6"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-[2] py-6"
                    disabled={isLoading || success}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin mr-2" size={20} />
                    ) : (
                      <Save className="mr-2" size={20} />
                    )}
                    {isLoading ? 'Guardando...' : 'Confirmar Reserva'}
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
