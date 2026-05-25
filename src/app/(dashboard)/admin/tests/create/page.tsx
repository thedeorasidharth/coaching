"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Settings, 
  CheckCircle, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Layout, 
  ChevronRight,
  GripVertical,
  Target
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function QuizBuilderPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    subject: "Physics",
    class: "Class XII - JEE",
    duration: 60,
    totalMarks: 0,
    questions: [
      { 
        question: "", 
        options: ["Option 1", "Option 2", "Option 3", "Option 4"], 
        correctAnswer: 0, 
        marks: 4 
      }
    ]
  });

  const addQuestion = () => {
    setQuizData({
      ...quizData,
      questions: [
        ...quizData.questions,
        { 
          question: "", 
          options: ["Option 1", "Option 2", "Option 3", "Option 4"], 
          correctAnswer: 0, 
          marks: 4 
        }
      ]
    });
  };

  const removeQuestion = (idx: number) => {
    const newQs = quizData.questions.filter((_, i) => i !== idx);
    setQuizData({ ...quizData, questions: newQs });
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const newQs = [...quizData.questions];
    (newQs[idx] as any)[field] = value;
    setQuizData({ ...quizData, questions: newQs });
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const newQs = [...quizData.questions];
    newQs[qIdx].options[oIdx] = value;
    setQuizData({ ...quizData, questions: newQs });
  };

  const calculateTotalMarks = () => {
    return quizData.questions.reduce((acc, q) => acc + (Number(q.marks) || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const finalData = {
        ...quizData,
        totalMarks: calculateTotalMarks()
      };
      await api.post("/quizzes/create", finalData);
      router.push("/admin/tests");
    } catch (err: any) {
      alert(err.response?.data?.message || "Error creating quiz");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20">
      <div className="flex items-center gap-6">
        <Link href="/admin/tests">
          <Button variant="outline" className="w-12 h-12 p-0 rounded-2xl border-navy/10 bg-white hover:bg-navy hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight uppercase tracking-tighter">
            Quiz <span className="text-primary italic">Builder</span>
          </h1>
          <p className="text-navy/40 mt-1 uppercase text-[10px] font-black tracking-widest italic">Engineered for Academic Precision</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Sidebar Settings */}
        <div className="space-y-8">
          <Card className="p-8 space-y-8 bg-white/80 border-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform duration-700">
               <Settings size={80} />
            </div>
            
            <h3 className="font-black text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-4 flex items-center gap-2">
              <Clock size={18} className="text-primary" /> Test Configuration
            </h3>

            <div className="space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Test Duration (Minutes)</label>
                <input required type="number" className="w-full h-12 bg-navy/5 rounded-xl px-4 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy" value={quizData.duration} onChange={(e) => setQuizData({...quizData, duration: parseInt(e.target.value)})} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Target Subject</label>
                <select className="w-full h-12 bg-navy/5 rounded-xl px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy appearance-none" value={quizData.subject} onChange={(e) => setQuizData({...quizData, subject: e.target.value})}>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Maths</option>
                  <option>Biology</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Goal / Class</label>
                <select className="w-full h-12 bg-navy/5 rounded-xl px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy appearance-none" value={quizData.class} onChange={(e) => setQuizData({...quizData, class: e.target.value})}>
                  <option>Class XII - JEE</option>
                  <option>Class XII - NEET</option>
                  <option>Class XI - Foundation</option>
                  <option>Repeater - JEE</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-navy/5 flex items-center justify-between">
               <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Total Weightage</p>
               <p className="text-2xl font-black text-primary italic">{calculateTotalMarks()} Marks</p>
            </div>
          </Card>

          <Button type="submit" disabled={loading} className="w-full h-20 text-xl font-black gap-3 group relative overflow-hidden">
             <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
             {loading ? "Constructing Quiz..." : (
               <>
                 <CheckCircle size={24} /> Launch Assessment
               </>
             )}
          </Button>
        </div>

        {/* Main Quiz Builder Area */}
        <div className="lg:col-span-2 space-y-10">
          <Card className="p-10 space-y-8 bg-white border-white shadow-2xl rounded-[3rem] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-navy">
               <BookOpen size={120} />
            </div>
            
            <div className="space-y-6 relative z-10">
              <input 
                required
                type="text" 
                placeholder="Assessment Title (e.g. Modern Physics Weekly Test)"
                className="w-full text-4xl font-black text-navy bg-transparent border-none outline-none placeholder:text-navy/10 tracking-tighter italic"
                value={quizData.title}
                onChange={(e) => setQuizData({...quizData, title: e.target.value})}
              />
              <textarea 
                placeholder="Add instructions or description for students..."
                className="w-full h-24 bg-navy/5 rounded-[2rem] p-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-medium text-navy/60 text-sm resize-none"
                value={quizData.description}
                onChange={(e) => setQuizData({...quizData, description: e.target.value})}
              />
            </div>
          </Card>

          <div className="space-y-8">
            <AnimatePresence>
              {quizData.questions.map((q, qIdx) => (
                <motion.div
                  key={qIdx}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: qIdx * 0.1 }}
                >
                  <Card className="p-10 space-y-10 bg-white border-white shadow-xl relative group/q border-l-8 border-l-navy hover:border-l-primary transition-all duration-500">
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-navy text-white rounded-2xl flex items-center justify-center font-black italic shadow-2xl group-hover/q:bg-primary transition-colors">
                      {qIdx + 1}
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => removeQuestion(qIdx)}
                      className="absolute top-8 right-8 p-3 text-navy/10 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all opacity-0 group-hover/q:opacity-100"
                    >
                      <Trash2 size={20} />
                    </button>

                    <div className="space-y-10">
                      <div className="flex flex-col md:flex-row gap-8">
                        <div className="flex-1 space-y-1">
                           <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Question Content</label>
                           <input required type="text" placeholder="State the principle of conservation of energy..." className="w-full h-14 bg-navy/5 rounded-2xl px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy text-lg" value={q.question} onChange={(e) => updateQuestion(qIdx, "question", e.target.value)} />
                        </div>
                        <div className="w-full md:w-32 space-y-1">
                           <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Weightage</label>
                           <div className="relative">
                              <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={16} />
                              <input required type="number" className="w-full h-14 bg-navy/5 rounded-2xl pl-12 pr-4 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy" value={q.marks} onChange={(e) => updateQuestion(qIdx, "marks", parseInt(e.target.value))} />
                           </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        {q.options.map((opt, oIdx) => (
                          <div key={oIdx} className="space-y-1 group/opt">
                            <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1 flex justify-between">
                               <span>Option {String.fromCharCode(65 + oIdx)}</span>
                               <button 
                                 type="button" 
                                 onClick={() => updateQuestion(qIdx, "correctAnswer", oIdx)}
                                 className={`text-[9px] uppercase tracking-widest transition-all ${q.correctAnswer === oIdx ? "text-green-500 font-black" : "text-navy/20 hover:text-navy/40"}`}
                               >
                                 {q.correctAnswer === oIdx ? "✓ Correct Choice" : "Mark Correct"}
                               </button>
                            </label>
                            <div className="relative">
                               <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl transition-all ${q.correctAnswer === oIdx ? "bg-green-500" : "bg-transparent group-hover/opt:bg-navy/10"}`} />
                               <input required type="text" placeholder={`Enter option text...`} className={`w-full h-12 bg-navy/5 rounded-2xl px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy text-sm ${q.correctAnswer === oIdx ? "border-green-500/20 bg-green-500/[0.02]" : ""}`} value={opt} onChange={(e) => updateOption(qIdx, oIdx, e.target.value)} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            <button 
              type="button" 
              onClick={addQuestion}
              className="w-full h-24 border-4 border-dashed border-navy/10 rounded-[3rem] text-navy/30 hover:border-primary/20 hover:text-primary hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-2 group"
            >
               <Plus size={32} className="group-hover:rotate-90 transition-transform duration-500" />
               <span className="text-[10px] font-black uppercase tracking-[0.3em]">Integrate Another Question</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
