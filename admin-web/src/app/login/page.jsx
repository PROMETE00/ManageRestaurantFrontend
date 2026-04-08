"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, KeyRound, Loader2 } from "lucide-react";
import { ShellCard } from "@restaurante/ui";
import { useAuth } from "@/components/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, status } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [router, status]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await login(form);
      router.replace("/dashboard");
    } catch (caughtError) {
      setError(caughtError?.details?.message ?? "No pudimos iniciar sesión con esas credenciales.");
      setSubmitting(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ShellCard className="flex min-h-[560px] flex-col justify-between overflow-hidden">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.24em] text-orange-200">
              <ShieldCheck size={14} />
              Operación segura
            </div>
            <div className="space-y-4">
              <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Un backoffice diseñado para decidir rápido, no para adivinar.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                Controla aforo, reservas, pedidos y usuarios desde una sola consola con permisos claros y sesión segura por
                cookie HttpOnly.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              ["Mesas", "Estados accionables y ticket total por mesa."],
              ["Reservas", "Visibilidad operativa con referencia pública segura."],
              ["Usuarios", "Alta interna sólo por administración."]
            ].map(([title, text]) => (
              <div key={title} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <p className="text-sm font-semibold text-white">{title}</p>
                <p className="mt-2 text-sm text-slate-400">{text}</p>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="flex min-h-[560px] items-center">
          <form className="w-full space-y-6" onSubmit={onSubmit}>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Admin web</p>
              <h2 className="text-3xl font-semibold text-white">Iniciar sesión</h2>
              <p className="text-sm text-slate-400">Usa una cuenta interna emitida por administración.</p>
            </div>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Correo</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-orange-400/40"
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="admin@goldenplate.local"
                autoComplete="email"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Contraseña</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-orange-400/40"
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <KeyRound size={16} />}
              {submitting ? "Validando..." : "Entrar al backoffice"}
            </button>
          </form>
        </ShellCard>
      </div>
    </div>
  );
}
