"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle, 
  AlertTriangle, 
  Monitor, 
  Zap,
  Timer,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import api from "@/lib/axios";

export default function StudentTestPage() {
  const { id } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [violations, setViolations] = useState(0);
  const startTimestamp = useRef(Date.now());

  const fetchQuiz = useCallback(async () => {
    try {
      const res = await api.get(`/quizzes/${id}`);
      setQuiz(res.data);
      setTimeLeft(res.data.duration * 60);
    } catch (err) {
      console.error(err);
      router.push("/student/tests");
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    
    const timeTaken = Math.floor((Date.now() - startTimestamp.current) / 1000);
    
    try {
      await api.post("/results/submit", {
        quizId: id,
        answers: quiz.questions.map((_: any, idx: number) => answers[idx] ?? -1),
        timeTaken
      });
      router.push("/student/results");
    } catch (err) {
      alert("Error submitting test. Please contact support.");
      setSubmitting(false);
    }
  }, [id, quiz, answers, submitting, router]);

  // Anti-Cheat: Tab Switch Detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setViolations(prev => {
          const next = prev + 1;
          if (next >= 3) {
            alert("Multiple tab switches detected. Auto-submitting assessment.");
            handleSubmit();
          } else {
            alert(`Warning: Tab switching is not allowed! Violations: ${next}/3`);
          }
          return next;
        });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [handleSubmit]);

  // Timer logic
  useEffect(() => {
    if (timeLeft <= 0 && quiz && !submitting) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, quiz, handleSubmit, submitting]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) return <div className="h-screen flex items-center justify-center font-display text-2xl font-black text-navy animate-pulse italic">Synchronizing Assessment Protocols...</div>;
  if (!quiz) return null;

  const q = quiz.questions[currentQ];
  const progress = ((currentQ + 1) / quiz.questions.length) * 100;

  return (
    <div className="fixed inset-0 z-[100] bg-pattern flex flex-col overflow-hidden font-sans">
      {/* Test Header */}
      <header className="h-24 bg-white/80 backdrop-blur-md border-b border-navy/5 px-8 flex items-center justify-between relative z-10 shadow-2xl">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-navy text-accent rounded-2xl flex items-center justify-center shadow-xl">
             <BookOpen size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black text-navy uppercase tracking-tighter">{quiz.title}</h1>
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{quiz.subject} • {quiz.class}</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
           <div className={`flex items-center gap-4 px-6 py-3 rounded-2xl border-2 transition-all ${timeLeft < 300 ? "border-red-500 bg-red-500/5 text-red-500 animate-pulse" : "border-navy/5 text-navy"}`}>
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Time Remaining</p>
                <p className="text-2xl font-black italic tabular-nums">{formatTime(timeLeft)}</p>
              </div>
              <Timer size={32} />
           </div>
           <Button onClick={() => setShowConfirm(true)} className="h-14 px-8 bg-navy hover:bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl transition-all shadow-xl shadow-navy/20">
             Finish Test
           </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-10 flex flex-col items-center justify-center relative overflow-y-auto">
        <div className="w-full max-w-4xl space-y-12">
          {/* Progress Section */}
          <div className="space-y-4">
             <div className="flex justify-between items-end">
                <p className="text-sm font-black text-navy uppercase tracking-widest italic">Progress: <span className="text-primary italic">{currentQ + 1}</span> / {quiz.questions.length}</p>
                <p className="text-xs font-bold text-navy/20 uppercase tracking-widest">Question weightage: {q.marks} Marks</p>
             </div>
             <div className="w-full h-3 bg-navy/5 rounded-full overflow-hidden p-0.5 border-2 border-white shadow-inner">
                <motion.div 
                  className="h-full bg-primary rounded-full shadow-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
             </div>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="space-y-12"
            >
              <div className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest">
                    <Zap size={14} /> Active Question
                 </div>
                 <h2 className="text-3xl md:text-4xl font-bold text-navy leading-[1.1] tracking-tight">
                   {q.question}
                 </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {q.options.map((opt: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setAnswers({...answers, [currentQ]: i})}
                    className={`w-full text-left p-8 rounded-[2.5rem] border-4 transition-all group relative overflow-hidden ${
                      answers[currentQ] === i 
                        ? "bg-primary text-white border-primary shadow-[0_20px_40px_-10px_rgba(24,78,80,0.3)] scale-[1.02]" 
                        : "bg-white border-transparent hover:border-primary/20 text-navy hover:scale-[1.01]"
                    }`}
                  >
                    {answers[currentQ] === i && (
                      <div className="absolute top-0 right-0 p-6 opacity-20"><CheckCircle size={40} /></div>
                    )}
                    <span className="flex items-center gap-6 relative z-10">
                      <span className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg transition-all ${
                        answers[currentQ] === i ? "bg-white/20 text-white" : "bg-navy/5 text-navy/30 group-hover:bg-primary/10 group-hover:text-primary"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-lg font-bold">{opt}</span>
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-10 border-t border-navy/5">
             <Button 
               variant="outline" 
               disabled={currentQ === 0}
               onClick={() => setCurrentQ(prev => prev - 1)}
               className="h-14 px-8 rounded-2xl gap-3 border-navy/10 text-navy font-bold uppercase tracking-widest text-xs"
             >
               <ChevronLeft size={20} /> Back
             </Button>

             <div className="hidden md:flex gap-2">
                {quiz.questions.map((_: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => setCurrentQ(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      currentQ === i ? "bg-primary w-10" : answers[i] !== undefined ? "bg-primary/40" : "bg-navy/10 hover:bg-navy/20"
                    }`}
                  />
                ))}
             </div>

             {currentQ === quiz.questions.length - 1 ? (
                <Button 
                  onClick={() => setShowConfirm(true)}
                  className="h-14 px-10 rounded-2xl gap-3 bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-green-600/20"
                >
                  Submit Assessment <CheckCircle size={20} />
                </Button>
             ) : (
                <Button 
                  onClick={() => setCurrentQ(prev => prev + 1)}
                  className="h-14 px-10 rounded-2xl gap-3 bg-navy hover:bg-primary text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-navy/20"
                >
                  Next Question <ChevronRight size={20} />
                </Button>
             )}
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-navy/20 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[3rem] p-10 text-center space-y-8 shadow-2xl">
              <div className="w-24 h-24 bg-accent/10 text-navy rounded-full flex items-center justify-center mx-auto shadow-inner">
                <AlertTriangle size={48} />
              </div>
              <div>
                <h2 className="text-3xl font-black text-navy uppercase tracking-tighter italic">Final Submission?</h2>
                <p className="text-navy/40 text-sm mt-2 font-medium">You have answered {Object.keys(answers).length} out of {quiz.questions.length} questions. You cannot edit your answers after submission.</p>
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-14 rounded-2xl" onClick={() => setShowConfirm(false)}>Resume Test</Button>
                <Button className="flex-1 h-14 rounded-2xl bg-navy" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Yes, Submit"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Security Monitoring Indicator */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 backdrop-blur shadow-sm border border-navy/5">
         <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
         <p className="text-[9px] font-black uppercase tracking-widest text-navy/30">Secure Proctored Environment Active</p>
      </div>
    </div>
  );
}
