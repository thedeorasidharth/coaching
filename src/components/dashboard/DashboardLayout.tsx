"use client";

import React, { useEffect } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Bell, User, Search } from "lucide-react";

export default function DashboardLayout({
  children,
  role
}: {
  children: React.ReactNode;
  role: "admin" | "student";
}) {
  const { user, isHydrated, loading, checkAuth } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated) {
      if (!user) {
        // If no user in store, try to verify with backend
        checkAuth(role);
      } else if (user.role !== role) {
        // Role mismatch redirect
        router.push(user.role === "admin" ? "/admin/dashboard" : "/student/dashboard");
      }
    }
  }, [isHydrated, user?.role, role, router, checkAuth]);

  // Handle redirection after checkAuth completes
  useEffect(() => {
    if (isHydrated && !loading && !user) {
      router.push(role === "admin" ? "/admin/login" : "/login");
    }
  }, [isHydrated, loading, user, role, router]);

  if (!isHydrated || (loading && !user)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-navy">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Establishing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <Sidebar role={role} />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-navy/5 flex items-center justify-between px-8 relative z-10">
          <div className="flex items-center gap-4 bg-navy/5 px-4 py-2 rounded-2xl w-full max-w-md">
            <Search size={18} className="text-navy/30" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="bg-transparent border-none outline-none text-sm font-medium text-navy placeholder:text-navy/20 w-full"
            />
          </div>

          <div className="flex items-center gap-6">
            <button className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 hover:text-primary hover:bg-primary/10 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="h-10 w-[1px] bg-navy/5 mx-2" />

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-navy leading-none">{user.name}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{user.role}</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-pattern relative">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
          <div className="p-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
