"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bell, Plus, Trash2, AlertTriangle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { Notice } from "@/types";
import { FormattedDate } from "@/components/ui/FormattedDate";

export default function AdminNotices() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", content: "", isImportant: false });

  const fetchNotices = async () => {
    try {
      const { data } = await api.get("/notices");
      setNotices(data);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const handleEditClick = (notice: Notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
      isImportant: notice.isImportant
    });
    setEditingId(notice._id);
    setShowAddForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Notice Form...");
    try {
      console.log("Payload:", formData);
      let res;
      if (editingId) {
        console.log("Action: PATCH", `/notices/${editingId}`);
        res = await api.patch(`/notices/${editingId}`, formData);
      } else {
        console.log("Action: POST", "/notices");
        res = await api.post("/notices", formData);
      }
      console.log("Server Response:", res.data);
      setFormData({ title: "", content: "", isImportant: false });
      setEditingId(null);
      setShowAddForm(false);
      fetchNotices();
    } catch (error: any) {
      console.error("Error saving notice:", error);
      console.error("Error Details:", error.response?.data || error.message);
      alert(`Failed to save notice: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (confirm("Are you sure you want to delete this notice?")) {
      try {
        await api.delete(`/notices/${id}`);
        fetchNotices();
      } catch (error) {
        console.error("Error deleting notice:", error);
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">
            Manage <span className="text-primary italic">Notices</span>
          </h1>
          <p className="text-navy/60 mt-1">Post updates and announcements for students.</p>
        </div>
        <Button 
          onClick={() => {
            if (showAddForm) {
              setEditingId(null);
              setFormData({ title: "", content: "", isImportant: false });
            }
            setShowAddForm(!showAddForm);
          }} 
          className="flex items-center gap-2"
        >
          {showAddForm ? <CheckCircle size={20} className="rotate-45" /> : <Plus size={20} />} 
          {showAddForm ? "Cancel" : "Add New Notice"}
        </Button>
      </div>

      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8 max-w-2xl mx-auto border-primary/20 shadow-xl">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-navy/40 uppercase tracking-widest">Notice Title</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-navy/5 border-none rounded-2xl p-4 text-navy font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  placeholder="e.g. New Batch Starting Soon"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-navy/40 uppercase tracking-widest">Notice Content</label>
                <textarea 
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  className="w-full bg-navy/5 border-none rounded-2xl p-4 text-navy font-bold focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                  placeholder="Details about the announcement..."
                />
              </div>
              <div className="flex items-center gap-3 bg-navy/5 p-4 rounded-2xl">
                <input 
                  type="checkbox" 
                  id="isImportant"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({...formData, isImportant: e.target.checked})}
                  className="w-5 h-5 rounded-lg text-primary focus:ring-primary border-none cursor-pointer"
                />
                <label htmlFor="isImportant" className="text-sm font-bold text-navy cursor-pointer">Mark as Important (Highlighted)</label>
              </div>
              <Button type="submit" className="w-full h-14 text-lg">
                {editingId ? "Update Notice" : "Post Notice"}
              </Button>
            </form>
          </Card>
        </motion.div>
      )}

      <div className="grid gap-6">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-24 rounded-3xl bg-navy/5 animate-pulse" />)
        ) : notices.length > 0 ? (
          notices.map((notice) => (
            <Card key={notice._id} className={`p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-xl transition-all ${notice.isImportant ? 'border-l-4 border-l-accent' : ''}`}>
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${notice.isImportant ? 'bg-accent/10 text-accent' : 'bg-primary/10 text-primary'}`}>
                  <Bell size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-navy text-lg">{notice.title}</h3>
                    {notice.isImportant && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[8px] font-black uppercase">
                        <AlertTriangle size={8} /> Important
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-navy/60 line-clamp-1">{notice.content}</p>
                  <p className="text-[10px] font-medium text-navy/30 mt-2">
                    <FormattedDate date={notice.createdAt} />
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => handleEditClick(notice)} className="border-navy/20 text-navy hover:bg-navy hover:text-white border-none">
                  <Plus size={18} className="rotate-45" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteNotice(notice._id)} className="border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white border-none">
                  <Trash2 size={18} />
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-20 bg-navy/5 rounded-[3rem]">
            <Bell size={48} className="mx-auto text-navy/20 mb-4" />
            <h3 className="text-xl font-bold text-navy/40">No notices posted yet</h3>
          </div>
        )}
      </div>
    </div>
  );
}
