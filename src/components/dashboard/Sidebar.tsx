"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

interface SidebarProps {
  role: "admin" | "student";
}

const adminLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Students", href: "/admin/students", icon: Users },
  { name: "Tests & Quizzes", href: "/admin/tests", icon: BookOpen },
  // { name: "Notes & PDFs", href: "/admin/notes", icon: FileText },
  { name: "Gallery", href: "/admin/gallery", icon: Image },
  { name: "Notices", href: "/admin/notices", icon: Bell },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Faculty", href: "/admin/faculty", icon: UserCircle },
];

const studentLinks = [
  { name: "Dashboard", href: "/student/dashboard", icon: LayoutDashboard },
  { name: "My Tests", href: "/student/tests", icon: BookOpen },
  // { name: "Study Notes", href: "/student/notes", icon: FileText },
  { name: "Results", href: "/student/results", icon: FileText },
  { name: "Notices", href: "/student/notices", icon: Bell },
];

export const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const logoutStore = useAuthStore((state) => state.logout);
  const links = role === "admin" ? adminLinks : studentLinks;

  const handleLogout = async () => {
    try {
      const endpoint = role === "admin" ? "/admin/logout" : "/student/logout";
      await api.post(endpoint);
      logoutStore();
      router.push(role === "admin" ? "/admin/login" : "/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="h-full w-64 bg-navy text-white flex flex-col p-6 shadow-2xl relative z-20">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="bg-primary p-2 rounded-xl">
          <Sparkles className="text-accent" size={20} />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-lg leading-none">EDUSPARK</span>
          <span className="text-[10px] uppercase font-black tracking-widest text-accent">{role} Panel</span>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
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
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 transition-all"
      >
        <LogOut size={18} />
        Logout
      </button>
    </div>
  );
};
