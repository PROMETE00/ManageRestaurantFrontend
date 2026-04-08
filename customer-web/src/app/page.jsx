"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Clock3, MapPin, Sparkles } from "lucide-react";
import { ShellCard, StatusPill } from "@restaurante/ui";
import { api } from "@/lib/api";

export default function CustomerHomePage() {
  const router = useRouter();
  const [menu, setMenu] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    date: "",
    time: "",
    partySize: 2
  });

  useEffect(() => {
    api
      .get("/api/public/menu")
      .then((response) => {
        setMenu(response);
      })
      .catch((caughtError) => {
        setError(caughtError?.details?.message ?? "No pudimos cargar el menú.");
      });
  }, []);

  const categoryGroups = useMemo(() => {
    return menu.reduce((accumulator, item) => {
      const category = item.category || "Especialidades";
      accumulator[category] = [...(accumulator[category] ?? []), item];
      return accumulator;
    }, {});
  }, [menu]);

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const reservation = await api.post("/api/public/reservations", {
        ...form,
        partySize: Number(form.partySize)
      });
      router.push(`/reservation/${reservation.reference}`);
    } catch (caughtError) {
      setError(caughtError?.details?.message ?? "No pudimos completar la reserva.");
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-6 lg:py-10">
      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <ShellCard className="border-orange-200/30 bg-white/70 text-[var(--customer-ink)] shadow-[0_20px_70px_rgba(120,53,15,0.12)]">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-xs uppercase tracking-[0.26em] text-[var(--customer-accent)]">
              <Sparkles size={14} />
              Golden Plate
            </div>
            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-5xl">
                Reserva una mesa y descubre un menú pensado para quedarse en la memoria.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-[var(--customer-muted)]">
                El portal público está separado del sistema operativo interno para darte una experiencia más rápida, clara y
                enfocada en tu visita.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["Menú vivo", "Lo que ves aquí sale del catálogo público del restaurante."],
                ["Reserva directa", "Recibes una referencia segura para consultar tu reserva."],
                ["Servicio cálido", "Diseño mobile-first para reservar desde cualquier lugar."]
              ].map(([title, text]) => (
                <div key={title} className="rounded-3xl border border-orange-100 bg-white/80 p-5">
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-[var(--customer-muted)]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </ShellCard>

        <ShellCard className="border-orange-200/30 bg-white/70 text-[var(--customer-ink)] shadow-[0_20px_70px_rgba(120,53,15,0.12)]">
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--customer-muted)]">Reserva rápida</p>
              <h2 className="text-2xl font-semibold">Agenda tu visita</h2>
            </div>
            {[
              ["customerName", "Nombre completo", "text"],
              ["email", "Correo", "email"],
              ["phone", "Teléfono", "tel"],
              ["date", "Fecha", "date"],
              ["time", "Hora", "time"]
            ].map(([key, label, type]) => (
              <label key={key} className="block space-y-2">
                <span className="text-sm text-[var(--customer-muted)]">{label}</span>
                <input
                  type={type}
                  required
                  value={form[key]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 outline-none transition focus:border-orange-300"
                />
              </label>
            ))}
            <label className="block space-y-2">
              <span className="text-sm text-[var(--customer-muted)]">Personas</span>
              <input
                type="number"
                min="1"
                value={form.partySize}
                onChange={(event) => setForm((current) => ({ ...current, partySize: event.target.value }))}
                className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 outline-none transition focus:border-orange-300"
              />
            </label>
            {error ? <div className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-2xl bg-[var(--customer-accent)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:opacity-70"
            >
              {submitting ? "Procesando..." : "Confirmar reserva"}
            </button>
          </form>
        </ShellCard>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-[var(--customer-muted)]">Menú público</p>
            <h2 className="text-3xl font-semibold">Selección destacada</h2>
          </div>
          <StatusPill tone="warning">{menu.length} platillos</StatusPill>
        </div>

        <div className="grid gap-4">
          {Object.entries(categoryGroups).map(([category, items]) => (
            <ShellCard
              key={category}
              className="border-orange-200/30 bg-white/70 text-[var(--customer-ink)] shadow-[0_20px_70px_rgba(120,53,15,0.12)]"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--customer-muted)]">{category}</p>
                  <h3 className="mt-1 text-2xl font-semibold">{category}</h3>
                </div>
                <div className="flex items-center gap-2 text-sm text-[var(--customer-muted)]">
                  <Clock3 size={16} />
                  Preparación sugerida 15-20 min
                </div>
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => (
                  <article key={item.id} className="rounded-3xl border border-orange-100 bg-white p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h4 className="text-lg font-semibold">{item.name}</h4>
                        <p className="mt-2 text-sm text-[var(--customer-muted)]">{item.type}</p>
                      </div>
                      <StatusPill tone="success">${Number(item.price ?? 0).toFixed(2)}</StatusPill>
                    </div>
                    <div className="mt-5 flex items-center justify-between text-sm text-[var(--customer-muted)]">
                      <span className="inline-flex items-center gap-2">
                        <MapPin size={14} />
                        Hecho al momento
                      </span>
                      <span>{item.availableQuantity ?? 0} disponibles</span>
                    </div>
                  </article>
                ))}
              </div>
            </ShellCard>
          ))}
        </div>
      </section>
    </main>
  );
}
