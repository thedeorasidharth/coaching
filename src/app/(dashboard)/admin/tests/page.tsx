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
  Edit2, 
  BarChart2, 
  Globe, 
  Award, 
  Calendar, 
  X,
  FileCheck,
  AlertTriangle
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminTestsPage() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTestType, setFilterTestType] = useState("All Test Types");
  const [filterExamType, setFilterExamType] = useState("All Exams");
  const [filterTargetClass, setFilterTargetClass] = useState("All Classes");
  const [filterStatus, setFilterStatus] = useState("All Status");

  const [deleteQuiz, setDeleteQuiz] = useState<any | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, [search, filterTestType, filterExamType, filterTargetClass, filterStatus]);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/quizzes", {
        params: {
          search,
          testType: filterTestType,
          examType: filterExamType,
          targetClass: filterTargetClass,
          published: filterStatus === "Published" ? "true" : filterStatus === "Draft" ? "false" : ""
        }
      });
      setQuizzes(res.data);
    } catch (err) {
      console.error("Failed to fetch tests", err);
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

  const handleDeleteConfirm = async () => {
    if (!deleteQuiz) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/quizzes/${deleteQuiz._id}`);
      setQuizzes(prev => prev.filter(q => q._id !== deleteQuiz._id));
      setDeleteQuiz(null);
    } catch (err) {
      alert("Error deleting test");
    } finally {
      setDeleteLoading(false);
    }
  };

  const publishedCount = quizzes.filter(q => q.published).length;
  const draftCount = quizzes.filter(q => !q.published).length;
  const totalQuestionsCount = quizzes.reduce((acc, q) => acc + (q.questions?.length || 0), 0);

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">
            Test <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-navy/60 mt-1">Create, schedule, edit, and analyze NEET/JEE coaching tests.</p>
        </div>
        <Link href="/admin/tests/create">
          <Button className="flex items-center gap-3 h-14 px-8 text-lg font-bold shadow-xl shadow-primary/20">
            <Plus size={24} /> Create New Test
          </Button>
        </Link>
      </div>

      {/* Analytics Overview Badges */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-primary text-white border-none shadow-xl shadow-primary/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10"><Award size={80} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Total Tests</p>
          <h3 className="text-4xl font-black mt-1 italic">{quizzes.length}</h3>
        </Card>
        <Card className="p-6 bg-white border-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-navy"><Globe size={80} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Published Live</p>
          <h3 className="text-4xl font-black mt-1 italic text-navy">{publishedCount}</h3>
        </Card>
        <Card className="p-6 bg-white border-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-navy"><FileCheck size={80} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Draft Status</p>
          <h3 className="text-4xl font-black mt-1 italic text-navy">{draftCount}</h3>
        </Card>
        <Card className="p-6 bg-white border-white shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 text-navy"><HelpCircle size={80} /></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Total Questions</p>
          <h3 className="text-4xl font-black mt-1 italic text-navy">{totalQuestionsCount}</h3>
        </Card>
      </div>

      {/* Search & Filters Bar */}
      <Card className="p-6 bg-white/90 border-white shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
            <input 
              type="text" 
              placeholder="Search tests by title..."
              className="w-full h-12 bg-navy/5 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl pl-12 pr-6 outline-none transition-all text-sm font-bold text-navy"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              className="h-12 bg-navy/5 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 outline-none text-sm font-bold text-navy appearance-none"
              value={filterTestType}
              onChange={(e) => setFilterTestType(e.target.value)}
            >
              <option value="All Test Types">All Test Types</option>
              <option value="Full Test">Full Test</option>
              <option value="Chapter Test">Chapter Test</option>
              <option value="Subject Test">Subject Test</option>
              <option value="Practice Test">Practice Test</option>
            </select>

            <select 
              className="h-12 bg-navy/5 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 outline-none text-sm font-bold text-navy appearance-none"
              value={filterExamType}
              onChange={(e) => setFilterExamType(e.target.value)}
            >
              <option value="All Exams">All Exams</option>
              <option value="NEET">NEET</option>
              <option value="JEE">JEE</option>
              <option value="Foundation">Foundation</option>
            </select>

            <select 
              className="h-12 bg-navy/5 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 outline-none text-sm font-bold text-navy appearance-none"
              value={filterTargetClass}
              onChange={(e) => setFilterTargetClass(e.target.value)}
            >
              <option value="All Classes">All Classes</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
              <option value="Dropper">Dropper</option>
            </select>

            <select 
              className="h-12 bg-navy/5 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-5 outline-none text-sm font-bold text-navy appearance-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All Status">All Status</option>
              <option value="Published">Published</option>
              <option value="Draft">Draft</option>
            </select>

            {(search || filterTestType !== "All Test Types" || filterExamType !== "All Exams" || filterTargetClass !== "All Classes" || filterStatus !== "All Status") && (
              <Button 
                variant="ghost" 
                className="h-12 px-4 rounded-2xl text-navy/40 hover:text-navy"
                onClick={() => {
                  setSearch("");
                  setFilterTestType("All Test Types");
                  setFilterExamType("All Exams");
                  setFilterTargetClass("All Classes");
                  setFilterStatus("All Status");
                }}
              >
                <X size={18} /> Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-20 text-navy/40 font-black italic">Loading Test Series database...</p>
        ) : quizzes.length === 0 ? (
          <p className="col-span-full text-center py-20 text-navy/40 font-black italic">No tests found matching your criteria.</p>
        ) : quizzes.map((quiz, i) => (
          <motion.div
            key={quiz._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="p-8 group hover:border-primary/20 transition-all border-white relative overflow-hidden h-full flex flex-col shadow-xl">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-navy/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-500">
                  <BookOpen size={28} />
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleTogglePublish(quiz._id)}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                      quiz.published 
                        ? "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white" 
                        : "bg-navy/5 text-navy/40 hover:bg-navy hover:text-white"
                    }`}
                  >
                    {quiz.published ? "Published" : "Draft"}
                  </button>
                  <button 
                    onClick={() => setDeleteQuiz(quiz)} 
                    title="Delete Test"
                    className="w-9 h-9 rounded-xl bg-navy/5 text-navy/30 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="px-3 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                    {quiz.examType || 'JEE'}
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-navy/5 text-navy/60 text-[10px] font-black uppercase tracking-wider">
                    {quiz.testType || 'Full Test'}
                  </span>
                  <span className="px-3 py-0.5 rounded-full bg-navy/5 text-navy/60 text-[10px] font-black uppercase tracking-wider">
                    {quiz.targetClass || quiz.class}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-navy leading-tight mb-4 group-hover:text-primary transition-colors">
                  {quiz.title}
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4 my-2 border-y border-navy/5 text-xs text-navy/60 font-bold">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" /> {quiz.duration} Mins
                  </div>
                  <div className="flex items-center gap-2">
                    <HelpCircle size={16} className="text-primary" /> {quiz.questions?.length || quiz.totalQuestions || 0} Qs
                  </div>
                  <div className="flex items-center gap-2">
                    <Award size={16} className="text-primary" /> {quiz.totalMarks || 0} Marks
                  </div>
                </div>

                {(quiz.startDate || quiz.endDate) && (
                  <div className="text-[11px] font-bold text-navy/40 space-y-1 mt-3">
                    {quiz.startDate && (
                      <p className="flex items-center gap-1.5"><Calendar size={12} className="text-green-500" /> Start: {new Date(quiz.startDate).toLocaleString()}</p>
                    )}
                    {quiz.endDate && (
                      <p className="flex items-center gap-1.5"><Calendar size={12} className="text-red-500" /> End: {new Date(quiz.endDate).toLocaleString()}</p>
                    )}
                  </div>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-navy/5 flex items-center gap-4">
                <Link href={`/admin/tests/edit/${quiz._id}`} className="flex-1">
                  <Button variant="outline" className="w-full gap-2 border-navy/10 hover:border-primary/20">
                    <Edit2 size={16} /> Edit Test
                  </Button>
                </Link>
                <Link href={`/admin/tests/${quiz._id}`} className="flex-1">
                  <Button className="w-full gap-2">
                    <BarChart2 size={16} /> Analytics
                  </Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteQuiz && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteQuiz(null)} className="absolute inset-0 bg-navy/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>

              <div>
                <h3 className="font-bold text-navy text-2xl">Delete Assessment?</h3>
                <p className="text-navy/60 text-sm mt-2">
                  Are you sure you want to delete <span className="font-bold text-navy">{deleteQuiz.title}</span>? All student submission records for this test will be removed.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setDeleteQuiz(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteConfirm} disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Delete Test"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
