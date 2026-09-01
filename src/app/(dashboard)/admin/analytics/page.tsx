"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award, 
  Activity, 
  BarChart3, 
  Target, 
  AlertTriangle, 
  Filter,
  User,
  CheckCircle,
  ExternalLink
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function AdminAnalyticsPage() {
  const router = useRouter();
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
        setSubjectData(subRes.data.map((s: any) => ({ name: s._id || "General", value: Math.round(s.avgPercentage) })));
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

  const COLORS = ["#8B0E2A", "#C9A86A", "#1F2A44", "#2E7D32"];

  if (loading) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-display text-xl font-black text-navy italic">Generating Global Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-navy leading-tight">
            Intelligence <span className="text-primary italic">Command Center</span>
          </h1>
          <p className="text-navy/60 mt-1 text-xs sm:text-sm font-bold">Institutional Performance Analytics & Real-Time Student Metrics</p>
        </div>
        <div className="flex gap-3">
           <Button variant="outline" className="h-11 px-4 gap-2 text-xs">
              <Filter size={16} /> Advanced Filters
           </Button>
           <Button variant="navy" className="h-11 px-5 gap-2 text-xs">
              Download Audit Report
           </Button>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         {[
           { label: "Global Population", value: overview?.totalStudents || 0, sub: "Total Enrolled Students", icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
           { label: "Institutional Accuracy", value: `${Math.round(overview?.avgMarks || 0)}%`, sub: "Average Performance", icon: Target, color: "text-emerald-600", bg: "bg-emerald-500/10" },
           { label: "Highest Milestone", value: overview?.highestScore || 0, sub: "Max Score Recorded", icon: Award, color: "text-amber-600", bg: "bg-amber-500/10" },
           { label: "Active Proctored Today", value: overview?.activeToday || 0, sub: "Live Attempts Today", icon: Activity, color: "text-primary", bg: "bg-primary/10" },
         ].map((stat, i) => (
           <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
             <Card className="p-6 bg-white border-white shadow-xl hover:shadow-2xl hover:border-primary/20 transition-all relative overflow-hidden group">
               <div className={`absolute -top-3 -right-3 w-20 h-20 ${stat.bg} ${stat.color} rounded-full opacity-30 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center`}>
                  <stat.icon size={36} />
               </div>
               <p className="text-xs font-bold text-navy/60 uppercase tracking-wider">{stat.label}</p>
               <h3 className="text-3xl font-black text-navy italic mt-1">{stat.value}</h3>
               <p className="text-xs font-bold text-navy/50 mt-1">{stat.sub}</p>
             </Card>
           </motion.div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Chart: Performance Trajectory */}
         <Card className="lg:col-span-2 p-6 sm:p-8 bg-white border-white shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-xl sm:text-2xl text-navy">Performance <span className="text-primary italic">Trajectory</span></h3>
               <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl font-bold text-xs">
                  <TrendingUp size={16} /> 30-Day Activity
               </div>
            </div>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                     <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#8B0E2A" stopOpacity={0.2}/>
                           <stop offset="95%" stopColor="#8B0E2A" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                     <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#1F2A44' }} />
                     <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#1F2A44' }} domain={[0, 100]} />
                     <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '16px', backgroundColor: '#1F2A44', color: '#fff' }}
                        itemStyle={{ fontWeight: 800, color: '#C9A86A' }}
                     />
                     <Area type="monotone" dataKey="score" stroke="#8B0E2A" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </Card>

         {/* Pie Chart: Subject Distribution */}
         <Card className="p-6 sm:p-8 bg-white border-white shadow-xl flex flex-col justify-between">
            <h3 className="font-bold text-xl sm:text-2xl text-navy mb-6">Subject <span className="text-primary italic">Efficiency</span></h3>
            <div className="h-[240px] w-full flex-1">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={subjectData}
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={8}
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
            <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-navy/5">
               {subjectData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5">
                     <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                     <div>
                        <p className="text-xs font-bold text-navy">{item.name}</p>
                        <p className="text-xs font-black text-primary">{item.value}%</p>
                     </div>
                  </div>
               ))}
            </div>
         </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Leaderboard */}
         <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy">Elite <span className="text-primary italic">Achievers</span></h2>
            <Card className="p-0 overflow-hidden bg-white border-white shadow-xl">
               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                    <thead className="bg-navy text-white">
                       <tr>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Rank</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Candidate</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Accuracy</th>
                          <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider">Attempts</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-navy/5">
                       {leaderboard.map((item, i) => (
                          <tr key={i} className="hover:bg-navy/5 transition-colors group">
                             <td className="px-6 py-4">
                                <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                                  i === 0 ? "bg-amber-400 text-navy shadow-md" : 
                                  i === 1 ? "bg-slate-300 text-navy shadow-md" : 
                                  i === 2 ? "bg-amber-700 text-white shadow-md" : 
                                  "bg-navy/5 text-navy/60 font-bold"
                                }`}>
                                   {i + 1}
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-xl bg-navy/5 overflow-hidden flex items-center justify-center shrink-0">
                                      {item.student?.profileImage ? (
                                         <img src={item.student.profileImage} className="w-full h-full object-cover" alt={item.student.fullName} />
                                      ) : <User className="text-navy/30" size={18} />}
                                   </div>
                                   <div>
                                      {item.student?._id ? (
                                        <Link href={`/admin/students/${item.student._id}`} className="font-bold text-navy hover:text-primary transition-colors flex items-center gap-1">
                                          <span>{item.student.fullName}</span>
                                          <ExternalLink size={12} className="opacity-40" />
                                        </Link>
                                      ) : (
                                        <p className="font-bold text-navy">{item.student?.fullName || "Student"}</p>
                                      )}
                                      <p className="text-[10px] text-navy/60 font-bold">{item.student?.class || "Class N/A"}</p>
                                   </div>
                                </div>
                             </td>
                             <td className="px-6 py-4">
                                <span className="text-base font-black text-primary">{Math.round(item.avgPercentage)}%</span>
                             </td>
                             <td className="px-6 py-4 text-xs font-bold text-navy/60">
                                {item.totalTests} Tests
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
               </div>
            </Card>
         </div>

         {/* Weak Students / Critical Attention */}
         <div className="space-y-4">
            <h2 className="text-2xl font-bold text-navy">Critical <span className="text-red-600 italic">Attention</span> Required</h2>
            <div className="grid gap-4">
               {weakStudents.length === 0 ? (
                  <Card className="p-8 text-center space-y-3 bg-white border-dashed border-2 border-navy/10 shadow-xl">
                     <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-2xl flex items-center justify-center mx-auto">
                        <CheckCircle size={24} />
                     </div>
                     <p className="text-navy font-bold text-sm">Excellent! All students are performing above critical thresholds.</p>
                  </Card>
               ) : weakStudents.map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                     <Card className="p-5 bg-white border-white shadow-xl hover:border-red-500/20 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                              <AlertTriangle size={22} />
                           </div>
                           <div>
                              <h4 className="font-bold text-navy text-base">{item.student?.fullName || "Student"}</h4>
                              <p className="text-xs font-bold text-navy/60">
                                Average: <span className="text-red-600 font-black">{Math.round(item.avgPercentage)}%</span> • {item.totalTests} Tests
                              </p>
                           </div>
                        </div>

                        {item.student?._id ? (
                          <Link href={`/admin/students/${item.student._id}`}>
                            <Button 
                              type="button" 
                              variant="destructive" 
                              size="sm" 
                              className="h-9 px-4 text-xs font-bold shrink-0"
                            >
                               View Profile
                            </Button>
                          </Link>
                        ) : (
                          <Button 
                            type="button" 
                            disabled 
                            variant="outline" 
                            size="sm" 
                            className="h-9 px-4 text-xs font-bold"
                          >
                             Profile Unavailable
                          </Button>
                        )}
                     </Card>
                  </motion.div>
               ))}
            </div>

            {/* Subject Risk Card */}
            <Card className="p-6 sm:p-8 bg-navy text-white border-none shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-10"><BarChart3 size={90} /></div>
               <h4 className="text-xl font-bold text-white mb-2">Subject-wise Risk Analysis</h4>
               <p className="text-xs font-medium text-white/80 mb-6 leading-relaxed">
                  System performance metrics identify Chemistry as the primary subject requiring additional targeted practice.
               </p>
               <Button 
                  onClick={() => router.push("/admin/tests")} 
                  className="w-full bg-white text-navy hover:bg-white/90 font-bold text-xs h-11 rounded-xl"
               >
                  Manage Test Series Records
               </Button>
            </Card>
         </div>
      </div>
    </div>
  );
}
