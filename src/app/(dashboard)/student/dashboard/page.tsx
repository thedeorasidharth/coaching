"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, FileText, Bell, Award, Sparkles, Clock, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button, ButtonProps } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import api from "@/lib/axios";
import { Quiz, StudyNote, Notice } from "@/types";
import Link from "next/link";

export default function StudentDashboard() {
  const { user } = useAuthStore();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [submittedQuizIds, setSubmittedQuizIds] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, noticeRes, leaderboardRes, resultsRes] = await Promise.all([
          api.get("/quizzes"),
          api.get("/notices"),
          api.get("/analytics/leaderboard"),
          api.get("/results/student").catch(() => ({ data: [] }))
        ]);
        
        // Filter only published quizzes for students
        setQuizzes(quizRes.data.filter((q: Quiz) => q.isPublished).slice(0, 2));
        setNotices(noticeRes.data.slice(0, 3));
        setLeaderboard(leaderboardRes.data.slice(0, 3));

        const submittedSet = new Set<string>();
        (resultsRes.data || []).forEach((r: any) => {
          const qId = typeof r.quizId === 'object' && r.quizId ? r.quizId._id : r.quizId;
          if (qId) submittedSet.add(qId);
        });
        setSubmittedQuizIds(submittedSet);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">
            Hello, <span className="text-primary italic">{user?.name}</span> 👋
          </h1>
          <p className="text-navy/60 mt-1">Ready to ace your learning today?</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-4 rounded-[2rem] shadow-xl border-2 border-primary/5">
          <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-white shadow-lg">
            <Award size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Global Rank</p>
            <p className="text-lg font-black text-navy">
              {leaderboard.findIndex(l => l._id === user?._id) !== -1 
                ? `#${leaderboard.findIndex(l => l._id === user?._id) + 1}` 
                : "#--"
              } <span className="text-xs font-bold text-green-500">Keep growing!</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-navy">Upcoming Tests</h2>
              <Link href="/student/tests" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline">View All</Link>
            </div>
            <div className="grid gap-4">
              {loading ? (
                [1, 2].map(i => <div key={i} className="h-24 rounded-3xl bg-navy/5 animate-pulse" />)
              ) : quizzes.length > 0 ? (
                quizzes.map((test: any) => {
                  const isSubmitted = submittedQuizIds.has(test._id);
                  const isExpired = test.endDate ? new Date() > new Date(test.endDate) : false;

                  let badge = (
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
                      Ready to Attempt
                    </span>
                  );
                  let btnText = "Begin Assessment";
                  let btnStyle = "bg-primary hover:bg-primary/90 text-white";

                  if (isSubmitted) {
                    badge = (
                      <span className="text-[10px] font-black text-green-600 uppercase tracking-widest bg-green-500/10 px-2.5 py-1 rounded-full">
                        Submitted
                      </span>
                    );
                    btnText = "Review Attempt";
                    btnStyle = "bg-navy hover:bg-navy/90 text-white";
                  } else if (isExpired) {
                    badge = (
                      <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest bg-amber-500/10 px-2.5 py-1 rounded-full">
                        Ended
                      </span>
                    );
                    btnText = "View Paper (Ended)";
                    btnStyle = "bg-amber-600 hover:bg-amber-700 text-white";
                  }

                  return (
                    <Card key={test._id} className="flex flex-col md:flex-row md:items-center justify-between p-6 hover:border-primary/20 transition-all group gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                          isSubmitted ? 'bg-green-500/10 text-green-600' : isExpired ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary'
                        }`}>
                          <BookOpen size={28} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{test.subject}</span>
                            <span className="text-[9px] font-black text-navy/30 uppercase tracking-widest">• {test.class}</span>
                          </div>
                          <h3 className="font-bold text-navy text-lg">{test.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="flex items-center gap-1 text-xs font-bold text-navy/40"><Clock size={14} /> {test.duration} mins</span>
                            {badge}
                          </div>
                        </div>
                      </div>
                      <Link href={`/student/tests/${test._id}`} className="shrink-0">
                        <Button size="sm" className={`mt-4 md:mt-0 flex items-center gap-2 ${btnStyle}`}>
                          {btnText} <ArrowRight size={16} />
                        </Button>
                      </Link>
                    </Card>
                  );
                })
              ) : (
                <p className="text-navy/40 text-sm font-medium italic">No upcoming tests scheduled.</p>
              )}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-black text-navy">Leaderboard Preview</h2>
              <span className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Top Performers</span>
            </div>
            <div className="grid gap-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl bg-navy/5 animate-pulse" />)
              ) : leaderboard.map((entry, i) => (
                <div key={entry._id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-navy/5 group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-accent text-white' : 'bg-navy/5 text-navy/40'}`}>{i + 1}</span>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                      {entry.student.fullName[0]}
                    </div>
                    <div>
                      <p className="font-bold text-navy text-sm">{entry.student.fullName}</p>
                      <p className="text-[10px] font-medium text-navy/40">{entry.totalTests} Tests Attempted</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-primary">{entry.avgPercentage.toFixed(1)}%</p>
                    <p className="text-[10px] font-bold text-navy/30 uppercase">Avg Score</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-6">
            <h2 className="text-2xl font-black text-navy">Notices</h2>
            <div className="space-y-4">
              {loading ? (
                [1, 2, 3].map(i => <div key={i} className="h-12 rounded-xl bg-navy/5 animate-pulse" />)
              ) : notices.length > 0 ? (
                notices.map((notice) => (
                  <div key={notice._id} className="flex gap-4 items-start border-l-2 border-primary/10 pl-6 relative py-2">
                    <div className={`absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${notice.isImportant ? "bg-accent shadow-[0_0_8px_rgba(212,176,106,0.8)]" : "bg-primary/30"}`} />
                    <div>
                      <h4 className={`text-sm font-bold line-clamp-1 ${notice.isImportant ? "text-primary" : "text-navy"}`}>{notice.title}</h4>
                      <p className="text-[10px] font-medium text-navy/40">{new Date(notice.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-navy/40 text-sm font-medium italic">No notices at the moment.</p>
              )}
            </div>
            <Link href="/student/notices">
              <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest mt-4">View All Notices</Button>
            </Link>
          </section>

          <Card className="bg-primary p-8 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xl font-bold mb-2">Need Help?</h3>
              <p className="text-white/80 text-xs leading-relaxed mb-6 font-medium">Have a question about your tests, results or account?</p>
              <a 
                href="https://wa.me/919460234151?text=Hi%20EduSpark%2C%20I%20need%20help%20regarding%20my%20student%20account." 
                target="_blank" 
                rel="noopener noreferrer"
                className="block w-full"
              >
                <Button size="sm" variant="outline" className="bg-white/10 border-white/20 hover:bg-white/20 text-white border-none w-full flex items-center justify-center gap-2 font-bold">
                  Contact Support
                </Button>
              </a>
            </div>
            <Sparkles className="absolute bottom-[-20px] right-[-20px] text-white/5" size={120} />
          </Card>
        </div>
      </div>
    </div>
  );
}
