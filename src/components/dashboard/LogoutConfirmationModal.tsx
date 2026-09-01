"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, X } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LogoutConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  loading?: boolean;
}

export function LogoutConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
}: LogoutConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={loading ? undefined : onClose}
          className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl z-10 border border-navy/5"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="absolute top-6 right-6 text-navy/40 hover:text-navy disabled:opacity-30 p-2 rounded-xl transition-all"
          >
            <X size={20} />
          </button>

          {/* Icon */}
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
            <LogOut size={28} />
          </div>

          {/* Text Content */}
          <div>
            <h3 className="font-display font-black text-navy text-2xl">Log out?</h3>
            <p className="text-navy/60 text-sm mt-2 font-medium">
              Are you sure you want to log out of your account?
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 h-12 rounded-2xl font-bold text-navy border-navy/10 hover:bg-navy/5"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="flex-1 h-12 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-lg shadow-red-600/20 disabled:opacity-50"
              onClick={onConfirm}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
