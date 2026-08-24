"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/entities/auth/store";
import { authApi } from "@/entities/auth/api";
import { tokenStorage } from "@/shared/lib/tokenStorage";
import { AuthForm } from "../Auth-Form";

export function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, isInitialized, setUser, setInitialized, clearUser } =
    useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = tokenStorage.get();

    if (!token) {
      setInitialized();
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((me) => setUser(me))
      .catch(() => {
        tokenStorage.clear();
        clearUser();
      })
      .finally(() => {
        setInitialized();
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (!user) {
    return <AuthForm />;
  }

  return <>{children}</>;
}
