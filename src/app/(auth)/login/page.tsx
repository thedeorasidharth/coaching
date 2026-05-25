"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Sparkles, User, Lock, ArrowRight, GraduationCap } from "lucide-react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function StudentLoginPage() {
  const [username, setUsername] = useState("");
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
      const response = await api.post("/student/login", {
        username,
        password,
      });

      setUser(response.data);
      router.push("/student/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-primary/5 -z-10" />
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary mb-4 shadow-xl">
            <GraduationCap className="text-accent" size={32} />
          </div>
          <h1 className="font-display text-3xl font-black text-navy uppercase tracking-tight">Student Portal</h1>
          <p className="text-navy/60 mt-2 font-medium italic">Your journey to excellence continues here.</p>
        </div>

        <Card className="p-8 shadow-2xl bg-white/80 border-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
             <Sparkles size={100} />
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6 relative z-10">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Username</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30">
                  <User size={18} />
                </div>
                <input
                  required
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full h-14 bg-white border-2 border-navy/5 rounded-2xl pl-12 pr-6 outline-none focus:border-primary/20 transition-all text-navy font-bold"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30">
                  <Lock size={18} />
                </div>
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-white border-2 border-navy/5 rounded-2xl pl-12 pr-6 outline-none focus:border-primary/20 transition-all text-navy font-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold text-red-500 text-center bg-red-500/5 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg font-bold group"
            >
              {loading ? "Verifying..." : (
                <span className="flex items-center justify-center gap-2">
                  Launch Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-8 text-center space-y-4">
          <p className="text-navy/40 text-xs font-medium">
            Forget your password? Contact the study center.
          </p>
          <div className="pt-4 border-t border-navy/5">
             <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest opacity-30 hover:opacity-100" onClick={() => router.push("/")}>
               Back to Home
             </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
