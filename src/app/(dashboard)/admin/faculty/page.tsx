"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { UserCircle, Plus, Trash2, GraduationCap, Calendar, Award, Camera, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { FacultyMember } from "@/types";

export default function AdminFaculty() {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    qualifications: "", 
    experience: "", 
    subject: "", 
    imageUrl: "" 
  });

  const fetchFaculty = async () => {
    try {
      const { data } = await api.get("/faculty");
      setFaculty(data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  const handleEditClick = (member: FacultyMember) => {
    setFormData({
      name: member.name,
      qualifications: member.qualifications.join(", "),
      experience: member.experience,
      subject: member.subject,
      imageUrl: member.imageUrl
    });
    setEditingId(member._id);
    setShowAddForm(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Faculty Form...");
    try {
      const formattedData = {
        ...formData,
        qualifications: formData.qualifications.split(",").map(q => q.trim())
      };
      console.log("Payload:", formattedData);

      let res;
      if (editingId) {
        console.log("Action: PATCH", `/faculty/${editingId}`);
        res = await api.patch(`/faculty/${editingId}`, formattedData);
      } else {
        console.log("Action: POST", "/faculty");
        res = await api.post("/faculty", formattedData);
      }

      console.log("Server Response:", res.data);
      setFormData({ name: "", qualifications: "", experience: "", subject: "", imageUrl: "" });
      setEditingId(null);
      setShowAddForm(false);
      fetchFaculty();
    } catch (error: any) {
      console.error("Error saving faculty:", error);
      console.error("Error Details:", error.response?.data || error.message);
      alert(`Failed to save faculty: ${error.response?.data?.message || error.message}`);
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (confirm("Are you sure you want to delete this faculty member?")) {
      try {
        await api.delete(`/faculty/${id}`);
        fetchFaculty();
      } catch (error) {
        console.error("Error deleting faculty:", error);
      }
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">
            Manage <span className="text-primary italic">Faculty</span>
          </h1>
          <p className="text-navy/60 mt-1">Add or update your institute's expert teachers.</p>
        </div>
        <Button 
          onClick={() => {
            if (showAddForm) {
              setEditingId(null);
              setFormData({ name: "", qualifications: "", experience: "", subject: "", imageUrl: "" });
            }
            setShowAddForm(!showAddForm);
          }} 
          className="flex items-center gap-2"
        >
          {showAddForm ? <X size={20} /> : <Plus size={20} />} 
          {showAddForm ? "Cancel" : "Add New Faculty"}
        </Button>
      </div>

      {showAddForm && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-8 max-w-4xl mx-auto border-primary/20 shadow-xl">
            <form onSubmit={handleFormSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-navy/40 uppercase tracking-widest">Full Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-navy/5 border-none rounded-2xl p-4 text-navy font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. Dr. Mahipal Singh"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-navy/40 uppercase tracking-widest">Subject Expertise</label>
                  <input 
                    required
                    type="text" 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full bg-navy/5 border-none rounded-2xl p-4 text-navy font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. Physics Expert"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-navy/40 uppercase tracking-widest">Qualifications (comma separated)</label>
                  <input 
                    required
                    type="text" 
                    value={formData.qualifications}
                    onChange={(e) => setFormData({...formData, qualifications: e.target.value})}
                    className="w-full bg-navy/5 border-none rounded-2xl p-4 text-navy font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="PhD, M.Tech, IIT Delhi"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-navy/40 uppercase tracking-widest">Experience</label>
                  <input 
                    required
                    type="text" 
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="w-full bg-navy/5 border-none rounded-2xl p-4 text-navy font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="e.g. 17+ Years"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-navy/40 uppercase tracking-widest">Faculty Photo URL</label>
                  <input 
                    required
                    type="text" 
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full bg-navy/5 border-none rounded-2xl p-4 text-navy font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="https://example.com/photo.jpg"
                  />
                  <div className="w-full h-48 mt-4 rounded-[2rem] bg-navy/5 border-2 border-dashed border-navy/10 flex flex-col items-center justify-center overflow-hidden">
                    {formData.imageUrl ? (
                      <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera size={48} className="text-navy/20" />
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full h-14 text-lg mt-auto">
                  {editingId ? "Update Faculty Member" : "Save Faculty Member"}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          [1, 2, 3].map(i => <div key={i} className="h-64 rounded-[3rem] bg-navy/5 animate-pulse" />)
        ) : faculty.length > 0 ? (
          faculty.map((member) => (
            <Card key={member._id} className="group p-0 overflow-hidden hover:shadow-2xl transition-all">
              <div className="relative h-48">
                <img 
                  src={member.imageUrl || "/faculty_placeholder.png"} 
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={() => handleEditClick(member)}
                    className="w-10 h-10 rounded-full bg-white text-navy flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Plus size={18} className="rotate-45" /> {/* Using Plus rotated as a placeholder for edit if icon is missing */}
                  </button>
                  <button 
                    onClick={() => handleDeleteFaculty(member._id)}
                    className="w-10 h-10 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest mb-1 block">{member.subject}</span>
                <h3 className="text-xl font-bold text-navy mb-4">{member.name}</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-2 text-navy/60">
                    <GraduationCap size={16} className="mt-1 flex-shrink-0" />
                    <p className="text-xs font-medium">{member.qualifications.join(", ")}</p>
                  </div>
                  <div className="flex items-center gap-2 text-navy/60">
                    <Calendar size={16} className="flex-shrink-0" />
                    <p className="text-xs font-medium">{member.experience} Experience</p>
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-navy/5 rounded-[3rem]">
            <UserCircle size={48} className="mx-auto text-navy/20 mb-4" />
            <h3 className="text-xl font-bold text-navy/40">No faculty members added yet</h3>
          </div>
        )}
      </div>
    </div>
  );
}
