"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Phone, 
  Calendar, 
  Award, 
  Clock, 
  BookOpen, 
  Shield, 
  User,
  Users,
  Activity,
  Edit2,
  Lock,
  Trash2,
  GraduationCap,
  AlertTriangle,
  FileCheck
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [studentResults, setStudentResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!id) return;
      setLoading(true);
      setError(false);
      try {
        const [studentRes, resultsRes] = await Promise.all([
          api.get(`/students/${id}`),
          api.get("/results").catch(() => ({ data: [] }))
        ]);

        setStudent(studentRes.data);

        // Filter results belonging to this student
        const allResults = resultsRes.data || [];
        const studentSpecific = allResults.filter((r: any) => 
          (typeof r.studentId === 'string' && r.studentId === id) ||
          (typeof r.studentId === 'object' && r.studentId?._id === id)
        );
        setStudentResults(studentSpecific);
      } catch (err) {
        console.error("Error fetching student profile:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="font-display text-xl font-black text-navy italic">Retrieving Student Academic Record...</p>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center space-y-6">
        <Card className="p-10 bg-white border-white space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-navy">Student Record Not Found</h2>
            <p className="text-navy/60 text-sm mt-1">The requested student ID does not exist or has been removed from the database.</p>
          </div>
          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={() => router.push("/admin/analytics")} variant="outline" className="h-11 px-6">
              Back to Analytics
            </Button>
            <Button onClick={() => router.push("/admin/students")} className="h-11 px-6">
              Back to Student List
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const avgPercentage = studentResults.length > 0
    ? Math.round(studentResults.reduce((acc, r) => acc + (r.percentage || 0), 0) / studentResults.length)
    : 0;

  const totalScore = studentResults.reduce((acc, r) => acc + (r.score || 0), 0);

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header & Back Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            size="icon" 
            title="Go Back"
          >
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-black text-navy leading-tight">
              Student <span className="text-primary italic">Profile</span>
            </h1>
            <p className="text-navy/60 text-xs font-bold mt-0.5">System ID: <span className="font-mono text-navy">{student._id}</span></p>
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            onClick={() => router.push("/admin/analytics")} 
            variant="outline" 
            className="h-11 px-4 text-xs"
          >
            Analytics Center
          </Button>
          <Button 
            onClick={() => router.push("/admin/students")} 
            variant="navy" 
            className="h-11 px-4 text-xs"
          >
            Student Directory
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Identity & Security Card */}
        <div className="space-y-8">
          <Card className="p-8 text-center space-y-6 bg-white border-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <GraduationCap size={120} />
            </div>
            <div className="relative inline-block">
              <div className="w-40 h-40 rounded-[2.5rem] bg-navy/5 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center mx-auto">
                {student.profileImage ? (
                  <img src={student.profileImage} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-navy/20" />
                )}
              </div>
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-xl border-2 border-white ${student.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} title={`Status: ${student.status}`} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-navy">{student.fullName}</h2>
              <p className="text-primary font-bold text-xs uppercase tracking-widest mt-1">@{student.username || student.phone}</p>
            </div>
            <div className="pt-6 border-t border-navy/5 grid grid-cols-2 gap-4 text-left">
               <div>
                 <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Class</p>
                 <p className="font-bold text-navy text-sm">{student.class}</p>
               </div>
               <div>
                 <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Target Course</p>
                 <p className="font-bold text-navy text-sm">{student.course || 'NEET/JEE'}</p>
               </div>
            </div>
          </Card>

          <Card className="p-6 space-y-4 bg-white border-white shadow-xl">
            <h3 className="font-bold text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-3">Account Security</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-navy/70">
                <span className="flex items-center gap-2"><Shield size={16} className="text-primary" /> Status</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${student.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                  {student.status || 'Active'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-bold text-navy/70">
                <span className="flex items-center gap-2"><Calendar size={16} className="text-primary" /> Enrolled On</span>
                <span className="text-navy">{student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Column: Performance & Details */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid md:grid-cols-2 gap-6">
             <Card className="p-6 space-y-4 bg-white border-white shadow-xl">
               <h3 className="font-bold text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-3 flex items-center gap-2">
                 <User size={16} className="text-primary" /> Contact Details
               </h3>
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><Phone size={16} /></div>
                    <div>
                      <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Mobile Number</p>
                      <p className="font-bold text-navy text-sm">{student.phone}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0"><BookOpen size={16} /></div>
                    <div>
                      <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Course Stream</p>
                      <p className="font-bold text-navy text-sm">{student.course || 'JEE / NEET Coaching'}</p>
                    </div>
                 </div>
               </div>
             </Card>

             <Card className="p-6 space-y-4 bg-white border-white shadow-xl">
               <h3 className="font-bold text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-3 flex items-center gap-2">
                 <Users size={16} className="text-primary" /> Guardian Details
               </h3>
               <div className="space-y-3">
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-navy/5 text-navy flex items-center justify-center shrink-0"><User size={16} /></div>
                    <div>
                      <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Parent Name</p>
                      <p className="font-bold text-navy text-sm">{student.parentName || 'Not Provided'}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-navy/5 text-navy flex items-center justify-center shrink-0"><Phone size={16} /></div>
                    <div>
                      <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Parent Contact</p>
                      <p className="font-bold text-navy text-sm">{student.parentPhone || 'Not Provided'}</p>
                    </div>
                 </div>
               </div>
             </Card>
          </div>

          {/* Real Academic Performance Card */}
          <Card className="p-8 space-y-8 bg-white border-white shadow-xl">
             <div className="flex items-center justify-between border-b border-navy/5 pb-4">
                <h3 className="font-bold text-navy text-xl">Academic Performance Snapshot</h3>
                <div className={`px-3 py-1 rounded-xl font-bold text-xs flex items-center gap-1.5 ${
                  avgPercentage >= 75 ? 'bg-green-500/10 text-green-600' :
                  avgPercentage >= 50 ? 'bg-amber-500/10 text-amber-600' :
                  'bg-red-500/10 text-red-600'
                }`}>
                  <Award size={16} />
                  <span>{avgPercentage >= 75 ? 'Top Performer' : avgPercentage >= 50 ? 'Average Progress' : 'Critical Attention Required'}</span>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 rounded-2xl bg-navy/5 border border-navy/5">
                   <p className="text-3xl font-black text-navy">{avgPercentage}%</p>
                   <p className="text-[10px] font-bold text-navy/60 uppercase tracking-widest mt-1">Average Test Accuracy</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-navy/5 border border-navy/5">
                   <p className="text-3xl font-black text-navy">{studentResults.length}</p>
                   <p className="text-[10px] font-bold text-navy/60 uppercase tracking-widest mt-1">Total Tests Attempted</p>
                </div>
                <div className="text-center p-6 rounded-2xl bg-navy/5 border border-navy/5">
                   <p className="text-3xl font-black text-navy">{totalScore}</p>
                   <p className="text-[10px] font-bold text-navy/60 uppercase tracking-widest mt-1">Cumulative Score</p>
                </div>
             </div>

             {/* Recent Attempts History Table */}
             <div className="space-y-3 pt-2">
               <h4 className="text-xs font-bold text-navy uppercase tracking-wider">Recent Test Attempts</h4>
               {studentResults.length > 0 ? (
                 <div className="overflow-x-auto rounded-xl border border-navy/5">
                   <table className="w-full text-left text-xs">
                     <thead className="bg-navy/5 text-navy font-bold">
                       <tr>
                         <th className="p-3">Test Title</th>
                         <th className="p-3">Score</th>
                         <th className="p-3">Percentage</th>
                         <th className="p-3">Submitted Date</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-navy/5">
                       {studentResults.slice(0, 5).map((r: any) => (
                         <tr key={r._id} className="hover:bg-navy/5 font-medium text-navy">
                           <td className="p-3 font-bold">{r.quizId?.title || 'Test Assessment'}</td>
                           <td className="p-3">{r.score}</td>
                           <td className="p-3 font-bold text-primary">{Math.round(r.percentage)}%</td>
                           <td className="p-3 text-navy/60">{r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'N/A'}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               ) : (
                 <p className="text-xs font-bold text-navy/40 italic p-4 bg-navy/5 rounded-xl text-center">No test attempt records found for this student yet.</p>
               )}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
