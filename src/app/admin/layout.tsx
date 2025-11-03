"use client";

import { useRouter } from "next/navigation";
import useAuth from "@/src/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Verificando autenticação...
      </div>
    );
  }

  if (!user) {
    router.push("/admin/login");
    return null;
  }

  return <>{children}</>;
}
