"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, CalendarClock, ClipboardList, ShieldCheck, LogOut } from "lucide-react";
import { SectionHeading, ShellCard, StatusPill, cx } from "@restaurante/ui";
import { useAuth } from "@/components/auth/AuthProvider";

const navItems = [
  { href: "/dashboard", label: "Mesas", icon: LayoutDashboard },
  { href: "/reservations", label: "Reservas", icon: CalendarClock },
  { href: "/orders", label: "Pedidos", icon: ClipboardList },
  { href: "/users", label: "Usuarios", icon: ShieldCheck, adminOnly: true }
];

export function AppShell({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const visibleItems = navItems.filter((item) => !item.adminOnly || user?.role === "ADMIN");

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="app-shell-grid gap-4">
        <aside>
          <ShellCard className="sticky top-4 flex h-full flex-col gap-8">
            <div className="space-y-4">
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[var(--color-accent)]">
                Golden Plate
              </div>
              <SectionHeading
                eyebrow="Backoffice"
                title="Operación en tiempo real"
                description="Supervisa mesas, reservas, pedidos y personal desde una sola consola segura."
              />
            </div>

            <nav className="space-y-2">
              {visibleItems.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all",
                      active
                        ? "border-orange-400/40 bg-orange-500/12 text-white"
                        : "border-white/5 bg-white/5 text-slate-300 hover:border-white/15 hover:bg-white/10"
                    )}
                  >
                    <Icon size={18} />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.28em] text-slate-500">Sesión</p>
                <h3 className="mt-2 text-lg font-semibold text-white">{user?.name}</h3>
                <p className="text-sm text-slate-400">{user?.email}</p>
                <div className="mt-3">
                  <StatusPill tone={user?.role === "ADMIN" ? "warning" : "info"}>{user?.role}</StatusPill>
                </div>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  router.replace("/login");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-rose-500/25 bg-rose-500/12 px-4 py-3 text-sm font-medium text-rose-100 transition hover:bg-rose-500/20"
              >
                <LogOut size={16} />
                Cerrar sesión
              </button>
            </div>
          </ShellCard>
        </aside>

        <main className="space-y-4">{children}</main>
      </div>
    </div>
  );
}
