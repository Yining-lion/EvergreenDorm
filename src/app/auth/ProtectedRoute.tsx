"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./authContext";
import LoadingSpinner from "../components/LoadingSpinner";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && (!user || (user.role !== "member" && user.role !== "admin"))) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) return (
    <LoadingSpinner />
  );

  return (<>{user ? children : null}</>);
}
