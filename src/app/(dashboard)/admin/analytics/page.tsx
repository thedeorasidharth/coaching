"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Activity, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Target, 
  AlertTriangle, 
  Calendar,
  Filter,
  User,
  Medal,
  Clock
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from "recharts";

export default function AdminAnalyticsPage() {
  const [overview, setOverview] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [weakStudents, setWeakStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ovRes, lbRes, subRes, trRes, wkRes] = await Promise.all([
          api.get("/analytics/overview"),
          api.get("/analytics/leaderboard"),
          api.get("/analytics/subjects"),
          api.get("/analytics/trend"),
          api.get("/analytics/weak-students")
        ]);
        setOverview(ovRes.data);
        setLeaderboard(lbRes.data);
        setSubjectData(subRes.data.map((s: any) => ({ name: s._id, value: Math.round(s.avgPercentage) })));
        setTrendData(trRes.data.map((t: any) => ({ name: t._id, score: Math.round(t.avgPercentage) })));
        setWeakStudents(wkRes.data);
      } catch (err) {
         console.error("Error fetching analytics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#8B0E2A", "#C9A86A", "#1F2A44", "#F6F0E8"];

  if (loading) return <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
    <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    <p className="font-display text-xl font-black text-navy italic">Generating Global Intelligence...</p>
  </div>;

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight uppercase tracking-tighter italic">
            Intelligence <span className="text-primary italic">Command Center</span>
          </h1>
          <p className="text-navy/40 mt-1 uppercase text-[10px] font-black tracking-widest italic tracking-[0.3em]">Institutional Performance Analytics • Real-time Data</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline" className="h-12 gap-2 border-navy/10 bg-white hover:bg-navy hover:text-white transition-all rounded-xl">
              <Filter size={18} /> Advanced Filters
           </Button>
           <Button className="h-12 px-6 gap-2 bg-navy text-white font-black uppercase text-[10px] tracking-[0.2em] rounded-xl shadow-xl shadow-navy/20">
              Download Audit Report
           </Button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Global Population", value: overview?.totalStudents, sub: "Total Students", icon: Users, color: "text-blue-500", bg: "bg-blue-500/5" },
           { label: "Institutional Accuracy", value: `${Math.round(overview?.avgMarks)}%`, sub: "Avg Performance", icon: Target, color: "text-emerald-500", bg: "bg-emerald-500/5" },
           { label: "Highest Milestone", value: overview?.highestScore, sub: "Max Score Recorded", icon: Award, color: "text-yellow-600", bg: "bg-yellow-600/5" },
           { label: "Active Proctored Today", value: overview?.activeToday, sub: "Live Attempts", icon: Activity, color: "text-primary", bg: "bg-primary/5" },
         ].map((stat, i) => (
           <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
             <Card className="p-8 space-y-4 bg-white border-white shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all relative overflow-hidden group">
               <div className={`absolute -top-4 -right-4 w-24 h-24 ${stat.bg} ${stat.color} rounded-full opacity-20 group-hover:scale-110 transition-transform duration-700 flex items-center justify-center`}>
                  <stat.icon size={48} />
               </div>
               <p className="text-[10px] font-black text-navy/30 uppercase tracking-[0.2em]">{stat.label}</p>
               <h3 className="text-4xl font-black text-navy italic">{stat.value}</h3>
               <p className="text-[10px] font-bold text-navy/40 italic">{stat.sub}</p>
             </Card>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Main Chart: Performance Trend */}
         <Card className="lg:col-span-2 p-10 bg-white border-white shadow-2xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-10">
               <h3 className="font-black text-2xl text-navy italic uppercase tracking-tighter">Performance <span className="text-primary italic">Trajectory</span></h3>
               <div className="flex items-center gap-2 px-4 py-2 bg-primary/5 text-primary rounded-xl font-bold text-[10px] uppercase tracking-widest">
                  <TrendingUp size={16} /> 30-Day Activity
               </div>
            </div>
            <div className="h-[400px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                     <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#8B0E2A" stopOpacity={0.1}/>
                           <stop offset="95%" stopColor="#8B0E2A" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#8B0E2A40' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#8B0E2A40' }} domain={[0, 100]} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '20px' }}
                        itemStyle={{ fontWeight: 800, color: '#8B0E2A' }}
                     />
                     <Area type="monotone" dataKey="score" stroke="#8B0E2A" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Pie Chart: Subject Distribution */}
         <Card className="p-10 bg-white border-white shadow-2xl flex flex-col">
            <h3 className="font-black text-2xl text-navy italic uppercase tracking-tighter mb-10">Subject <span className="text-primary italic">Efficiency</span></h3>
            <div className="h-[300px] w-full flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={subjectData}
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={10}
                        dataKey="value"
                        stroke="none"
                     >
                        {subjectData.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-10">
               {subjectData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                     <div>
                        <p className="text-[9px] font-black text-navy/30 uppercase">{item.name}</p>
                        <p className="text-sm font-bold text-navy">{item.value}%</p>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Leaderboard */}
         <div className="space-y-8">
            <h2 className="text-2xl font-black text-navy italic uppercase tracking-tighter">Elite <span className="text-primary italic">Achievers</span></h2>
            <Card className="p-0 overflow-hidden bg-white/80 border-white shadow-2xl">
               <table className="w-full text-left border-collapse">
                  <thead className="bg-navy text-white/40">
                     <tr>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Rank</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Candidate</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Accuracy</th>
                        <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Records</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-navy/5">
                     {leaderboard.map((item, i) => (
                        <tr key={i} className="hover:bg-primary/5 transition-colors group">
                           <td className="px-8 py-6">
                              <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic ${i === 0 ? "bg-yellow-400 text-white shadow-lg shadow-yellow-400/20" : i === 1 ? "bg-slate-300 text-white shadow-lg" : i === 2 ? "bg-orange-400 text-white shadow-lg" : "bg-navy/5 text-navy/30"}`}>
                                 {i + 1}
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-navy/5 overflow-hidden flex items-center justify-center">
                                    {item.student?.profileImage ? (
                                       <img src={item.student.profileImage} className="w-full h-full object-cover" />
                                    ) : <User className="text-navy/10" />}
                                 </div>
                                 <div>
                                    <p className="font-bold text-navy leading-none mb-1">{item.student?.fullName}</p>
                                    <p className="text-[9px] text-navy/30 font-black uppercase tracking-widest">{item.student?.class}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6">
                              <span className="text-lg font-black text-primary italic">{Math.round(item.avgPercentage)}%</span>
                           </td>
                           <td className="px-8 py-6 text-sm font-bold text-navy/30 italic">
                              {item.totalTests} Attempts
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </Card>
         </div>

         {/* Weak Students / Critical Attention */}
         <div className="space-y-8">
            <h2 className="text-2xl font-black text-navy italic uppercase tracking-tighter">Critical <span className="text-red-500 italic">Attention</span> Required</h2>
            <div className="grid gap-6">
               {weakStudents.length === 0 ? (
                  <Card className="p-10 text-center space-y-4 border-dashed border-2 border-navy/10">
                     <div className="w-16 h-16 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto"><CheckCircle className="w-8 h-8" /></div>
                     <p className="text-navy/40 font-black italic">Excellent! All students are performing above critical thresholds.</p>
                  </Card>
               ) : weakStudents.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                     <Card className="p-6 bg-white border-white shadow-xl hover:border-red-500/20 transition-all flex items-center justify-between group">
                        <div className="flex items-center gap-6">
                           <div className="w-14 h-14 rounded-2xl bg-red-500/5 text-red-500 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                              <AlertTriangle size={24} />
                           </div>
                           <div>
                              <h4 className="font-bold text-navy text-lg leading-none mb-1">{item.student?.fullName}</h4>
                              <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Average: <span className="text-red-500">{Math.round(item.avgPercentage)}%</span> • {item.totalTests} Tests</p>
                           </div>
                        </div>
                        <Button variant="outline" className="h-10 px-4 text-[10px] font-black uppercase tracking-widest border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all rounded-xl">
                           View Profile
                        </Button>
                     </Card>
                  </motion.div>
               ))}
            </div>

            <Card className="p-8 bg-navy text-white border-none shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10"><BarChart3 size={100} /></div>
               <h4 className="text-xl font-black italic mb-2">Subject-wise Risk Analysis</h4>
               <p className="text-xs font-medium opacity-60 mb-6 leading-relaxed">System has detected Chemistry as the weakest subject across critical student population.</p>
               <Button className="w-full bg-white text-navy font-black uppercase text-[10px] tracking-[0.2em] h-12 rounded-xl">
                  Analyze Chemistry Records
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}

import { CheckCircle } from "lucide-react";
