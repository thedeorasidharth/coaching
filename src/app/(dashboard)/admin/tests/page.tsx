"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Clock, 
  HelpCircle, 
  Trash2, 
  Eye, 
  BarChart2, 
  Globe, 
  Lock,
  ChevronRight,
  TrendingUp,
  Award
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminTestsPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const res = await api.get("/quizzes");
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch quizzes", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      await api.patch(`/quizzes/${id}/publish`, {});
      fetchQuizzes();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this test?")) {
      try {
        await api.delete(`/quizzes/${id}`);
        fetchQuizzes();
      } catch (err) {
        alert("Error deleting test");
      }
    }
  };

  const filteredQuizzes = quizzes.filter(q => q.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">
            Assessments <span className="text-primary italic">& Quizzes</span>
          </h1>
          <p className="text-navy/60 mt-1 uppercase text-[10px] font-black tracking-widest">Build, publish, and analyze student performance.</p>
        </div>
        <Link href="/admin/tests/create">
          <Button className="flex items-center gap-3 h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20">
            <Plus size={24} /> Create New Quiz
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
         <Card className="p-6 bg-primary text-white border-none shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Award size={80} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Assessments</p>
            <h3 className="text-4xl font-black mt-1 italic">{quizzes.length}</h3>
         </Card>
         <Card className="p-6 bg-white border-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-navy"><Globe size={80} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Published Live</p>
            <h3 className="text-4xl font-black mt-1 italic text-navy">{quizzes.filter(q => q.published).length}</h3>
         </Card>
         <Card className="p-6 bg-white border-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 text-navy"><TrendingUp size={80} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Average Accuracy</p>
            <h3 className="text-4xl font-black mt-1 italic text-navy">78%</h3>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-20 text-navy/40 font-black italic">Retrieving Question Bank...</p>
        ) : filteredQuizzes.length === 0 ? (
          <p className="col-span-full text-center py-20 text-navy/40 font-black italic">No assessments created yet.</p>
        ) : filteredQuizzes.map((quiz, i) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 group hover:border-primary/20 transition-all border-white relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-8 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(quiz._id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <BookOpen size={28} />
                </div>
                <button 
                  onClick={() => handleTogglePublish(quiz._id)}
                  className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                    quiz.published 
                      ? "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white" 
                      : "bg-navy/5 text-navy/30 hover:bg-navy hover:text-white"
                  }`}
                >
                  {quiz.published ? "Live / Published" : "Private / Draft"}
                </button>
              </div>

              <div className="flex-1">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">{quiz.subject} • {quiz.class}</p>
                <h3 className="text-2xl font-bold text-navy leading-tight mb-4 group-hover:text-primary transition-colors">{quiz.title}</h3>
                
                <div className="flex items-center gap-6 text-xs text-navy/40 font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-2"><Clock size={16} className="text-primary/40" /> {quiz.duration} Mins</div>
                  <div className="flex items-center gap-2"><HelpCircle size={16} className="text-primary/40" /> {quiz.questions.length} Questions</div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-navy/5 flex items-center gap-4">
                <Link href={`/admin/tests/${quiz._id}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2 border-navy/5 group-hover:border-primary/20">
                    <BarChart2 size={18} /> Analytics
                  </Button>
                </Link>
                <Link href={`/admin/tests/edit/${quiz._id}`} className="flex-1">
                   <Button className="w-full gap-2">
                     Edit Build <ChevronRight size={18} />
                   </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
