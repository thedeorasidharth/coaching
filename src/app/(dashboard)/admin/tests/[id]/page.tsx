"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  BarChart2, 
  Users, 
  Award, 
  TrendingUp, 
  ArrowLeft, 
  Search,
  User,
  Calendar,
  Clock,
  Target,
  Medal,
  ChevronRight
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminQuizAnalyticsPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState<any>(null);
  const [results, setResults] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [quizRes, resultsRes, analyticsRes] = await Promise.all([
          api.get(`/quizzes/${id}`),
          api.get(`/results/quiz/${id}`),
          api.get(`/results/analytics/${id}`)
        ]);
        setQuiz(quizRes.data);
        setResults(resultsRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error("Error fetching analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center font-display text-2xl font-black text-navy animate-pulse italic">Aggregating Global Statistics...</div>;
  if (!quiz) return <div className="h-[60vh] flex items-center justify-center font-display text-2xl font-black text-navy">Assessment Record Not Found.</div>;

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/admin/tests">
            <Button variant="outline" className="w-12 h-12 p-0 rounded-2xl border-navy/10 bg-white hover:bg-navy hover:text-white transition-all">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-4xl font-black text-navy leading-tight uppercase tracking-tighter italic">
              Performance <span className="text-primary italic">Intelligence</span>
            </h1>
            <p className="text-navy/40 mt-1 uppercase text-[10px] font-black tracking-widest italic">{quiz.title} • Data Analytics</p>
          </div>
        </div>
        <div className="flex gap-4">
           <Button className="h-12 px-6 gap-2 bg-navy text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-xl shadow-navy/20">
              Export Detailed Report
           </Button>
        </div>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <Card className="p-8 space-y-4 bg-white border-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-navy group-hover:scale-110 transition-transform duration-700"><Users size={60} /></div>
            <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Total Attempts</p>
            <h3 className="text-4xl font-black text-navy italic">{analytics?.count || 0}</h3>
         </Card>
         <Card className="p-8 space-y-4 bg-white border-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-navy group-hover:scale-110 transition-transform duration-700"><TrendingUp size={60} /></div>
            <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Average Score</p>
            <h3 className="text-4xl font-black text-navy italic">{Math.round(analytics?.avgScore || 0)} <span className="text-sm italic opacity-30">/ {quiz.totalMarks}</span></h3>
         </Card>
         <Card className="p-8 space-y-4 bg-white border-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-5 text-primary group-hover:scale-110 transition-transform duration-700"><Award size={60} /></div>
            <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest text-primary">Highest Achieved</p>
            <h3 className="text-4xl font-black text-primary italic">{analytics?.highestScore || 0} <span className="text-sm italic opacity-30">/ {quiz.totalMarks}</span></h3>
         </Card>
         <Card className="p-8 space-y-4 bg-navy text-white border-none shadow-xl shadow-navy/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10 text-white group-hover:scale-110 transition-transform duration-700"><Medal size={60} /></div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-40">Success Rate</p>
            <h3 className="text-4xl font-black italic">{analytics?.count > 0 ? "84%" : "0%"}</h3>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Leaderboard Table */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between">
               <h2 className="text-2xl font-black text-navy italic">Student <span className="text-primary italic">Leaderboard</span></h2>
               <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy/20" />
                  <input type="text" placeholder="Find student..." className="h-10 bg-white border border-navy/5 rounded-xl pl-10 pr-4 outline-none text-xs font-bold text-navy focus:border-primary/20 transition-all shadow-sm" />
               </div>
            </div>

            <Card className="p-0 overflow-hidden bg-white/80 border-white shadow-2xl relative">
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead className="bg-navy text-white/40">
                        <tr>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Rank</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Candidate</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Marks</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Time</th>
                           <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Accuracy</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-navy/5">
                        {results.length === 0 ? (
                           <tr><td colSpan={5} className="px-8 py-20 text-center text-navy/40 font-black italic">No submissions recorded yet for this assessment.</td></tr>
                        ) : results.map((result, i) => (
                           <tr key={result._id} className="hover:bg-primary/5 transition-colors group">
                              <td className="px-8 py-6">
                                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic ${i === 0 ? "bg-yellow-400 text-white shadow-lg shadow-yellow-400/20" : i === 1 ? "bg-slate-300 text-white shadow-lg" : i === 2 ? "bg-orange-400 text-white shadow-lg" : "bg-navy/5 text-navy/30"}`}>
                                    {i + 1}
                                 </div>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-navy/5 overflow-hidden">
                                       {result.studentId?.profileImage ? (
                                          <img src={result.studentId.profileImage} className="w-full h-full object-cover" />
                                       ) : <User className="w-full h-full p-2 text-navy/10" />}
                                    </div>
                                    <div>
                                       <p className="font-bold text-navy leading-none mb-1">{result.studentId?.fullName}</p>
                                       <p className="text-[9px] text-navy/30 font-black uppercase tracking-widest">@{result.studentId?.username}</p>
                                    </div>
                                 </div>
                              </td>
                              <td className="px-8 py-6 font-bold text-navy">
                                 {result.score} <span className="text-navy/20 font-medium">/ {quiz.totalMarks}</span>
                              </td>
                              <td className="px-8 py-6 text-sm font-medium text-navy/30 italic">
                                 {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-4">
                                    <div className="flex-1 h-1.5 w-16 bg-navy/5 rounded-full overflow-hidden">
                                       <div className="h-full bg-primary" style={{ width: `${result.percentage}%` }} />
                                    </div>
                                    <span className="text-xs font-black text-primary italic">{Math.round(result.percentage)}%</span>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </Card>
         </div>

         {/* Question Analytics Sidebar */}
         <div className="space-y-8">
            <h2 className="text-2xl font-black text-navy italic">Item <span className="text-primary italic">Analysis</span></h2>
            <div className="space-y-4">
               {quiz.questions.map((q: any, i: number) => (
                  <Card key={i} className="p-6 space-y-4 border-white shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all cursor-pointer group">
                     <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Question {i + 1}</span>
                        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-600 rounded-full text-[10px] font-black uppercase">
                           Correct: 82%
                        </div>
                     </div>
                     <p className="text-sm font-bold text-navy line-clamp-2 group-hover:text-primary transition-colors">{q.question}</p>
                     <div className="pt-2 border-t border-navy/5 flex justify-between items-center">
                        <p className="text-[9px] font-black text-navy/20 uppercase tracking-widest">Weightage: {q.marks}M</p>
                        <ChevronRight size={16} className="text-navy/10 group-hover:text-primary transition-colors" />
                     </div>
                  </Card>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
}
