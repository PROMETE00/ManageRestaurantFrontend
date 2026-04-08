"use client";

import { useEffect, useState } from "react";
import { CalendarClock, RefreshCcw } from "lucide-react";
import { SectionHeading, ShellCard, StatusPill } from "@restaurante/ui";
import { api } from "@/lib/api";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const response = await api.get("/api/staff/reservations");
      setReservations(response);
      setError("");
    } catch (caughtError) {
      setError(caughtError?.details?.message ?? "No pudimos cargar las reservas.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-4">
      <ShellCard>
        <SectionHeading
          eyebrow="Reservas"
          title="Agenda operativa"
          description="Consulta rápido quién llega, dónde se sentará y qué mesa necesita preparación."
          actions={
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <RefreshCcw size={16} />
              Recargar
            </button>
          }
        />
      </ShellCard>

      {error ? <ShellCard className="text-sm text-rose-200">{error}</ShellCard> : null}

      <ShellCard className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.22em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Referencia</th>
                <th className="px-4 py-4">Cliente</th>
                <th className="px-4 py-4">Horario</th>
                <th className="px-4 py-4">Mesa</th>
                <th className="px-4 py-4">Atención</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {reservations.map((reservation) => (
                <tr key={reservation.reference} className="hover:bg-white/[0.03]">
                  <td className="px-4 py-4 font-mono text-xs text-slate-300">{reservation.reference}</td>
                  <td className="px-4 py-4 text-white">{reservation.customerName}</td>
                  <td className="px-4 py-4 text-slate-300">
                    {reservation.date} · {reservation.time}
                  </td>
                  <td className="px-4 py-4 text-slate-300">
                    Mesa {reservation.tableNumber} · {reservation.location}
                  </td>
                  <td className="px-4 py-4">
                    <StatusPill tone="warning">{reservation.partySize} pax</StatusPill>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reservations.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 px-6 py-14 text-center text-slate-400">
            <CalendarClock size={28} />
            <p>No hay reservas registradas todavía.</p>
          </div>
        ) : null}
      </ShellCard>
    </div>
  );
}
