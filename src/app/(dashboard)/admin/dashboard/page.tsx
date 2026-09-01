"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, FileText, Bell, TrendingUp, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [analyticsRes, studentsRes, noticesRes] = await Promise.all([
          api.get("/analytics/overview"),
          api.get("/students"),
          api.get("/notices")
        ]);
        
        setAnalytics({
          totalStudents: analyticsRes.data.totalStudents,
          totalQuizzes: analyticsRes.data.totalTests,
          totalNotices: noticesRes.data.length,
          performance: analyticsRes.data.avgMarks.toFixed(1)
        });
        
        setRecentStudents(studentsRes.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  const stats = [
    { name: "Total Students", value: analytics?.totalStudents || "0", icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { name: "Quizzes Created", value: analytics?.totalQuizzes || "0", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "Active Notices", value: analytics?.totalNotices || "0", icon: Bell, color: "text-orange-500", bg: "bg-orange-500/10" },
    { name: "Avg Score", value: `${analytics?.performance || 0}%`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" }
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">
            Admin <span className="text-primary italic">Dashboard</span>
          </h1>
          <p className="text-navy/60 mt-1">Manage your institute and students from one place.</p>
        </div>
        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-xl border-2 border-primary/5">
          <TrendingUp className="text-primary" size={20} />
          <span className="text-sm font-bold text-navy">Avg Performance: <span className="text-primary">{analytics?.performance || 0}%</span></span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [1, 2, 3, 4].map(i => <div key={i} className="h-32 rounded-3xl bg-white animate-pulse shadow-sm" />)
        ) : (
          stats.map((stat, i) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-6 h-full flex flex-col items-center text-center group">
                <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <stat.icon size={28} />
                </div>
                <h3 className="text-3xl font-black text-navy mb-1">{stat.value}</h3>
                <p className="text-xs font-bold text-navy/40 uppercase tracking-widest">{stat.name}</p>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-2xl font-black text-navy">Recent Students</h2>
          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-navy/5">
                  <tr>
                    <th className="px-6 py-4 text-xs font-black text-navy/40 uppercase tracking-widest">Name</th>
                    <th className="px-6 py-4 text-xs font-black text-navy/40 uppercase tracking-widest">Mobile Number</th>
                    <th className="px-6 py-4 text-xs font-black text-navy/40 uppercase tracking-widest">Course / Class</th>
                    <th className="px-6 py-4 text-xs font-black text-navy/40 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy/5">
                  {loading ? (
                    [1, 2, 3].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-6 py-4 bg-navy/2 h-12" />
                      </tr>
                    ))
                  ) : recentStudents.length > 0 ? (
                    recentStudents.map((student) => (
                      <tr key={student._id} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                              {student.fullName ? student.fullName[0].toUpperCase() : 'S'}
                            </div>
                            <span className="font-bold text-navy">{student.fullName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium text-navy/60">{student.phone}</td>
                        <td className="px-6 py-4 font-medium text-navy/60">{student.course || 'JEE'} • {student.class}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${student.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-navy/40 font-medium italic">No students registered yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-black text-navy">Quick Actions</h2>
          <div className="grid gap-4">
            <Link href="/admin/students/add">
              <Button variant="outline" className="w-full h-16 justify-start gap-4 px-6 border-navy/5 bg-white hover:bg-primary hover:text-white transition-all">
                <Users size={20} /> Add New Student
              </Button>
            </Link>
            <Link href="/admin/tests">
              <Button variant="outline" className="w-full h-16 justify-start gap-4 px-6 border-navy/5 bg-white hover:bg-primary hover:text-white transition-all">
                <BookOpen size={20} /> Create New Quiz
              </Button>
            </Link>
            <Link href="/admin/notices">
              <Button variant="outline" className="w-full h-16 justify-start gap-4 px-6 border-navy/5 bg-white hover:bg-primary hover:text-white transition-all">
                <Bell size={20} /> Post New Notice
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
