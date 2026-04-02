'use client';

import { api } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { UserPlus, Loader2, AlertCircle, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';

const slides = [
  {
    src: '/assets/ImagenesLogin/newe.png',
    alt: 'Nuestro equipo',
    title: 'Únete a la Familia',
    description: 'Forma parte del equipo que hace posible la magia en Golden Plate.',
  },
  {
    src: '/assets/ImagenesLogin/vision.png',
    alt: 'Nuestra Visión',
    title: 'Visión de Excelencia',
    description: 'Buscamos ser el referente en gastronomía y servicio de alta calidad.',
  },
  {
    src: '/assets/ImagenesLogin/mision.png',
    alt: 'Nuestra Misión',
    title: 'Misión de Sabor',
    description: 'Crear experiencias memorables a través de sabores auténticos.',
  },
  {
    src: '/assets/ImagenesLogin/reglas1.png',
    alt: 'Nuestros Estándares',
    title: 'Altos Estándares',
    description: 'La calidad y el orden son la base de nuestro éxito diario.',
  },
];

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: '',
    rol: 'empleado',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/usuarios', {
        nombre: formData.nombre,
        email: formData.email,
        password: formData.password,
        rol: formData.rol,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (error) {
      console.error(error);
      setError('Error al registrar usuario. El correo podría ya estar en uso.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Background Image Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/ImagenesLogin/newe.png"
          alt="Background"
          fill
          className="object-cover opacity-30 blur-sm scale-110"
        />
        <div className="absolute inset-0 bg-background/60 backdrop-blur-[2px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <Card padded={false} className="flex flex-col lg:flex-row overflow-hidden glass-effect border-white/10 shadow-2xl min-h-[650px]">
          
          {/* Slider Panel */}
          <div className="hidden lg:block w-1/2 relative bg-zinc-950 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.7, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[currentSlide].src}
                  alt={slides[currentSlide].alt}
                  fill
                  className="object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-12 left-10 right-10">
                  <motion.h3 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-3xl font-bold text-white mb-4"
                  >
                    {slides[currentSlide].title}
                  </motion.h3>
                  <motion.p 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-zinc-300 text-lg leading-relaxed"
                  >
                    {slides[currentSlide].description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Slider Controls */}
            <div className="absolute bottom-6 left-10 flex gap-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    idx === currentSlide ? 'w-8 bg-primary' : 'w-2 bg-white/20'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Form Panel */}
          <div className="w-full lg:w-1/2 p-8 lg:p-12 flex flex-col bg-surface/30">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Crear Cuenta</h2>
              <p className="text-zinc-400 text-sm">Regístrate para comenzar a gestionar el restaurante.</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-sm"
                >
                  <AlertCircle size={18} />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-400 text-sm"
                >
                  <CheckCircle2 size={18} />
                  Registro exitoso. Redirigiendo...
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleRegister} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <Input
                  label="Nombre Completo"
                  name="nombre"
                  placeholder="Ej: Juan Pérez"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Input
                  label="Correo Electrónico"
                  name="email"
                  type="email"
                  placeholder="juan@goldenplate.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <Input
                label="Contraseña"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <Input
                label="Confirmar"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider">
                  Rol en el Restaurante
                </label>
                <select
                  name="rol"
                  value={formData.rol}
                  onChange={handleChange}
                  className="w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-white focus:ring-2 focus:ring-primary/40 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="admin">Administrador</option>
                  <option value="empleado">Empleado</option>
                </select>
              </div>

              <div className="md:col-span-2 pt-2">
                <Button
                  type="submit"
                  className="w-full py-6"
                  disabled={isLoading || success}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin mr-2" size={18} />
                  ) : (
                    <UserPlus className="mr-2" size={18} />
                  )}
                  {isLoading ? 'Registrando...' : 'Crear Cuenta'}
                </Button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-zinc-500 text-sm">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href="/login"
                  className="text-primary font-semibold hover:underline"
                >
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
