'use client';

import { api } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LogIn, Loader2, AlertCircle } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await api.post('/usuarios/login', {
        email,
        password,
      });

      const usuario = response.data;
      localStorage.setItem('usuario', JSON.stringify(usuario));
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      setError('Email o contraseña incorrectos. Por favor, inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden bg-background">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/ImagenesLogin/fondococina.png"
          alt="Restaurant Background"
          fill
          className="object-cover opacity-40 scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-4xl"
      >
        <Card padded={false} className="flex flex-col md:flex-row overflow-hidden glass-effect border-white/10 shadow-2xl">
          {/* Left Panel: Image/Branding */}
          <div className="hidden md:block w-1/2 relative min-h-[500px]">
            <Image
              src="/assets/ImagenesLogin/meseroyadmin.png"
              alt="Golden Plate Bistro"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
            <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
              <h1 className="text-3xl font-bold text-white mb-2">Golden Plate</h1>
              <p className="text-zinc-200 text-sm">Gestiona tu restaurante con la elegancia que tus clientes merecen.</p>
            </div>
          </div>

          {/* Right Panel: Login Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-surface/50">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Bienvenido</h2>
              <p className="text-zinc-400 text-sm">Ingresa tus credenciales para acceder al panel.</p>
            </div>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400 text-xs"
                >
                  <AlertCircle size={16} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleLogin} className="space-y-5">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="nombre@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />

              <Input
                label="Contraseña"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />

              <Button
                type="submit"
                className="w-full py-6"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" size={18} />
                ) : (
                  <LogIn className="mr-2" size={18} />
                )}
                {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-zinc-500 text-sm">
                ¿No tienes una cuenta?{' '}
                <Link
                  href="/register"
                  className="text-primary font-semibold hover:underline transition-all"
                >
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
