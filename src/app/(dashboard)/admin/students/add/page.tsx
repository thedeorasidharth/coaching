"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Users, 
  BookOpen, 
  Camera, 
  ArrowLeft, 
  CheckCircle,
  ShieldCheck,
  Building
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function AddStudentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    password: "",
    class: "Class XII - JEE",
    phone: "",
    parentName: "",
    parentPhone: "",
    enrolledCourses: [] as string[],
    profileImage: ""
  });

  const courses = ["Physics", "Chemistry", "Maths", "Biology"];

  const handleCourseToggle = (course: string) => {
    setFormData(prev => ({
      ...prev,
      enrolledCourses: prev.enrolledCourses.includes(course)
        ? prev.enrolledCourses.filter(c => c !== course)
        : [...prev.enrolledCourses, course]
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Student Registration Form...");
    setLoading(true);
    try {
      console.log("Payload:", formData);
      const res = await api.post("/students/create", formData);
      console.log("Server Response:", res.data);
      router.push("/admin/students");
    } catch (err: any) {
      console.error("Error creating student:", err);
      console.error("Error Details:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error creating student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-6">
        <Link href="/admin/students">
          <Button variant="outline" className="w-12 h-12 p-0 rounded-2xl border-navy/10 bg-white hover:bg-navy hover:text-white transition-all">
            <ArrowLeft size={20} />
          </Button>
        </Link>
        <div>
          <h1 className="font-display text-4xl font-black text-navy leading-tight">
            Register New <span className="text-primary italic">Student</span>
          </h1>
          <p className="text-navy/60 mt-1 uppercase text-[10px] font-black tracking-widest">Onboard a new learner to Edusparks database</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image & Account */}
        <div className="space-y-8">
          <Card className="p-8 text-center space-y-6 bg-white/80 border-white">
            <div className="relative inline-block">
              <div className="w-40 h-40 rounded-[2.5rem] bg-navy/5 border-4 border-white shadow-xl overflow-hidden flex items-center justify-center mx-auto">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Camera size={48} className="text-navy/20" />
                )}
              </div>
              <label className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-white">
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                <Camera size={20} />
              </label>
            </div>
            <div>
              <h3 className="font-bold text-navy text-lg">Profile Identity</h3>
              <p className="text-xs text-navy/40 font-medium">Upload a clear passport size photograph.</p>
            </div>
          </Card>

          <Card className="p-8 space-y-6 bg-white/80 border-white">
            <h3 className="font-black text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-4 flex items-center gap-2">
              <ShieldCheck size={18} className="text-primary" /> Login Credentials
            </h3>
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
                  <input required type="text" placeholder="johndoe_24" className="w-full h-12 bg-white rounded-xl pl-12 pr-4 outline-none border-2 border-transparent focus:border-primary/20 transition-all font-bold text-sm text-navy" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Security Key (Pass)</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
                  <input required type="password" placeholder="••••••••" className="w-full h-12 bg-white rounded-xl pl-12 pr-4 outline-none border-2 border-transparent focus:border-primary/20 transition-all font-bold text-sm text-navy" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Columns: Personal & Academic Info */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="p-8 space-y-8 bg-white/80 border-white">
            <div>
              <h3 className="font-black text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-4 flex items-center gap-2">
                <User size={18} className="text-primary" /> Personal Information
              </h3>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Full Legal Name</label>
                  <input required type="text" placeholder="Johnathan Doe" className="w-full h-12 bg-navy/5 rounded-xl px-4 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-sm text-navy" value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Contact Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
                    <input required type="tel" placeholder="+91 98765 43210" className="w-full h-12 bg-navy/5 rounded-xl pl-12 pr-4 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-sm text-navy" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Parent/Guardian Name</label>
                  <input required type="text" placeholder="Robert Doe" className="w-full h-12 bg-navy/5 rounded-xl px-4 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-sm text-navy" value={formData.parentName} onChange={(e) => setFormData({...formData, parentName: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Parent Emergency Contact</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/20" size={18} />
                    <input required type="tel" placeholder="+91 98765 43210" className="w-full h-12 bg-navy/5 rounded-xl pl-12 pr-4 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-sm text-navy" value={formData.parentPhone} onChange={(e) => setFormData({...formData, parentPhone: e.target.value})} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-black text-navy text-sm uppercase tracking-widest border-b border-navy/5 pb-4 flex items-center gap-2">
                <Building size={18} className="text-primary" /> Academic Profile
              </h3>
              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Current Class / Target Goal</label>
                  <select className="w-full h-12 bg-navy/5 rounded-xl px-4 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-sm text-navy appearance-none" value={formData.class} onChange={(e) => setFormData({...formData, class: e.target.value})}>
                    <option>Class XII - JEE</option>
                    <option>Class XII - NEET</option>
                    <option>Class XI - Foundation</option>
                    <option>Repeater - JEE</option>
                    <option>Repeater - NEET</option>
                  </select>
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1 block mb-2">Enrolled Subjects</label>
                   <div className="flex flex-wrap gap-2">
                     {courses.map(course => (
                       <button
                         key={course}
                         type="button"
                         onClick={() => handleCourseToggle(course)}
                         className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${
                           formData.enrolledCourses.includes(course)
                             ? "bg-primary text-white shadow-lg"
                             : "bg-navy/5 text-navy/30 hover:bg-navy/10"
                         }`}
                       >
                         {course}
                       </button>
                     ))}
                   </div>
                </div>
              </div>
            </div>

            <div className="pt-8">
              <Button type="submit" disabled={loading} className="w-full h-16 text-xl font-black gap-3 group">
                {loading ? "Registering Student..." : (
                  <>
                    <CheckCircle size={24} /> Complete Registration 
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}
