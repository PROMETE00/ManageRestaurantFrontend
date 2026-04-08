"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { AppShell } from "@/components/layout/AppShell";

export function ProtectedApp({ children }) {
  const { status } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/login") {
      router.replace("/login");
    }
  }, [pathname, router, status]);

  if (status === "loading" || status === "idle") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="rounded-[28px] border border-white/10 bg-[var(--color-panel)] px-8 py-6 text-sm text-slate-300 shadow-2xl backdrop-blur-xl">
          Validando sesión segura...
        </div>
      </div>
    );
  }

  if (status !== "authenticated") {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
