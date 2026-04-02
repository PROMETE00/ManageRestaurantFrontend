'use client';

import { api } from '@/lib/api';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Star, ShoppingCart, Filter, Search } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { clsx } from 'clsx';

const buildSrc = (ruta) => {
  if (!ruta) return '/assets/img/platillos/default.jpg';
  if (ruta.startsWith('http')) return ruta;
  return '/' + ruta.replace(/^\/+/, '');
};

export default function Platillos() {
  const [productos, setProductos] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    api.get('/productos')
      .then((res) => setProductos(res.data))
      .catch((err) => console.error('Error al cargar productos:', err));
  }, []);

  const categorias = useMemo(() => {
    const mapa = new Map();
    productos.forEach((p) => {
      const c = p.categoria;
      if (c && !mapa.has(c.id)) mapa.set(c.id, c);
    });
    return [{ id: 0, nombre: 'Todos' }, ...Array.from(mapa.values())];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    return productos.filter((p) => {
      const matchesCategory = categoriaActiva === 0 || p.categoria?.id === categoriaActiva;
      const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [productos, categoriaActiva, searchTerm]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar usuario={usuario} />
      
      <div className="flex flex-1 relative">
        <Sidebar role={usuario?.rol} />

        <main className="flex-1 p-8 lg:p-12 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <h2 className="text-4xl font-bold text-white mb-3 flex items-center gap-4">
                  <Utensils className="text-primary" size={32} />
                  Nuestro Menú
                </h2>
                <p className="text-zinc-400 max-w-lg">
                  Explora nuestra selección de platillos preparados con los ingredientes más frescos y el toque secreto de Golden Plate.
                </p>
              </div>

              <div className="relative w-full md:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-primary transition-colors" size={18} />
                <input 
                  type="text"
                  placeholder="Buscar platillo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-surface border border-white/5 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all"
                />
              </div>
            </div>

            {/* Categories Tabs */}
            <div className="flex flex-wrap items-center gap-3 mb-10 overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex items-center gap-2 mr-4 text-zinc-500">
                <Filter size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Filtrar:</span>
              </div>
              {categorias.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoriaActiva(cat.id)}
                  className={clsx(
                    "px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 whitespace-nowrap border",
                    categoriaActiva === cat.id
                      ? "bg-primary text-black border-primary shadow-lg shadow-primary/20"
                      : "bg-surface text-zinc-400 border-white/5 hover:border-primary/30 hover:text-white"
                  )}
                >
                  {cat.nombre}
                </button>
              ))}
            </div>

            {/* Grid de Platillos */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              <AnimatePresence mode="popLayout">
                {productosFiltrados.map((p) => (
                  <motion.div
                    key={p.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card padded={false} hover className="h-full flex flex-col group border-white/5 hover:border-primary/20">
                      {/* Image Container */}
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={buildSrc(p.rutaFoto)}
                          alt={p.nombre}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 border border-white/10">
                          <Star size={14} className="text-primary fill-primary" />
                          <span className="text-xs font-bold text-white">{p.calificacion ?? '4.5'}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-bold text-lg text-white group-hover:text-primary transition-colors line-clamp-1">
                            {p.nombre}
                          </h3>
                        </div>
                        
                        <p className="text-xs text-zinc-500 mb-6 flex-1 line-clamp-2 italic">
                          {p.categoria?.nombre || 'General'} • 03 piezas por porción
                        </p>

                        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Precio</span>
                            <span className="text-2xl font-black text-primary tracking-tight">
                              ${p.precio}
                            </span>
                          </div>
                          <Button size="sm" className="w-10 h-10 rounded-xl p-0">
                            <ShoppingCart size={18} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {productosFiltrados.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
                <Utensils size={48} className="mb-4 opacity-20" />
                <p>No se encontraron platillos que coincidan con tu búsqueda.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
