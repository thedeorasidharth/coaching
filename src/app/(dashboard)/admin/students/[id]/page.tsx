"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Mail, 
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
  GraduationCap
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function StudentProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await api.get(`/students/${id}`);
        setStudent(res.data);
      } catch (err) {
        console.error("Error fetching student", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) return <div className="h-[60vh] flex items-center justify-center font-display text-2xl font-black text-navy animate-pulse italic">Retrieving Academic Record...</div>;
  if (!student) return <div className="h-[60vh] flex items-center justify-center font-display text-2xl font-black text-navy">Record Not Found.</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <Link href="/admin/students">
            <Button variant="outline" className="w-12 h-12 p-0 rounded-2xl border-navy/10 bg-white hover:bg-navy hover:text-white transition-all">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-4xl font-black text-navy leading-tight">
              Student <span className="text-primary italic">Profile</span>
            </h1>
            <p className="text-navy/60 mt-1 uppercase text-[10px] font-black tracking-widest">System Identifier: {student._id}</p>
          </div>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" className="gap-2 border-navy/10 bg-white hover:bg-primary hover:text-white transition-all h-12">
            <Edit2 size={18} /> Edit Profile
          </Button>
          <Button variant="outline" className="gap-2 border-red-500/20 bg-red-500/5 text-red-500 hover:bg-red-500 hover:text-white transition-all h-12">
            <Trash2 size={18} /> Delete Account
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Identity Card */}
        <div className="space-y-8">
          <Card className="p-8 text-center space-y-6 bg-white/80 border-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <GraduationCap size={120} />
            </div>
            <div className="relative inline-block">
              <div className="w-48 h-48 rounded-[3rem] bg-navy/5 border-8 border-white shadow-2xl overflow-hidden flex items-center justify-center mx-auto transition-transform group-hover:scale-105 duration-500">
                {student.profileImage ? (
                  <img src={student.profileImage} alt={student.fullName} className="w-full h-full object-cover" />
                ) : (
                  <User size={64} className="text-navy/10" />
                )}
              </div>
              <div className={`absolute bottom-2 right-2 w-8 h-8 rounded-2xl border-4 border-white ${student.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} title={`Status: ${student.status}`} />
            </div>
            <div>
              <h2 className="text-3xl font-black text-navy">{student.fullName}</h2>
              <p className="text-primary font-black uppercase text-xs tracking-widest mt-1">@{student.username}</p>
            </div>
            <div className="pt-6 border-t border-navy/5 grid grid-cols-2 gap-4">
               <div className="text-left">
                 <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Class</p>
                 <p className="font-bold text-navy text-sm">{student.class}</p>
               </div>
               <div className="text-left">
                 <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Joined</p>
                 <p className="font-bold text-navy text-sm">{new Date(student.createdAt).toLocaleDateString()}</p>
               </div>
            </div>
          </Card>

          <Card className="p-8 space-y-6 bg-white/80 border-white">
            <h3 className="font-black text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-4">Security Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm font-bold text-navy/60">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40"><Shield size={18} /></div>
                Account Status: <span className={student.status === 'active' ? 'text-green-500' : 'text-red-500'}>{student.status}</span>
              </div>
              <div className="flex items-center gap-4 text-sm font-bold text-navy/60">
                <div className="w-10 h-10 rounded-xl bg-navy/5 flex items-center justify-center text-navy/40"><Lock size={18} /></div>
                Password: Last reset 2 weeks ago
              </div>
            </div>
            <Button className="w-full gap-2 h-12">
               <Activity size={18} /> System Activity Log
            </Button>
          </Card>
        </div>

        {/* Right Column: Detailed Info & Analytics */}
        <div className="lg:col-span-2 space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
             <Card className="p-8 space-y-6 bg-white/80 border-white h-full">
               <h3 className="font-black text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-4 flex items-center gap-2">
                 <User size={18} className="text-primary" /> Student Details
               </h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center"><Phone size={18} /></div>
                    <div>
                      <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Phone Number</p>
                      <p className="font-bold text-navy">{student.phone}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center"><BookOpen size={18} /></div>
                    <div>
                      <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Enrolled Courses</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {student.enrolledCourses.length > 0 ? student.enrolledCourses.map((c: string) => (
                          <span key={c} className="px-3 py-0.5 rounded-lg bg-navy/5 text-[10px] font-black text-navy/40 uppercase">{c}</span>
                        )) : <span className="text-sm font-bold text-navy/20 italic">No courses selected</span>}
                      </div>
                    </div>
                 </div>
               </div>
             </Card>

             <Card className="p-8 space-y-6 bg-white/80 border-white h-full">
               <h3 className="font-black text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-4 flex items-center gap-2">
                 <Users size={18} className="text-primary" /> Guardian Information
               </h3>
               <div className="space-y-4">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-navy flex items-center justify-center"><User size={18} /></div>
                    <div>
                      <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Parent Name</p>
                      <p className="font-bold text-navy">{student.parentName}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 text-navy flex items-center justify-center"><Phone size={18} /></div>
                    <div>
                      <p className="text-[10px] font-black text-navy/30 uppercase tracking-widest">Parent Phone</p>
                      <p className="font-bold text-navy">{student.parentPhone}</p>
                    </div>
                 </div>
               </div>
             </Card>
          </div>

          <Card className="p-10 space-y-10 bg-white/80 border-white relative overflow-hidden">
             <div className="flex items-center justify-between border-b border-navy/5 pb-6">
                <h3 className="font-black text-navy text-xl uppercase tracking-tighter italic">Performance <span className="text-primary">Snapshot</span></h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 text-green-600 rounded-xl font-bold text-xs">
                  <Award size={16} /> Merit Level: Elite
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center p-6 rounded-3xl bg-navy/5 border-2 border-white">
                   <p className="text-4xl font-black text-navy italic">84%</p>
                   <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest mt-2">Avg Test Score</p>
                </div>
                <div className="text-center p-6 rounded-3xl bg-navy/5 border-2 border-white">
                   <p className="text-4xl font-black text-navy italic">92%</p>
                   <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest mt-2">Attendance</p>
                </div>
                <div className="text-center p-6 rounded-3xl bg-navy/5 border-2 border-white">
                   <p className="text-4xl font-black text-navy italic">12</p>
                   <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest mt-2">Tests Taken</p>
                </div>
             </div>

             <div className="pt-10 space-y-4">
                <h4 className="text-[10px] font-black text-navy/40 uppercase tracking-[0.2em]">Academic Roadmap Progress</h4>
                <div className="w-full h-4 bg-navy/5 rounded-full overflow-hidden p-1">
                   <div className="h-full bg-primary rounded-full shadow-lg" style={{ width: '65%' }} />
                </div>
                <p className="text-[10px] font-bold text-navy/30 italic text-right italic">65% of Syllabus Completed (Estimate)</p>
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
