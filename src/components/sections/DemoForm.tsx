"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Send, CheckCircle } from "lucide-react";

export const DemoForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    exam: "IIT-JEE",
    class: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    setError(null);

    const trimmedName = formData.name.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedClass = formData.class.trim();

    if (!trimmedName || !trimmedPhone) {
      setError("Please fill out all required fields.");
      return;
    }

    // Phone validation: must be a valid number pattern, minimum 10 digits
    const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
    if (!phoneRegex.test(trimmedPhone)) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return;
    }

    const web3FormsKey = process.env.NEXT_PUBLIC_WEB3FORMS_KEY;
    if (!web3FormsKey || web3FormsKey === "your_web3forms_access_key_here") {
      console.error("Web3Forms access key is missing or not configured in environment variables.");
      setError("Form configuration error. Please ensure NEXT_PUBLIC_WEB3FORMS_KEY is set correctly.");
      return;
    }

    setLoading(true);

    try {
      const responseData = new FormData();
      responseData.append("access_key", web3FormsKey);
      responseData.append("name", trimmedName);
      responseData.append("phone", trimmedPhone);
      responseData.append("exam", formData.exam);
      if (trimmedClass) {
        responseData.append("class", trimmedClass);
      }
      responseData.append("subject", `New Demo Session Request - ${trimmedName}`);
      responseData.append("from_name", "EDUSPARK Lead Gen");

      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: responseData,
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
        // Reset form data
        setFormData({
          name: "",
          phone: "",
          exam: "IIT-JEE",
          class: "",
        });
      } else {
        setError(data.message || "Failed to submit request. Please try again later.");
      }
    } catch (err) {
      console.error("Web3Forms submission error:", err);
      setError("An unexpected network error occurred. Please check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="demo-form" className="py-16 sm:py-24 relative overflow-hidden bg-pattern">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto glass rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 md:p-16 shadow-2xl relative">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Send size={120} className="text-primary" />
          </div>

          {!submitted ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative z-10"
            >
              <div className="text-center mb-8 sm:mb-12">
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-navy mb-4">Book Your Free Demo</h2>
                <p className="text-navy/60 text-sm sm:text-base">Experience our teaching methodology for a week, absolutely free.</p>
              </div>

              <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6 sm:gap-8">
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-navy/70 uppercase tracking-widest ml-1">Student Name</label>
                  <input 
                    required
                    name="name"
                    type="text" 
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                    className="w-full bg-white/50 border border-primary/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 outline-none focus:border-primary/30 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-navy/70 uppercase tracking-widest ml-1">Phone Number</label>
                  <input 
                    required
                    name="phone"
                    type="tel" 
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                    className="w-full bg-white/50 border border-primary/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 outline-none focus:border-primary/30 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-navy/70 uppercase tracking-widest ml-1">Target Exam</label>
                  <select 
                    name="exam"
                    value={formData.exam}
                    onChange={(e) => setFormData({ ...formData, exam: e.target.value })}
                    disabled={loading}
                    className="w-full bg-white/50 border border-primary/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 outline-none focus:border-primary/30 transition-colors appearance-none disabled:opacity-50 text-sm sm:text-base"
                  >
                    <option value="IIT-JEE">IIT-JEE</option>
                    <option value="NEET">NEET</option>
                    <option value="XI-XII Foundation">XI-XII Foundation</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs sm:text-sm font-bold text-navy/70 uppercase tracking-widest ml-1">Current Class</label>
                  <input 
                    name="class"
                    type="text" 
                    placeholder="e.g. 11th Standard"
                    value={formData.class}
                    onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                    disabled={loading}
                    className="w-full bg-white/50 border border-primary/10 rounded-2xl px-4 sm:px-6 py-3 sm:py-4 outline-none focus:border-primary/30 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  />
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2 bg-red-50 text-red-700 border border-red-200/50 rounded-2xl p-4 text-center font-semibold text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                <div className="md:col-span-2 pt-4">
                  <Button type="submit" size="lg" className="w-full h-12 sm:h-16 text-base sm:text-lg" disabled={loading}>
                    {loading ? "Submitting Request..." : "Request Demo Access"}
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8 sm:py-12"
            >
              <div className="w-16 h-16 sm:w-24 sm:h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 sm:mb-8">
                <CheckCircle size={32} className="sm:size-[48px]" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-navy mb-4">Request Received!</h2>
              <p className="text-navy/60 text-sm sm:text-base max-w-sm mx-auto px-4">
                Thank you for your interest. Our academic counselor will call you within 24 hours to schedule your demo class.
              </p>
              <Button 
                variant="ghost" 
                className="mt-6 sm:mt-8"
                onClick={() => {
                  setError(null);
                  setSubmitted(false);
                }}
              >
                Back to Form
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
