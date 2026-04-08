"use client";

import { useEffect, useMemo, useState } from "react";
import { LayoutDashboard, RefreshCcw } from "lucide-react";
import { SectionHeading, ShellCard, StatusPill } from "@restaurante/ui";
import { api } from "@/lib/api";

const toneByState = {
  libre: "success",
  reservada: "warning",
  ocupada: "danger",
  atendida: "info"
};

export default function DashboardPage() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const [tableResponse, reservationResponse] = await Promise.all([
        api.get("/api/staff/tables"),
        api.get("/api/staff/reservations")
      ]);
      setTables(tableResponse);
      setReservations(reservationResponse);
      setError("");
    } catch (caughtError) {
      setError(caughtError?.details?.message ?? "No pudimos cargar el tablero operativo.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const summary = useMemo(() => {
    return {
      tables: tables.length,
      occupied: tables.filter((table) => table.state === "ocupada").length,
      reserved: tables.filter((table) => table.state === "reservada").length,
      reservations: reservations.length
    };
  }, [reservations.length, tables]);

  return (
    <div className="space-y-4">
      <ShellCard>
        <SectionHeading
          eyebrow="Operación"
          title="Mapa operativo de salón"
          description="Vista unificada del estado de mesas y las reservas confirmadas para coordinar servicio sin cambiar de pantalla."
          actions={
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 transition hover:bg-white/10"
            >
              <RefreshCcw size={16} />
              Actualizar
            </button>
          }
        />
      </ShellCard>

      {error ? <ShellCard className="text-sm text-rose-200">{error}</ShellCard> : null}

      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Mesas", summary.tables],
          ["Ocupadas", summary.occupied],
          ["Reservadas", summary.reserved],
          ["Reservas activas", summary.reservations]
        ].map(([label, value]) => (
          <ShellCard key={label}>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">{label}</p>
            <p className="mt-4 text-4xl font-semibold text-white">{value}</p>
          </ShellCard>
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ShellCard className="space-y-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={18} className="text-orange-300" />
            <h3 className="text-lg font-semibold text-white">Mesas</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {tables.map((table) => (
              <div key={table.id} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Mesa</p>
                    <h4 className="mt-2 text-3xl font-semibold text-white">#{table.number}</h4>
                  </div>
                  <StatusPill tone={toneByState[table.state] ?? "neutral"}>{table.state}</StatusPill>
                </div>
                <dl className="mt-5 space-y-2 text-sm text-slate-300">
                  <div className="flex justify-between gap-4">
                    <dt>Zona</dt>
                    <dd>{table.location}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Capacidad</dt>
                    <dd>{table.capacity ?? "N/A"}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Items</dt>
                    <dd>{table.itemCount}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt>Total</dt>
                    <dd>${Number(table.total ?? 0).toFixed(2)}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </ShellCard>

        <ShellCard className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Reservas próximas</h3>
          <div className="space-y-3">
            {reservations.slice(0, 8).map((reservation) => (
              <div key={reservation.reference} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{reservation.customerName}</p>
                  <StatusPill tone="warning">{reservation.partySize} pax</StatusPill>
                </div>
                <p className="mt-2 text-sm text-slate-400">
                  Mesa {reservation.tableNumber} · {reservation.location}
                </p>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-500">
                  {reservation.date} · {reservation.time}
                </p>
              </div>
            ))}
            {reservations.length === 0 ? <p className="text-sm text-slate-400">No hay reservas registradas.</p> : null}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
