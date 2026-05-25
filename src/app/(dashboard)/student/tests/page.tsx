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
  Layout
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function StudentTestsPortal() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/quizzes", { 
        params: { published: 'true' }
      });
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  };

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
                <p className="text-xl font-black italic">{quizzes.length} Tests</p>
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
        ) : quizzes.map((quiz, i) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 space-y-8 hover:shadow-2xl transition-all border-white group relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-10 opacity-5 text-navy group-hover:rotate-12 transition-transform duration-700">
                 <Layout size={120} />
              </div>

              <div className="flex justify-between items-start">
                <div className="w-16 h-16 rounded-[1.5rem] bg-navy/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500 shadow-inner">
                  <BookOpen size={32} />
                </div>
                <div className="text-right">
                   <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{quiz.subject}</p>
                   <p className="text-[10px] font-black text-navy/20 uppercase tracking-widest mt-1">{quiz.class}</p>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <h3 className="text-2xl font-bold text-navy leading-tight group-hover:text-primary transition-colors">{quiz.title}</h3>
                <p className="text-sm font-medium text-navy/40 line-clamp-2">{quiz.description || "Challenge yourself with this comprehensive assessment designed to test your core concepts."}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-navy/5">
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest">Duration</p>
                    <p className="font-bold text-navy flex items-center gap-2"><Clock size={14} className="text-primary" /> {quiz.duration} Mins</p>
                 </div>
                 <div className="space-y-1">
                    <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest">Questions</p>
                    <p className="font-bold text-navy flex items-center gap-2"><HelpCircle size={14} className="text-primary" /> {quiz.questions.length} Items</p>
                 </div>
              </div>

              <Link href={`/student/tests/${quiz._id}`} className="mt-8">
                <Button className="w-full h-14 rounded-2xl gap-3 text-lg font-bold group/btn shadow-xl shadow-primary/20">
                   Begin Assessment <ArrowRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                </Button>
              </Link>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
