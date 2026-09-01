"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Search, 
  Eye, 
  Edit2, 
  Trash2, 
  Key, 
  UserPlus, 
  X, 
  Calendar, 
  Phone, 
  BookOpen, 
  Building,
  CheckCircle,
  AlertTriangle,
  RefreshCw
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterClass, setFilterClass] = useState("All Classes");
  const [filterCourse, setFilterCourse] = useState("All Courses");

  // Modal States
  const [viewStudent, setViewStudent] = useState<any | null>(null);
  const [editStudent, setEditStudent] = useState<any | null>(null);
  const [deleteStudent, setDeleteStudent] = useState<any | null>(null);

  // Form & Action Loading States
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [search, filterClass, filterCourse]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/students`, {
        params: { 
          search: search.trim(), 
          class: filterClass === "All Classes" ? "" : filterClass, 
          course: filterCourse === "All Courses" ? "" : filterCourse 
        }
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

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editStudent) return;
    setEditLoading(true);
    setEditError("");

    try {
      await api.put(`/admin/students/${editStudent._id}`, {
        fullName: editStudent.fullName,
        phone: editStudent.phone,
        course: editStudent.course,
        class: editStudent.class,
      });

      setEditStudent(null);
      fetchStudents();
    } catch (err: any) {
      setEditError(err.response?.data?.message || "Error updating student details.");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteStudent) return;
    setDeleteLoading(true);

    try {
      await api.delete(`/admin/students/${deleteStudent._id}`);
      setStudents(prev => prev.filter(s => s._id !== deleteStudent._id));
      setDeleteStudent(null);
    } catch (err: any) {
      alert(err.response?.data?.message || "Error deleting student");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleResetPassword = async (id: string, name: string) => {
    const newPass = prompt(`Enter new password for student ${name}:`);
    if (newPass && newPass.trim().length >= 4) {
      try {
        await api.patch(`/students/${id}/reset-password`, { password: newPass.trim() });
        alert(`Password for ${name} reset successfully!`);
      } catch (err) {
        alert("Error resetting password");
      }
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">Students</h1>
          <p className="text-navy/60 mt-1">Manage and monitor registered students</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="px-6 py-3 rounded-2xl bg-white shadow-xl border-2 border-primary/5 flex items-center gap-3">
            <Users className="text-primary" size={22} />
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-navy/30">Total Registered</p>
              <p className="text-xl font-black text-navy italic">{students.length} Students</p>
            </div>
          </div>
          <Link href="/admin/students/add">
            <Button className="flex items-center gap-2 h-14 px-8 text-lg font-bold">
              <UserPlus size={24} /> Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-6 bg-white/90 border-white shadow-xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
            <input 
              type="text" 
              placeholder="Search by full name or mobile number..."
              className="w-full h-12 bg-navy/5 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl pl-12 pr-6 outline-none transition-all text-sm font-bold text-navy"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-4">
            <select 
              className="h-12 bg-navy/5 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-6 outline-none transition-all text-sm font-bold text-navy appearance-none"
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
            >
              <option value="All Courses">All Courses</option>
              <option value="JEE">JEE</option>
              <option value="NEET">NEET</option>
              <option value="Foundation">Foundation</option>
            </select>

            <select 
              className="h-12 bg-navy/5 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-2xl px-6 outline-none transition-all text-sm font-bold text-navy appearance-none"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="All Classes">All Classes</option>
              <option value="Class 11">Class 11</option>
              <option value="Class 12">Class 12</option>
              <option value="Dropper">Dropper</option>
            </select>

            {(search || filterCourse !== "All Courses" || filterClass !== "All Classes") && (
              <Button 
                variant="ghost" 
                className="h-12 px-4 rounded-2xl text-navy/40 hover:text-navy" 
                onClick={() => { setSearch(""); setFilterCourse("All Courses"); setFilterClass("All Classes"); }}
              >
                <X size={18} /> Clear
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Student List Table */}
      <Card className="p-0 overflow-hidden shadow-2xl border-white bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-navy/5 bg-navy/5 text-[10px] font-black uppercase tracking-widest text-navy/40">
                <th className="px-8 py-6">Student Name</th>
                <th className="px-8 py-6">Mobile Number</th>
                <th className="px-8 py-6">Course</th>
                <th className="px-8 py-6">Class</th>
                <th className="px-8 py-6">Registration Date</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-navy/40 font-bold">
                    <RefreshCw className="animate-spin mx-auto mb-2 text-primary" size={24} />
                    Loading student database...
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-navy/40 font-bold italic">
                    No student records found matching your filters.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="hover:bg-navy/5 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-base shadow-sm">
                          {student.fullName ? student.fullName[0].toUpperCase() : 'S'}
                        </div>
                        <div>
                          <p className="font-bold text-navy leading-none mb-1">{student.fullName}</p>
                          <p className="text-[10px] text-navy/30 font-bold uppercase">{student.course || 'JEE'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-navy/70">{student.phone}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-tight">
                        {student.course || 'JEE'}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-sm font-bold text-navy/70">{student.class}</span>
                    </td>
                    <td className="px-8 py-6 text-xs font-bold text-navy/40">
                      {new Date(student.createdAt).toLocaleDateString()}
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
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setViewStudent(student)} 
                          title="View Student"
                          className="p-2.5 text-navy/30 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => setEditStudent({...student})} 
                          title="Edit Student"
                          className="p-2.5 text-navy/30 hover:text-blue-600 hover:bg-blue-600/10 rounded-xl transition-all"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleResetPassword(student._id, student.fullName)} 
                          title="Reset Password"
                          className="p-2.5 text-navy/30 hover:text-yellow-600 hover:bg-yellow-600/10 rounded-xl transition-all"
                        >
                          <Key size={18} />
                        </button>
                        <button 
                          onClick={() => setDeleteStudent(student)} 
                          title="Delete Student"
                          className="p-2.5 text-navy/30 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* VIEW STUDENT MODAL */}
      <AnimatePresence>
        {viewStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewStudent(null)} className="absolute inset-0 bg-navy/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-navy/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
                    {viewStudent.fullName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-bold text-navy text-xl">{viewStudent.fullName}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-primary">{viewStudent.course || 'JEE'} • {viewStudent.class}</p>
                  </div>
                </div>
                <button onClick={() => setViewStudent(null)} className="text-navy/40 hover:text-navy p-2"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-navy/5 rounded-2xl space-y-1">
                  <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest flex items-center gap-1"><Phone size={12} /> Mobile Number</p>
                  <p className="font-bold text-navy">{viewStudent.phone}</p>
                </div>
                <div className="p-4 bg-navy/5 rounded-2xl space-y-1">
                  <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest flex items-center gap-1"><BookOpen size={12} /> Target Course</p>
                  <p className="font-bold text-navy">{viewStudent.course || 'JEE'}</p>
                </div>
                <div className="p-4 bg-navy/5 rounded-2xl space-y-1">
                  <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest flex items-center gap-1"><Building size={12} /> Class</p>
                  <p className="font-bold text-navy">{viewStudent.class}</p>
                </div>
                <div className="p-4 bg-navy/5 rounded-2xl space-y-1">
                  <p className="text-[9px] font-black text-navy/30 uppercase tracking-widest flex items-center gap-1"><Calendar size={12} /> Joined On</p>
                  <p className="font-bold text-navy">{new Date(viewStudent.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="p-4 bg-navy/5 rounded-2xl flex justify-between items-center">
                <p className="text-xs font-bold text-navy/60">Account Status</p>
                <span className={`px-4 py-1 rounded-full text-xs font-black uppercase ${viewStudent.status === 'active' ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                  {viewStudent.status}
                </span>
              </div>

              <Button className="w-full h-12 rounded-xl" variant="outline" onClick={() => setViewStudent(null)}>
                Close Details
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT STUDENT MODAL */}
      <AnimatePresence>
        {editStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setEditStudent(null)} className="absolute inset-0 bg-navy/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-navy/5 pb-4">
                <h3 className="font-bold text-navy text-xl">Edit Student Profile</h3>
                <button onClick={() => setEditStudent(null)} className="text-navy/40 hover:text-navy p-2"><X size={20} /></button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Full Name</label>
                  <input
                    required
                    type="text"
                    value={editStudent.fullName}
                    onChange={(e) => setEditStudent({ ...editStudent, fullName: e.target.value })}
                    className="w-full h-12 bg-navy/5 rounded-2xl px-4 font-bold text-navy outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Mobile Number</label>
                  <input
                    required
                    type="tel"
                    value={editStudent.phone}
                    onChange={(e) => setEditStudent({ ...editStudent, phone: e.target.value })}
                    className="w-full h-12 bg-navy/5 rounded-2xl px-4 font-bold text-navy outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Course</label>
                    <select
                      className="w-full h-12 bg-navy/5 rounded-2xl px-4 font-bold text-navy outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-sm appearance-none"
                      value={editStudent.course || "JEE"}
                      onChange={(e) => setEditStudent({ ...editStudent, course: e.target.value })}
                    >
                      <option value="JEE">JEE</option>
                      <option value="NEET">NEET</option>
                      <option value="Foundation">Foundation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Class</label>
                    <select
                      className="w-full h-12 bg-navy/5 rounded-2xl px-4 font-bold text-navy outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all text-sm appearance-none"
                      value={editStudent.class}
                      onChange={(e) => setEditStudent({ ...editStudent, class: e.target.value })}
                    >
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="Dropper">Dropper</option>
                    </select>
                  </div>
                </div>

                {editError && (
                  <p className="text-xs font-bold text-red-500 bg-red-500/5 p-3 rounded-xl text-center border border-red-500/10">
                    {editError}
                  </p>
                )}

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setEditStudent(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={editLoading} className="flex-1 h-12 rounded-xl">
                    {editLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteStudent(null)} className="absolute inset-0 bg-navy/20 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-8 text-center space-y-6 shadow-2xl">
              <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>

              <div>
                <h3 className="font-bold text-navy text-2xl">Delete Student?</h3>
                <p className="text-navy/60 text-sm mt-2">
                  Are you sure you want to delete <span className="font-bold text-navy">{deleteStudent.fullName}</span> ({deleteStudent.phone})? This action cannot be undone.
                </p>
              </div>

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setDeleteStudent(null)}>
                  Cancel
                </Button>
                <Button className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white" onClick={handleDeleteConfirm} disabled={deleteLoading}>
                  {deleteLoading ? "Deleting..." : "Delete Student"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
