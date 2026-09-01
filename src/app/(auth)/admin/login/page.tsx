"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/admin/login", {
        email,
        password,
      });

      setUser(response.data);
      router.push("/admin/dashboard");
    } catch (err: any) {
      if (!err.response) {
        setError("Unable to connect to Express backend server (Port 5002). Please ensure the backend server is running.");
      } else {
        setError(err.response?.data?.message || "Admin login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-navy/5 -z-10" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-4 rounded-[2rem] bg-navy text-accent mb-6 shadow-2xl border-4 border-white/20">
            <ShieldCheck size={40} />
          </div>
          <h1 className="font-display text-4xl font-black text-navy uppercase tracking-tighter">Admin <span className="text-primary italic">Access</span></h1>
          <p className="text-navy/40 mt-2 text-xs font-black uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        <Card className="p-10 shadow-[0_32px_64px_-12px_rgba(24,78,80,0.2)] bg-white/90 border-white relative overflow-hidden group">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
          
          <form onSubmit={handleLogin} className="space-y-8 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Administrator Email</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30">
                  <Mail size={18} />
                </div>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-navy/5 border-2 border-transparent rounded-2xl pl-12 pr-6 outline-none focus:bg-white focus:border-primary/20 transition-all text-navy font-bold"
                  placeholder="admin@eduspark.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Security Key</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30">
                  <Lock size={18} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-navy/5 border-2 border-transparent rounded-2xl pl-12 pr-6 outline-none focus:bg-white focus:border-primary/20 transition-all text-navy font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-black text-red-500 text-center bg-red-500/5 py-3 rounded-xl border border-red-500/10"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-16 text-lg font-black bg-navy hover:bg-navy/90 text-white rounded-2xl shadow-xl active:scale-95 transition-all"
            >
              {loading ? "Authenticating..." : "Establish Secure Session"}
            </Button>
          </form>
        </Card>

        <div className="mt-12 text-center">
           <Link href="/" className="text-[10px] font-black uppercase tracking-[0.2em] text-navy/20 hover:text-primary transition-colors">
             Return to Headquarters
           </Link>
        </div>
      </motion.div>
    </div>
  );
}

import Link from "next/link";
