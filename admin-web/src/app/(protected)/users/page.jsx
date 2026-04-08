"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, UserPlus } from "lucide-react";
import { SectionHeading, ShellCard, StatusPill } from "@restaurante/ui";
import { api } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthProvider";

const roles = ["ADMIN", "STAFF", "CUSTOMER"];

export default function UsersPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STAFF"
  });

  const load = async () => {
    try {
      const response = await api.get("/api/admin/users");
      setUsers(response);
      setError("");
    } catch (caughtError) {
      setError(caughtError?.details?.message ?? "No pudimos cargar los usuarios.");
    }
  };

  useEffect(() => {
    if (user?.role === "ADMIN") {
      load();
    }
  }, [user?.role]);

  if (user?.role !== "ADMIN") {
    return (
      <ShellCard className="text-center">
        <ShieldCheck className="mx-auto text-orange-300" size={28} />
        <h2 className="mt-4 text-2xl font-semibold text-white">Acceso sólo para administración</h2>
        <p className="mt-2 text-sm text-slate-400">La gestión de cuentas internas ya no está disponible para personal operativo.</p>
      </ShellCard>
    );
  }

  const onCreate = async (event) => {
    event.preventDefault();
    try {
      const created = await api.post("/api/admin/users", form);
      setUsers((current) => [created, ...current]);
      setForm({ name: "", email: "", password: "", role: "STAFF" });
      setError("");
    } catch (caughtError) {
      setError(caughtError?.details?.message ?? "No pudimos crear el usuario.");
    }
  };

  const onRoleChange = async (userId, role) => {
    try {
      const updated = await api.patch(`/api/admin/users/${userId}/role`, { role });
      setUsers((current) => current.map((item) => (item.id === userId ? updated : item)));
    } catch (caughtError) {
      setError(caughtError?.details?.message ?? "No pudimos actualizar el rol.");
    }
  };

  return (
    <div className="space-y-4">
      <ShellCard>
        <SectionHeading
          eyebrow="Administración"
          title="Usuarios internos"
          description="Las cuentas del equipo se emiten sólo desde administración y los roles quedan visibles en la operación."
        />
      </ShellCard>

      {error ? <ShellCard className="text-sm text-rose-200">{error}</ShellCard> : null}

      <div className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <ShellCard>
          <div className="flex items-center gap-3">
            <UserPlus size={18} className="text-orange-300" />
            <h3 className="text-lg font-semibold text-white">Crear cuenta</h3>
          </div>
          <form className="mt-6 space-y-4" onSubmit={onCreate}>
            {[
              ["name", "Nombre", "text"],
              ["email", "Correo", "email"],
              ["password", "Contraseña", "password"]
            ].map(([key, label, type]) => (
              <label key={key} className="block space-y-2">
                <span className="text-sm text-slate-300">{label}</span>
                <input
                  type={type}
                  value={form[key]}
                  onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-orange-400/40"
                  required
                />
              </label>
            ))}

            <label className="block space-y-2">
              <span className="text-sm text-slate-300">Rol</span>
              <select
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition focus:border-orange-400/40"
              >
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </label>

            <button
              type="submit"
              className="w-full rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
            >
              Crear usuario
            </button>
          </form>
        </ShellCard>

        <ShellCard className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Equipo activo</h3>
          <div className="space-y-3">
            {users.map((member) => (
              <div key={member.id} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-medium text-white">{member.name}</p>
                    <p className="text-sm text-slate-400">{member.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusPill tone={member.role === "ADMIN" ? "warning" : "info"}>{member.role}</StatusPill>
                    <select
                      value={member.role}
                      onChange={(event) => onRoleChange(member.id, event.target.value)}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm text-white outline-none"
                    >
                      {roles.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ShellCard>
      </div>
    </div>
  );
}
