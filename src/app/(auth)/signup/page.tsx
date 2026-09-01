"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { 
  User, 
  Lock, 
  ArrowRight, 
  GraduationCap, 
  Phone, 
  BookOpen,
  Building,
  Sparkles
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function StudentSignupPage() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    password: "",
    course: "JEE",
    class: "Class 12",
  });

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.password) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/student/signup", formData);
      setUser(response.data);
      router.push("/student/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please check your details and try again.");
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
        className="w-full max-w-lg relative z-10 my-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-primary mb-4 shadow-xl">
            <GraduationCap className="text-accent" size={32} />
          </div>
          <h1 className="font-display text-3xl font-black text-navy uppercase tracking-tight">
            Test Series <span className="text-primary italic">Registration</span>
          </h1>
          <p className="text-navy/60 mt-1 font-medium text-sm">Join EduSpark Test Series & Start Your Prep</p>
        </div>

        <Card className="p-8 shadow-2xl bg-white/90 border-white relative overflow-hidden">
          <form onSubmit={handleSignup} className="space-y-5 relative z-10">
            {/* 1. Full Name */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full h-12 bg-white border-2 border-navy/5 rounded-2xl pl-12 pr-4 outline-none focus:border-primary/20 transition-all text-navy font-bold text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            {/* 2. Mobile Number */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Mobile Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full h-12 bg-white border-2 border-navy/5 rounded-2xl pl-12 pr-4 outline-none focus:border-primary/20 transition-all text-navy font-bold text-sm"
                  placeholder="Enter 10-digit mobile number"
                />
              </div>
            </div>

            {/* 3. Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-12 bg-white border-2 border-navy/5 rounded-2xl pl-12 pr-4 outline-none focus:border-primary/20 transition-all text-navy font-bold text-sm"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* 4. Preparing For / Course */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Preparing For</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                  <select
                    className="w-full h-12 bg-white border-2 border-navy/5 rounded-2xl pl-12 pr-4 outline-none focus:border-primary/20 transition-all text-navy font-bold text-sm appearance-none"
                    value={formData.course}
                    onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  >
                    <option value="JEE">JEE</option>
                    <option value="NEET">NEET</option>
                    <option value="Foundation">Foundation</option>
                  </select>
                </div>
              </div>

              {/* 5. Class */}
              <div className="space-y-2">
                <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Class</label>
                <div className="relative">
                  <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                  <select
                    className="w-full h-12 bg-white border-2 border-navy/5 rounded-2xl pl-12 pr-4 outline-none focus:border-primary/20 transition-all text-navy font-bold text-sm appearance-none"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                  >
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                    <option value="Dropper">Dropper</option>
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs font-bold text-red-500 text-center bg-red-500/5 py-3 rounded-xl border border-red-500/10"
              >
                {error}
              </motion.p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 text-lg font-bold group shadow-xl shadow-primary/20"
            >
              {loading ? "Creating Account..." : (
                <span className="flex items-center justify-center gap-2">
                  Complete Registration <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            <div className="text-center pt-4 border-t border-navy/5">
              <p className="text-xs font-medium text-navy/60">
                Already registered?{" "}
                <Link href="/login" className="text-primary font-bold hover:underline">
                  Sign In to Student Portal
                </Link>
              </p>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
