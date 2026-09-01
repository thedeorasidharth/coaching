"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Plus, Trash2, Edit2, AlertTriangle, X, Check, Search, Filter, Calendar, Tag, ShieldAlert } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { Notice } from "@/types";
import { FormattedDate } from "@/components/ui/FormattedDate";

export default function AdminNoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Modal & Form State
  const [showModal, setShowModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "General",
    targetClass: "All Classes",
    isImportant: false,
    attachmentUrl: ""
  });

  const fetchNotices = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/notices");
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } fontally: {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const openAddModal = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      content: "",
      category: "General",
      targetClass: "All Classes",
      isImportant: false,
      attachmentUrl: ""
    });
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category || "General",
      targetClass: notice.targetClass || "All Classes",
      isImportant: notice.isImportant || false,
      attachmentUrl: notice.attachmentUrl || ""
    });
    setFormError("");
    setShowModal(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!formData.title.trim()) {
      setFormError("Notice title is required.");
      return;
    }

    if (!formData.content.trim()) {
      setFormError("Notice content is required.");
      return;
    }

    setSubmitting(true);
    try {
      if (editingNotice) {
        await api.patch(`/notices/${editingNotice._id}`, formData);
      } else {
        await api.post("/notices", formData);
      }

      setShowModal(false);
      setEditingNotice(null);
      await fetchNotices();
    } catch (error: any) {
      console.error("Error saving notice:", error);
      setFormError(error.response?.data?.message || "Failed to save notice. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await api.delete(`/notices/${deleteId}`);
      setDeleteId(null);
      await fetchNotices();
    } catch (error) {
      console.error("Error deleting notice:", error);
    } finally {
      setDeleting(false);
    }
  };

  const filteredNotices = notices.filter(n => {
    const matchesSearch = search.trim() === "" || 
      n.title.toLowerCase().includes(search.toLowerCase()) || 
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCategory === "All" || n.category === filterCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-navy leading-tight">
            Manage <span className="text-primary italic">Notices</span>
          </h1>
          <p className="text-navy/60 text-xs sm:text-sm mt-1 font-medium">Post updates, schedule alerts, and announcements for students.</p>
        </div>
        <Button onClick={openAddModal} className="h-12 px-6 gap-2">
          <Plus size={20} /> Add New Notice
        </Button>
      </div>

      {/* Filter & Search Controls */}
      <Card className="p-4 sm:p-6 bg-white/90 shadow-xl border-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
            <input 
              type="text" 
              placeholder="Search notices by keyword..."
              className="w-full h-11 bg-navy/5 border-2 border-transparent focus:bg-white focus:border-primary/20 rounded-xl pl-12 pr-4 outline-none text-sm font-bold text-navy"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {["All", "General", "Exam Alert", "Schedule", "Holiday"].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`h-11 px-4 rounded-xl text-xs font-bold transition-all ${
                  filterCategory === cat
                    ? "bg-navy text-white shadow-md"
                    : "bg-navy/5 text-navy/60 hover:bg-navy/10 hover:text-navy"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Notices List */}
      <div className="space-y-4">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-28 rounded-2xl bg-navy/5 animate-pulse" />)
        ) : filteredNotices.length > 0 ? (
          filteredNotices.map((notice) => (
            <motion.div
              key={notice._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className={`p-6 bg-white border-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden ${
                notice.isImportant ? 'border-l-8 border-l-red-600 bg-red-500/[0.02]' : ''
              }`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                      notice.isImportant ? 'bg-red-600/10 text-red-600' : 'bg-primary/10 text-primary'
                    }`}>
                      <Bell size={24} />
                    </div>
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-bold text-navy text-lg leading-tight">{notice.title}</h3>
                        {notice.isImportant && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-600/10 text-red-600 text-[10px] font-black uppercase tracking-wider">
                            <ShieldAlert size={12} /> Important
                          </span>
                        )}
                        {notice.category && (
                          <span className="px-2 py-0.5 rounded-md bg-navy/5 text-navy/60 text-[10px] font-bold">
                            {notice.category}
                          </span>
                        )}
                        {notice.targetClass && (
                          <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                            {notice.targetClass}
                          </span>
                        )}
                      </div>

                      <p className="text-sm font-medium text-navy/70 leading-relaxed whitespace-pre-line">{notice.content}</p>

                      <div className="flex items-center gap-2 text-[10px] font-bold text-navy/40 pt-1">
                        <Calendar size={12} />
                        <span>Posted on <FormattedDate date={notice.createdAt} /></span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end md:self-start shrink-0">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditModal(notice)}
                      title="Edit Notice"
                    >
                      <Edit2 size={16} /> Edit
                    </Button>
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setDeleteId(notice._id)}
                      title="Delete Notice"
                    >
                      <Trash2 size={16} /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        ) : (
          <Card className="p-12 text-center bg-white border-white space-y-4">
            <div className="w-16 h-16 bg-navy/5 text-navy/30 rounded-2xl flex items-center justify-center mx-auto">
              <Bell size={32} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-navy">No notices found</h3>
              <p className="text-xs text-navy/40 font-medium mt-1">Try adjusting your search terms or add a new announcement.</p>
            </div>
            <Button onClick={openAddModal} variant="outline" className="mx-auto h-10 text-xs">
              <Plus size={16} /> Post Notice Now
            </Button>
          </Card>
        )}
      </div>

      {/* CREATE / EDIT NOTICE MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-navy/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto z-10">
              <div className="flex items-center justify-between border-b border-navy/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                    <Bell size={20} />
                  </div>
                  <h3 className="font-bold text-navy text-xl">{editingNotice ? "Edit Notice" : "Post New Announcement"}</h3>
                </div>
                <button type="button" onClick={() => setShowModal(false)} className="text-navy/40 hover:text-navy p-2 rounded-xl transition-all">
                  <X size={20} />
                </button>
              </div>

              {formError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 font-bold text-xs flex items-center gap-2">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Notice Title *</label>
                  <input 
                    required
                    type="text" 
                    placeholder="e.g. Special Revision Test Series Scheduled"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full h-12 bg-navy/5 rounded-2xl px-4 text-navy font-bold text-sm outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Category</label>
                    <select
                      className="w-full h-12 bg-navy/5 rounded-2xl px-4 text-navy font-bold text-sm outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all appearance-none"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="General">General</option>
                      <option value="Exam Alert">Exam Alert</option>
                      <option value="Schedule">Schedule</option>
                      <option value="Holiday">Holiday</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Target Batch / Class</label>
                    <select
                      className="w-full h-12 bg-navy/5 rounded-2xl px-4 text-navy font-bold text-sm outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all appearance-none"
                      value={formData.targetClass}
                      onChange={(e) => setFormData({ ...formData, targetClass: e.target.value })}
                    >
                      <option value="All Classes">All Classes</option>
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="Dropper">Dropper</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Announcement Body *</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Enter full notice announcement text..."
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full bg-navy/5 rounded-2xl p-4 text-navy font-medium text-sm outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 bg-navy/5 p-4 rounded-2xl cursor-pointer" onClick={() => setFormData({ ...formData, isImportant: !formData.isImportant })}>
                  <input 
                    type="checkbox" 
                    checked={formData.isImportant}
                    onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                    className="w-5 h-5 rounded-md text-red-600 focus:ring-red-500 border-none cursor-pointer"
                  />
                  <div>
                    <p className="text-xs font-bold text-navy">Highlight as Important</p>
                    <p className="text-[10px] text-navy/40 font-medium">Adds high-visibility red badge and pins to top</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setShowModal(false)} disabled={submitting}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="flex-1 h-12 rounded-xl">
                    {submitting ? "Saving..." : editingNotice ? "Save Changes" : "Post Notice"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION MODAL */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteId(null)} className="absolute inset-0 bg-navy/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-md bg-white rounded-[2.5rem] p-6 sm:p-8 text-center space-y-6 shadow-2xl z-10">
              <div className="w-16 h-16 bg-red-500/10 text-red-600 rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>

              <div>
                <h3 className="font-bold text-navy text-2xl">Delete Notice?</h3>
                <p className="text-navy/60 text-sm mt-1">Are you sure you want to delete this notice announcement? This action cannot be undone.</p>
              </div>

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setDeleteId(null)} disabled={deleting}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" className="flex-1 h-12 rounded-xl" onClick={handleDeleteConfirm} disabled={deleting}>
                  {deleting ? "Deleting..." : "Delete Notice"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
