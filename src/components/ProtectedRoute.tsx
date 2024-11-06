// components/ProtectedRoute.js
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) {
      router.push("/auth/login");
    }
  }, [isAuth, router]);

  return isAuth ? children : null;
}
