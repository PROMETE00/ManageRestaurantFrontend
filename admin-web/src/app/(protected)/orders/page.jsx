"use client";

import { useEffect, useState } from "react";
import { ClipboardList, RefreshCcw } from "lucide-react";
import { SectionHeading, ShellCard, StatusPill } from "@restaurante/ui";
import { api } from "@/lib/api";

const nextStatuses = ["pendiente", "pagado", "cancelado"];
const tones = {
  pendiente: "warning",
  pagado: "success",
  cancelado: "danger"
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  const load = async () => {
    try {
      const response = await api.get("/api/staff/orders");
      setOrders(response);
      setError("");
    } catch (caughtError) {
      setError(caughtError?.details?.message ?? "No pudimos cargar los pedidos.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const updated = await api.post(`/api/staff/orders/${orderId}/status`, { status });
      setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      <ShellCard>
        <SectionHeading
          eyebrow="Pedidos"
          title="Seguimiento de cobro y cierre"
          description="Actualiza el estado de los pedidos sin salir del flujo operativo."
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

      <div className="grid gap-4">
        {orders.map((order) => (
          <ShellCard key={order.id} className="grid gap-4 lg:grid-cols-[1fr_220px]">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-semibold text-white">Pedido #{order.id}</h3>
                <StatusPill tone={tones[order.status] ?? "neutral"}>{order.status}</StatusPill>
              </div>
              <p className="text-sm text-slate-300">
                Cliente: {order.clientName ?? "Sin cliente"} · Mesa: {order.tableNumber ?? "N/A"}
              </p>
              <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
                Total ${Number(order.total ?? 0).toFixed(2)}
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs uppercase tracking-[0.22em] text-slate-500">Cambiar estatus</label>
              <div className="grid grid-cols-3 gap-2">
                {nextStatuses.map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={updatingId === order.id || order.status === status}
                    onClick={() => updateStatus(order.id, status)}
                    className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-200 transition hover:bg-white/10 disabled:opacity-40"
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </ShellCard>
        ))}

        {orders.length === 0 ? (
          <ShellCard className="flex flex-col items-center justify-center gap-3 py-14 text-center text-slate-400">
            <ClipboardList size={28} />
            <p>No hay pedidos disponibles todavía.</p>
          </ShellCard>
        ) : null}
      </div>
    </div>
  );
}
