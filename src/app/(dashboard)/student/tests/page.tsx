"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  BookOpen, 
  Clock, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle, 
  TrendingUp,
  AlertCircle,
  Zap,
  Layout,
  FileCheck
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function StudentTestsPortal() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [submittedMap, setSubmittedMap] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const [quizRes, resultsRes] = await Promise.all([
        api.get("/quizzes", { params: { published: 'true' } }),
        api.get("/results/student").catch(() => ({ data: [] }))
      ]);

      setQuizzes(quizRes.data);

      const map: Record<string, any> = {};
      (resultsRes.data || []).forEach((r: any) => {
        const qId = typeof r.quizId === 'object' && r.quizId ? r.quizId._id : r.quizId;
        if (qId) {
          map[qId] = r;
        }
      });
      setSubmittedMap(map);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  const liveAvailableCount = quizzes.filter(q => {
    const isSubmitted = !!submittedMap[q._id];
    const isExpired = q.endDate ? new Date() > new Date(q.endDate) : false;
    return !isSubmitted && !isExpired;
  }).length;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight uppercase tracking-tighter italic">
            Examination <span className="text-primary italic">Portal</span>
          </h1>
          <p className="text-navy/40 mt-1 uppercase text-[10px] font-black tracking-widest italic">Prepare for Excellence • Interactive Assessments</p>
        </div>
        <div className="flex gap-4">
           <Card className="px-6 py-3 bg-navy text-white border-none shadow-xl shadow-navy/20 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-accent flex items-center justify-center"><Zap size={20} /></div>
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-40">Ready to Attempt</p>
                <p className="text-xl font-black italic">{liveAvailableCount} {liveAvailableCount === 1 ? 'Test Available' : 'Available'}</p>
              </div>
           </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <p className="col-span-full text-center py-20 text-navy/40 font-black italic">Loading assessment inventory...</p>
        ) : quizzes.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-6">
             <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto text-navy/20"><AlertCircle size={40} /></div>
             <p className="text-navy/40 font-black italic">No assessments are live for your current class. Check back later.</p>
          </div>
        ) : quizzes.map((quiz, i) => {
          const isSubmitted = !!submittedMap[quiz._id];
          const studentResult = submittedMap[quiz._id];
          const isExpired = quiz.endDate ? new Date() > new Date(quiz.endDate) : false;

          return (
            <motion.div
              key={quiz._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 space-y-5 hover:shadow-2xl transition-all border-white group relative overflow-hidden h-full flex flex-col justify-between">
                <div className="absolute top-0 right-0 p-8 opacity-5 text-navy group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
                   <Layout size={100} />
                </div>

                {/* Section 1: Icon + Subject/Class + Status */}
                <div className="flex justify-between items-start gap-3">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 shadow-inner shrink-0 ${
                    isSubmitted ? "bg-green-500/10 text-green-600" : isExpired ? "bg-amber-500/10 text-amber-600" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                  }`}>
                    {isSubmitted ? <FileCheck size={28} /> : isExpired ? <BookOpen size={28} /> : <BookOpen size={28} />}
                  </div>
                  <div className="text-right flex flex-col items-end shrink-0">
                     <p className="text-[10px] font-black text-primary uppercase tracking-[0.15em]">{quiz.subject}</p>
                     <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest mt-0.5">{quiz.class}</p>
                     {isSubmitted ? (
                        <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-green-500/10 text-green-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <CheckCircle size={12} /> Submitted ({Math.round(studentResult.percentage)}%)
                        </span>
                     ) : isExpired ? (
                        <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <AlertCircle size={12} /> Ended
                        </span>
                     ) : (
                        <span className="mt-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Zap size={12} /> Ready to Attempt
                        </span>
                     )}
                  </div>
                </div>

                {/* Section 2: Title + Short Description */}
                <div className="space-y-1.5 flex-1">
                  <h3 className="text-xl font-bold text-navy leading-snug group-hover:text-primary transition-colors">{quiz.title}</h3>
                  <p className="text-xs font-medium text-navy/50 line-clamp-2 leading-relaxed">{quiz.description || "Comprehensive assessment designed to test your core concepts."}</p>
                </div>

                {/* Section 3: 2-column Compact Test Metadata */}
                <div className="grid grid-cols-2 gap-3.5 pt-4 pb-2 border-t border-navy/5">
                   <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest">Duration</p>
                      <p className="font-bold text-navy text-xs sm:text-sm flex items-center gap-1.5"><Clock size={13} className="text-primary shrink-0" /> {quiz.duration} Mins</p>
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest">Questions</p>
                      <p className="font-bold text-navy text-xs sm:text-sm flex items-center gap-1.5"><HelpCircle size={13} className="text-primary shrink-0" /> {quiz.questions.length} Items</p>
                   </div>
                   {quiz.examType && (
                     <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest">Exam Type</p>
                        <p className="font-bold text-navy text-xs sm:text-sm">{quiz.examType}</p>
                     </div>
                   )}
                   {quiz.totalMarks && (
                     <div className="space-y-0.5">
                        <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest">Total Marks</p>
                        <p className="font-bold text-primary text-xs sm:text-sm">{quiz.totalMarks} Marks</p>
                     </div>
                   )}
                </div>

                {/* Section 4: Primary Action Button */}
                <div className="pt-3">
                  <Link href={`/student/tests/${quiz._id}`} className="block w-full">
                    {isSubmitted ? (
                      <Button className="w-full h-12 rounded-xl gap-2 text-base font-bold bg-navy hover:bg-navy/90 text-white shadow-lg shadow-navy/20">
                         Review Attempt <FileCheck size={18} />
                      </Button>
                    ) : isExpired ? (
                      <Button className="w-full h-12 rounded-xl gap-2 text-base font-bold bg-amber-600 hover:bg-amber-700 text-white shadow-lg">
                         View Paper (Ended) <BookOpen size={18} />
                      </Button>
                    ) : (
                      <Button className="w-full h-12 rounded-xl gap-2 text-base font-bold group/btn shadow-lg shadow-primary/20">
                         Begin Assessment <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform" />
                      </Button>
                    )}
                  </Link>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
