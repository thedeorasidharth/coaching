"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  BookOpen, 
  Bell, 
  Image, 
  UserCircle,
  LogOut,
  Sparkles,
  BarChart3,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { LogoutConfirmationModal } from "@/components/dashboard/LogoutConfirmationModal";

interface SidebarProps {
  role: "admin" | "student";
  isOpen?: boolean;
  onClose?: () => void;
}

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Tests & Quizzes", href: "/admin/tests", icon: BookOpen },
  { name: "Notices", href: "/admin/notices", icon: Bell },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Faculty", href: "/admin/faculty", icon: UserCircle },
];

const studentLinks = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "My Tests", href: "/student/tests", icon: BookOpen },
  { name: "Results", href: "/student/results", icon: FileText },
  { name: "Notices", href: "/student/notices", icon: Bell },
];

export const Sidebar = ({ role, isOpen = false, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const logoutStore = useAuthStore((state) => state.logout);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const links = role === "admin" ? adminLinks : studentLinks;

  const handleConfirmLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logoutStore();
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
        sessionStorage.clear();
      }
      setShowLogoutModal(false);
      if (onClose) onClose();
      router.replace(role === "admin" ? "/admin/login" : "/login");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      setLoggingOut(false);
    }
  };

  const sidebarContent = (
    <div className="h-full w-64 bg-navy text-white flex flex-col p-6 shadow-2xl relative z-20">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl">
            <Sparkles className="text-accent" size={20} />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-lg leading-none">EDUSPARK</span>
            <span className="text-[10px] uppercase font-black tracking-widest text-accent">{role} Panel</span>
          </div>
        </div>
        {/* Mobile Close Button */}
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden text-white/40 hover:text-white p-1 rounded-lg"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                isActive 
                  ? "bg-primary text-white shadow-lg" 
                  : "text-white/40 hover:text-white hover:bg-white/5"
              )}
            >
              <link.icon size={18} />
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-accent"
                />
              )}
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setShowLogoutModal(true)}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
      >
        <LogOut size={18} />
        Logout
      </button>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        loading={loggingOut}
      />
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-Over Drawer with Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-navy/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative z-10 h-full"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
