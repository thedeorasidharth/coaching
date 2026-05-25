"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Calendar, 
  ChevronRight,
  Clock,
  Target,
  BarChart,
  ArrowLeft,
  Search
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function StudentResultsPage() {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const res = await api.get("/results/student");
      setResults(res.data);
    } catch (err) {
      console.error("Failed to fetch results", err);
    } finally {
      setLoading(false);
    }
  };

  const calculateGlobalAverage = () => {
    if (results.length === 0) return 0;
    return (results.reduce((acc, r) => acc + r.percentage, 0) / results.length).toFixed(1);
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight uppercase tracking-tighter">
            Academic <span className="text-primary italic">Analytics</span>
          </h1>
          <p className="text-navy/40 mt-1 uppercase text-[10px] font-black tracking-widest italic">Review your trajectory towards excellence.</p>
        </div>
        <div className="flex gap-4">
           <Card className="px-6 py-3 bg-white border-white shadow-xl flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center"><TrendingUp size={20} /></div>
              <div>
                <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest">Average Accuracy</p>
                <p className="text-xl font-black text-navy italic">{calculateGlobalAverage()}%</p>
              </div>
           </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          <p className="col-span-full text-center py-20 text-navy/40 font-black italic">Analyzing performance records...</p>
        ) : results.length === 0 ? (
          <div className="col-span-full py-20 text-center space-y-6">
             <div className="w-20 h-20 bg-navy/5 rounded-full flex items-center justify-center mx-auto text-navy/20"><BarChart size={40} /></div>
             <p className="text-navy/40 font-black italic">No assessment history found. Start your first test to see analytics.</p>
             <Link href="/student/tests">
                <Button className="h-14 px-8">Browse Assessments</Button>
             </Link>
          </div>
        ) : results.map((result, i) => (
          <motion.div
            key={result._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="p-8 space-y-8 hover:shadow-2xl transition-all border-white group relative overflow-hidden h-full flex flex-col">
              <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity">
                 <ArrowLeft className="rotate-180 text-primary" size={24} />
              </div>

              <div className="flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-colors duration-500 ${result.percentage >= 75 ? "bg-green-500 text-white" : result.percentage >= 40 ? "bg-primary text-white" : "bg-red-500 text-white"}`}>
                  <Award size={28} />
                </div>
                <div className="text-right">
                   <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest flex items-center justify-end gap-1">
                      <Calendar size={12} /> {new Date(result.submittedAt).toLocaleDateString()}
                   </p>
                   <p className="text-[9px] font-black text-primary uppercase tracking-widest mt-1">{result.quizId?.subject}</p>
                </div>
              </div>

              <div className="flex-1">
                <h3 className="text-2xl font-bold text-navy leading-tight mb-6 group-hover:text-primary transition-colors">{result.quizId?.title}</h3>
                
                <div className="space-y-4">
                   <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Efficiency Level</p>
                      <p className="text-sm font-black text-navy italic">{result.score} / {result.quizId?.totalMarks} Points</p>
                   </div>
                   <div className="w-full h-2 bg-navy/5 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full rounded-full ${result.percentage >= 75 ? "bg-green-500" : result.percentage >= 40 ? "bg-primary" : "bg-red-500"}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${result.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                   </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-8 border-t border-navy/5">
                 <div className="bg-navy/5 p-4 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest mb-1">Time Taken</p>
                    <p className="text-lg font-black text-navy flex items-center justify-center gap-1"><Clock size={16} className="text-primary" /> {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</p>
                 </div>
                 <div className="bg-navy/5 p-4 rounded-2xl text-center">
                    <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest mb-1">Score Result</p>
                    <p className="text-2xl font-black text-primary italic leading-none">{Math.round(result.percentage)}%</p>
                 </div>
              </div>

              <Button variant="outline" className="w-full h-12 rounded-xl mt-6 border-navy/5 hover:border-primary/20 gap-2">
                 Detailed Review <Search size={16} />
              </Button>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
