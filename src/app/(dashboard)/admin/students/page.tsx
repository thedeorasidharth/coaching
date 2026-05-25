"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical, 
  Eye, 
  Edit2, 
  Trash2, 
  Key, 
  UserCheck, 
  UserX,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  X
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [search, filterClass, filterCourse]);

  const fetchStudents = async () => {
    try {
      const res = await api.get(`/students`, {
        params: { search, className: filterClass, course: filterCourse }
      });
      setStudents(res.data);
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await api.patch(`/students/${id}/status`, {});
      fetchStudents();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      try {
        await api.delete(`/students/${id}`);
        fetchStudents();
      } catch (err) {
        alert("Error deleting student");
      }
    }
  };

  const handleResetPassword = async (id: string) => {
    const newPass = prompt("Enter new password for student:");
    if (newPass) {
      try {
        await api.patch(`/students/${id}/reset-password`, { password: newPass });
        alert("Password reset successfully");
      } catch (err) {
        alert("Error resetting password");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">
            Student <span className="text-primary italic">Management</span>
          </h1>
          <p className="text-navy/60 mt-1">Monitor, manage, and empower your student community.</p>
        </div>
        <Link href="/admin/students/add">
          <Button className="flex items-center gap-2 h-14 px-8 text-lg font-bold">
            <UserPlus size={24} /> Add Student
          </Button>
        </Link>
      </div>

      <Card className="p-0 overflow-hidden bg-white/80 border-white shadow-2xl relative">
        {/* Filters Bar */}
        <div className="p-6 border-b border-navy/5 flex flex-col lg:flex-row gap-4 bg-navy/5">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
            <input 
              type="text" 
              placeholder="Search by name or username..."
              className="w-full h-12 bg-white rounded-xl pl-12 pr-6 outline-none focus:ring-2 ring-primary/20 transition-all text-sm font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select 
              className="h-12 bg-white rounded-xl px-6 outline-none focus:ring-2 ring-primary/20 transition-all text-sm font-bold text-navy appearance-none border-none"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="">All Classes</option>
              <option>Class XII - JEE</option>
              <option>Class XII - NEET</option>
              <option>Class XI - Foundation</option>
              <option>Repeater - JEE</option>
              <option>Repeater - NEET</option>
            </select>
            <select 
              className="h-12 bg-white rounded-xl px-6 outline-none focus:ring-2 ring-primary/20 transition-all text-sm font-bold text-navy appearance-none border-none"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="">All Courses</option>
              <option>Physics</option>
              <option>Chemistry</option>
              <option>Maths</option>
              <option>Biology</option>
            </select>
            <Button variant="ghost" className="h-12 w-12 p-0 rounded-xl" onClick={() => { setSearch(""); setFilterClass(""); setFilterCourse(""); }}>
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-navy text-white/40">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Student</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Username</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Class / Goal</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em]">Joined Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {loading ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-navy/40 font-black italic">Analyzing Database...</td></tr>
              ) : students.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-navy/40 font-black italic">No records found matching your query.</td></tr>
              ) : students.map((student, i) => (
                <tr key={student._id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center font-bold shadow-lg overflow-hidden">
                          {student.profileImage ? (
                            <img src={student.profileImage} alt={student.fullName} className="w-full h-full object-cover" />
                          ) : student.fullName.charAt(0)}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${student.status === 'active' ? 'bg-green-500' : 'bg-red-500'}`} />
                      </div>
                      <div>
                        <p className="font-bold text-navy leading-none mb-1">{student.fullName}</p>
                        <p className="text-[10px] text-navy/30 font-black uppercase">{student.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-bold text-navy/60">@{student.username}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tight">
                      {student.class}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <button 
                      onClick={() => handleToggleStatus(student._id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                        student.status === 'active' 
                          ? "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white" 
                          : "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white"
                      }`}
                    >
                      {student.status}
                    </button>
                  </td>
                  <td className="px-8 py-6 text-sm font-medium text-navy/30 italic">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-center gap-2">
                      <Link href={`/admin/students/${student._id}`}>
                        <button className="p-3 text-navy/20 hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                          <Eye size={18} />
                        </button>
                      </Link>
                      <button onClick={() => handleResetPassword(student._id)} className="p-3 text-navy/20 hover:text-yellow-600 hover:bg-yellow-600/10 rounded-xl transition-all">
                        <Key size={18} />
                      </button>
                      <button onClick={() => handleDelete(student._id)} className="p-3 text-navy/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-6 border-t border-navy/5 flex items-center justify-between bg-white/50">
          <p className="text-xs font-bold text-navy/40 uppercase">Showing {students.length} Students</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled className="px-4 border-navy/10"><ChevronLeft size={16} /> Prev</Button>
            <Button variant="outline" size="sm" disabled className="px-4 border-navy/10">Next <ChevronRight size={16} /></Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

