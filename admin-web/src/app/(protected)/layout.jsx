import { ProtectedApp } from "@/components/auth/ProtectedApp";

export default function ProtectedLayout({ children }) {
  return <ProtectedApp>{children}</ProtectedApp>;
}
