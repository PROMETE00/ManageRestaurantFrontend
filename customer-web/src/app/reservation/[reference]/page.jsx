"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { CalendarCheck2 } from "lucide-react";
import { ShellCard, StatusPill } from "@restaurante/ui";
import { api } from "@/lib/api";

export default function ReservationDetailPage() {
  const params = useParams();
  const [reservation, setReservation] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get(`/api/public/reservations/${params.reference}`)
      .then(setReservation)
      .catch((caughtError) => {
        setError(caughtError?.details?.message ?? "No encontramos esa reserva.");
      });
  }, [params.reference]);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-12">
      <ShellCard className="w-full border-orange-200/30 bg-white/75 text-[var(--customer-ink)] shadow-[0_20px_70px_rgba(120,53,15,0.12)]">
        {reservation ? (
          <div className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-[var(--customer-muted)]">Reserva confirmada</p>
                <h1 className="mt-2 text-3xl font-semibold">{reservation.customerName}</h1>
              </div>
              <StatusPill tone="warning">{reservation.status}</StatusPill>
            </div>

            <div className="rounded-3xl border border-orange-100 bg-white p-5">
              <div className="flex items-center gap-3">
                <CalendarCheck2 size={20} className="text-[var(--customer-accent)]" />
                <p className="font-medium">Referencia segura</p>
              </div>
              <p className="mt-3 font-mono text-sm text-[var(--customer-muted)]">{reservation.reference}</p>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              {[
                ["Fecha", reservation.date],
                ["Hora", reservation.time],
                ["Personas", reservation.partySize],
                ["Mesa", `Mesa ${reservation.tableNumber} · ${reservation.location}`],
                ["Correo", reservation.email],
                ["Teléfono", reservation.phone]
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl border border-orange-100 bg-white p-5">
                  <dt className="text-xs uppercase tracking-[0.22em] text-[var(--customer-muted)]">{label}</dt>
                  <dd className="mt-2 text-sm font-medium">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : (
          <div className="space-y-3 text-center">
            <h1 className="text-2xl font-semibold">Seguimiento de reserva</h1>
            <p className="text-sm text-[var(--customer-muted)]">{error || "Cargando tu referencia..."}</p>
          </div>
        )}
      </ShellCard>
    </main>
  );
}
