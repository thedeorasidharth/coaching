"use client";

import React, { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { Bell, Search, Menu } from "lucide-react";

export default function DashboardLayout({
  children,
  role
}: {
  children: React.ReactNode;
  role: "admin" | "student";
}) {
  const { user, isAuthenticated, loading, isHydrated, authChecked, checkAuth } = useAuthStore();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    let isMounted = true;

    const verifySession = async () => {
      const currentUser = await checkAuth(role);
      if (!isMounted) return;

      if (!currentUser) {
        router.replace(role === "admin" ? "/admin/login" : "/login");
      } else if (currentUser.role !== role) {
        // Role mismatch: redirect to the login page for the requested route (never cross-redirect to other role dashboard)
        router.replace(role === "admin" ? "/admin/login" : "/login");
      }
    };

    verifySession();

    return () => {
      isMounted = false;
    };
  }, [isHydrated, role, checkAuth, router]);

  if (!isHydrated || loading || !authChecked) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-navy p-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-black uppercase tracking-widest text-[10px]">Establishing Secure Session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user || user.role !== role) {
    return null;
  }

  const displayName = user.name || user.fullName || "User";

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans w-full">
      {/* Sidebar (Renders persistent on lg+, drawer on mobile) */}
      <Sidebar 
        role={role} 
        isOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full min-w-0">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-navy/5 flex items-center justify-between px-4 sm:px-8 relative z-10 w-full shrink-0">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Hamburger Button for Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-navy/5 text-navy hover:bg-navy/10 transition-all shrink-0"
              aria-label="Open Navigation Menu"
            >
              <Menu size={22} />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center gap-3 bg-navy/5 px-4 py-2 rounded-2xl w-full max-w-md">
              <Search size={18} className="text-navy/30 shrink-0" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="bg-transparent border-none outline-none text-sm font-medium text-navy placeholder:text-navy/20 w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6 shrink-0">
            <button className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40 hover:text-primary hover:bg-primary/10 transition-all relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>
            
            <div className="h-10 w-[1px] bg-navy/5 hidden sm:block" />

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-navy leading-none truncate max-w-[120px]">{displayName}</p>
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-1">{user.role}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-lg shadow-primary/20 shrink-0 text-sm sm:text-base">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-pattern relative w-full">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
          <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
