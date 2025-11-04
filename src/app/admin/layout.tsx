"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuth from "@/src/hooks/useAuth";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [loading, user, router, pathname]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Verificando autenticação...
      </div>
    );
  }

  if (!user && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}
