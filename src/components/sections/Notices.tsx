"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Calendar, ArrowRight, X, ShieldAlert, Tag, Building } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Notice } from "@/types";
import api from "@/lib/axios";

export const Notices = () => {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      const { data } = await api.get("/notices");
      setNotices(data);
    } catch (error) {
      console.error("Error fetching public notices:", error);
    } finally {
      setLoading(false);
    }
  };

  // Deterministic UTC date formatter to eliminate hydration locale warnings
  const formatNoticeDate = (dateStr: string) => {
    if (!dateStr) return "";
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
            Stay informed with official announcements, exam alerts, and academic schedules.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="h-56 rounded-3xl bg-white/5 animate-pulse" />
            ))
          ) : notices.length > 0 ? (
            notices.map((notice, i) => (
              <motion.div
                key={notice._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Card 
                  onClick={() => setSelectedNotice(notice)}
                  className={`h-full group relative overflow-hidden transition-all duration-500 border-white/5 hover:border-primary/30 cursor-pointer flex flex-col justify-between ${
                    notice.isImportant ? 'bg-primary/10 border-l-4 border-l-primary' : 'bg-white/5'
                  }`}
                >
                  <div className="p-6 sm:p-8 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/40 uppercase tracking-widest">
                        <Calendar size={12} />
                        {formatNoticeDate(notice.createdAt)}
                      </div>
                      {notice.isImportant && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-wider shrink-0">
                          Important
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {notice.category && (
                        <span className="px-2 py-0.5 rounded-md bg-white/10 text-white/70 text-[9px] font-bold">
                          {notice.category}
                        </span>
                      )}
                      {notice.targetClass && (
                        <span className="px-2 py-0.5 rounded-md bg-accent/20 text-accent text-[9px] font-bold">
                          {notice.targetClass}
                        </span>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-white mb-3 group-hover:text-primary transition-colors leading-snug">
                      {notice.title}
                    </h3>
                    
                    <p className="text-xs sm:text-sm text-white/60 line-clamp-3 mb-6 flex-1">
                      {notice.content}
                    </p>

                    <button 
                      type="button" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedNotice(notice);
                      }}
                      className="mt-auto inline-flex items-center gap-2 text-xs font-bold text-primary group-hover:gap-3 transition-all"
                    >
                      Read More <ArrowRight size={14} />
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-16 text-center space-y-4 bg-white/5 rounded-[2.5rem] border border-white/5">
              <Bell size={40} className="mx-auto text-white/20" />
              <h3 className="text-lg font-bold text-white/60">No active notices at the moment</h3>
              <p className="text-xs text-white/40">Check back later for official announcements and updates.</p>
            </div>
          )}
        </div>
      </div>

      {/* FULL NOTICE DETAIL MODAL */}
      <AnimatePresence>
        {selectedNotice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedNotice(null)} 
              className="absolute inset-0 bg-black/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.95, opacity: 0 }} 
              className="relative w-full max-w-xl bg-navy-light text-white rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto z-10"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedNotice.isImportant && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-black uppercase tracking-wider">
                        <ShieldAlert size={12} /> Important Notice
                      </span>
                    )}
                    {selectedNotice.category && (
                      <span className="px-2.5 py-0.5 rounded-md bg-white/10 text-white/80 text-[10px] font-bold">
                        {selectedNotice.category}
                      </span>
                    )}
                    {selectedNotice.targetClass && (
                      <span className="px-2.5 py-0.5 rounded-md bg-accent/20 text-accent text-[10px] font-bold">
                        {selectedNotice.targetClass}
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-white text-xl sm:text-2xl leading-snug">{selectedNotice.title}</h3>
                  <p className="text-[11px] font-bold text-white/40 flex items-center gap-1.5">
                    <Calendar size={12} /> Published {formatNoticeDate(selectedNotice.createdAt)}
                  </p>
                </div>
                <button 
                  type="button" 
                  onClick={() => setSelectedNotice(null)} 
                  className="text-white/40 hover:text-white p-2 rounded-xl bg-white/5 transition-all shrink-0"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Content Body */}
              <div className="space-y-4">
                <p className="text-sm sm:text-base text-white/80 leading-relaxed font-medium whitespace-pre-line">
                  {selectedNotice.content}
                </p>

                {selectedNotice.attachmentUrl && (
                  <div className="pt-2">
                    <a 
                      href={selectedNotice.attachmentUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/20 text-accent border border-primary/30 text-xs font-bold hover:bg-primary/30 transition-all"
                    >
                      View Attachment / Link
                    </a>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-white/10 flex justify-end">
                <Button 
                  type="button" 
                  onClick={() => setSelectedNotice(null)} 
                  className="h-11 px-6 text-xs rounded-xl"
                >
                  Close Notice
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
