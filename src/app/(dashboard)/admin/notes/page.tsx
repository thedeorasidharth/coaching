"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Search, Trash2, Download, Tag, X, CheckCircle, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import axios from "axios";

export default function NotesManagement() {
  return (
    <div className="flex items-center justify-center h-64 bg-navy/5 rounded-[3rem]">
      <h2 className="text-2xl font-bold text-navy/20 uppercase tracking-widest">Notes System Temporarily Disabled</h2>
    </div>
  );
}
