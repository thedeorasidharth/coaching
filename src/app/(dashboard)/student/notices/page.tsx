"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, AlertTriangle, Sparkles, Calendar } from "lucide-react";
import { Card } from "@/components/ui/Card";
import api from "@/lib/axios";
import { Notice } from "@/types";
import { FormattedDate } from "@/components/ui/FormattedDate";

export default function StudentNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await api.get("/notices");
        setNotices(data);
      } catch (error) {
        console.error("Error fetching notices:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight uppercase tracking-tighter italic">
            Institute <span className="text-primary italic">Announcements</span>
          </h1>
          <p className="text-navy/40 mt-1 uppercase text-[10px] font-black tracking-widest italic">
            Stay Updated • Class Schedules, Exam Notifications & Circulars
          </p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-xl border-2 border-primary/5">
          <Bell className="text-primary" size={20} />
          <span className="text-sm font-bold text-navy">Active Notices: <span className="text-primary">{notices.length}</span></span>
        </div>
      </div>

      <div className="grid gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-32 rounded-3xl bg-navy/5 animate-pulse" />)
        ) : notices.length > 0 ? (
          notices.map((notice, i) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className={`p-8 space-y-4 hover:shadow-2xl transition-all border-white relative overflow-hidden ${
                  notice.isImportant ? "border-l-8 border-l-accent bg-gradient-to-r from-accent/5 to-transparent" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${
                        notice.isImportant ? "bg-accent text-white" : "bg-primary/10 text-primary"
                      }`}
                    >
                      <Bell size={28} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-bold text-navy text-2xl leading-snug">{notice.title}</h3>
                        {notice.isImportant && (
                          <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent-800 text-[10px] font-black uppercase tracking-widest">
                            <AlertTriangle size={12} /> Important Notice
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-bold text-navy/30 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <Calendar size={12} /> Published <FormattedDate date={notice.createdAt} />
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-navy/5">
                  <p className="text-navy/70 text-base leading-relaxed whitespace-pre-line font-medium">
                    {notice.content}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-20 bg-navy/5 rounded-[3rem] space-y-4">
            <Bell size={48} className="mx-auto text-navy/20" />
            <h3 className="text-xl font-bold text-navy/40">No active notices at the moment</h3>
          </div>
        )}
      </div>
    </div>
  );
}
