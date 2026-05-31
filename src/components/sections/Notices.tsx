"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Calendar, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import api from "@/lib/axios";
import { Notice } from "@/types";

const staticNotices: Notice[] = [
  {
    _id: "notice1",
    title: "Admissions Open for Target Batch 2026-27",
    content: "Direct admissions and scholarship cum admission tests (SEAT) are open for Class XI, XII, and Repeater batches.",
    createdAt: "2026-05-20T12:00:00.000Z",
    isImportant: true,
  },
  {
    _id: "notice2",
    title: "New Batches Commencing from June 1st",
    content: "New offline and hybrid batches for JEE (Main+Advanced) and NEET-UG are starting. Register to secure your seat.",
    createdAt: "2026-05-18T12:00:00.000Z",
    isImportant: true,
  },
  {
    _id: "notice3",
    title: "Free Strategy Seminar by Expert Faculty",
    content: "Join our expert faculty for a strategy session on mastering physics & chemistry concepts on May 30th.",
    createdAt: "2026-05-15T12:00:00.000Z",
    isImportant: false,
  },
  {
    _id: "notice4",
    title: "National Scholarship Test (NST) Registration",
    content: "Register online or visit our center to participate in the NST. Up to 100% tuition fee waiver based on performance.",
    createdAt: "2026-05-12T12:00:00.000Z",
    isImportant: false,
  }
];

export const Notices = () => {
  const notices = staticNotices;
  const loading = false;

  // Deterministic UTC date formatter to permanently eliminate locales hydration warnings
  const formatNoticeDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = String(date.getUTCDate()).padStart(2, "0");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[date.getUTCMonth()];
    const year = date.getUTCFullYear();
    return `${day} ${month} ${year}`;
  };

  return (
    <section id="notices" className="py-16 sm:py-24 bg-navy relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[60%] bg-primary blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[60%] bg-accent blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 sm:mb-16 gap-6">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 text-accent mb-4"
            >
              <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                <Bell size={20} className="animate-ring" />
              </div>
              <span className="text-sm font-black uppercase tracking-widest">Latest Updates</span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl md:text-5xl font-black text-white"
            >
              Notice <span className="text-primary italic">Board</span>
            </motion.h2>
          </div>
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-white/40 max-w-md text-right hidden md:block"
          >
            Stay informed with the latest announcements, batch updates, and exam schedules.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-3xl bg-white/5 animate-pulse" />
            ))
          ) : (
            notices.map((notice, i) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className={`h-full group relative overflow-hidden transition-all duration-500 border-white/5 hover:border-primary/30 ${notice.isImportant ? 'bg-primary/10' : 'bg-white/5'}`}>
                  <div className="p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <Calendar size={12} />
                        {formatNoticeDate(notice.createdAt)}
                      </div>
                      {notice.isImportant && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[8px] font-black uppercase">Important</span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white mb-2 sm:mb-4 group-hover:text-primary transition-colors leading-snug">{notice.title}</h3>
                    <p className="text-xs sm:text-sm text-white/60 line-clamp-2 mb-4 sm:mb-6">{notice.content}</p>
                    <div className="flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-4 transition-all">
                      Read More <ArrowRight size={14} />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};
