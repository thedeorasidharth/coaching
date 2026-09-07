"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  ExternalLink,
  Download,
  X,
  RotateCcw,
  SlidersHorizontal,
  CheckCircle2
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import api from "@/lib/axios";
import * as XLSX from "xlsx";
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

interface AnalyticsFilters {
  class: string;
  course: string;
  subject: string;
  timeRange: string;
}

const DEFAULT_FILTERS: AnalyticsFilters = {
  class: "All Classes",
  course: "All Courses",
  subject: "All Subjects",
  timeRange: "all"
};

const CLASS_OPTIONS = ["All Classes", "Class 11", "Class 12", "Dropper", "Class 10", "Class 9"];
const COURSE_OPTIONS = ["All Courses", "JEE", "NEET", "Foundation"];
const SUBJECT_OPTIONS = ["All Subjects", "Physics", "Chemistry", "Mathematics", "Biology"];
const TIME_RANGE_OPTIONS = [
  { label: "All Time", value: "all" },
  { label: "Last 7 Days", value: "7d" },
  { label: "Last 30 Days", value: "30d" },
  { label: "Last 90 Days", value: "90d" },
];

export default function AdminAnalyticsPage() {
  const router = useRouter();
  const [overview, setOverview] = useState<any>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [subjectData, setSubjectData] = useState<any[]>([]);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [weakStudents, setWeakStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [filters, setFilters] = useState<AnalyticsFilters>(DEFAULT_FILTERS);
  const [tempFilters, setTempFilters] = useState<AnalyticsFilters>(DEFAULT_FILTERS);
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Report Download States
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadError, setDownloadError] = useState("");

  const fetchData = useCallback(async (activeFilters: AnalyticsFilters = filters) => {
    try {
      setLoading(true);
      const params: Record<string, string> = {};
      if (activeFilters.class !== "All Classes") params.class = activeFilters.class;
      if (activeFilters.course !== "All Courses") params.course = activeFilters.course;
      if (activeFilters.subject !== "All Subjects") params.subject = activeFilters.subject;
      if (activeFilters.timeRange !== "all") params.timeRange = activeFilters.timeRange;

      const [ovRes, lbRes, subRes, trRes, wkRes] = await Promise.all([
        api.get("/analytics/overview", { params }),
        api.get("/analytics/leaderboard", { params }),
        api.get("/analytics/subjects", { params }),
        api.get("/analytics/trend", { params }),
        api.get("/analytics/weak-students", { params })
      ]);
      setOverview(ovRes.data);
      setLeaderboard(Array.isArray(lbRes.data) ? lbRes.data : []);
      setSubjectData(Array.isArray(subRes.data) ? subRes.data.map((s: any) => ({ name: s._id || "General", value: Math.round(s.avgPercentage || 0) })) : []);
      setTrendData(Array.isArray(trRes.data) ? trRes.data.map((t: any) => ({ name: t._id, score: Math.round(t.avgPercentage || 0) })) : []);
      setWeakStudents(Array.isArray(wkRes.data) ? wkRes.data : []);
    } catch (err) {
      console.error("Error fetching analytics", err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData(filters);
  }, []);

  const activeFilterCount = [
    filters.class !== "All Classes",
    filters.course !== "All Courses",
    filters.subject !== "All Subjects",
    filters.timeRange !== "all"
  ].filter(Boolean).length;

  const handleOpenFilterModal = () => {
    setTempFilters({ ...filters });
    setShowFilterModal(true);
  };

  const handleApplyFilters = () => {
    setFilters({ ...tempFilters });
    setShowFilterModal(false);
    fetchData(tempFilters);
  };

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setTempFilters(DEFAULT_FILTERS);
    setShowFilterModal(false);
    fetchData(DEFAULT_FILTERS);
  };

  const handleRemoveFilter = (key: keyof AnalyticsFilters) => {
    const updated = { ...filters, [key]: DEFAULT_FILTERS[key] };
    setFilters(updated);
    setTempFilters(updated);
    fetchData(updated);
  };

  const handleDownloadAuditReport = async () => {
    if (downloading) return;
    setDownloading(true);
    setDownloadError("");

    try {
      const params: Record<string, string> = {};
      if (filters.class !== "All Classes") params.class = filters.class;
      if (filters.course !== "All Courses") params.course = filters.course;
      if (filters.subject !== "All Subjects") params.subject = filters.subject;
      if (filters.timeRange !== "all") params.timeRange = filters.timeRange;

      const response = await api.get("/analytics/audit-report", { params });
      const data = response.data;

      const wb = XLSX.utils.book_new();

      // 1. Executive Summary Sheet
      const summaryRows = [
        { Parameter: "Report Title", Details: "Institutional Performance Audit Report" },
        { Parameter: "Institute", Details: "EduSpark Excellence Institute" },
        { Parameter: "Report Generated At", Details: new Date().toLocaleString("en-IN") },
        { Parameter: "Target Cohort (Class)", Details: data.filters?.class || filters.class },
        { Parameter: "Academic Stream (Course)", Details: data.filters?.course || filters.course },
        { Parameter: "Subject Focus", Details: data.filters?.subject || filters.subject },
        { Parameter: "Activity Timeframe", Details: TIME_RANGE_OPTIONS.find(t => t.value === filters.timeRange)?.label || filters.timeRange },
        { Parameter: "------------------------", Details: "------------------------" },
        { Parameter: "Total Enrolled Cohort", Details: data.summary?.totalStudents ?? (overview?.totalStudents || 0) },
        { Parameter: "Total Tests Conducted", Details: data.summary?.totalTests ?? 0 },
        { Parameter: "Total Test Submissions", Details: data.summary?.totalAttempts ?? 0 },
        { Parameter: "Average Institutional Accuracy", Details: `${data.summary?.avgPercentage ?? Math.round(overview?.avgMarks || 0)}%` },
        { Parameter: "Highest Score Recorded", Details: data.summary?.highestScore ?? (overview?.highestScore || 0) }
      ];
      const wsSummary = XLSX.utils.json_to_sheet(summaryRows);
      XLSX.utils.book_append_sheet(wb, wsSummary, "Executive Summary");

      // 2. Elite Achievers Sheet
      if (Array.isArray(data.leaderboard) && data.leaderboard.length > 0) {
        const leaderboardRows = data.leaderboard.map((item: any, idx: number) => ({
          Rank: idx + 1,
          "Candidate Name": item.studentName,
          "Mobile Number": item.phone,
          Class: item.class,
          Course: item.course,
          "Accuracy (%)": `${item.avgPercentage}%`,
          "Tests Taken": item.totalTests,
          "Top Score": item.highestScore
        }));
        const wsLeaderboard = XLSX.utils.json_to_sheet(leaderboardRows);
        XLSX.utils.book_append_sheet(wb, wsLeaderboard, "Elite Achievers");
      }

      // 3. Students Requiring Intervention
      if (Array.isArray(data.weakStudents) && data.weakStudents.length > 0) {
        const weakRows = data.weakStudents.map((item: any) => ({
          "Candidate Name": item.studentName,
          "Mobile Number": item.phone,
          Class: item.class,
          Course: item.course,
          "Accuracy (%)": `${item.avgPercentage}%`,
          "Tests Attempted": item.totalTests,
          "Status / Recommendation": "Critical Attention Required (< 40% Accuracy)"
        }));
        const wsWeak = XLSX.utils.json_to_sheet(weakRows);
        XLSX.utils.book_append_sheet(wb, wsWeak, "Intervention Required");
      }

      // 4. Detailed Test Attempt Logs
      if (Array.isArray(data.detailedResults) && data.detailedResults.length > 0) {
        const detailedRows = data.detailedResults.map((item: any) => ({
          "Submission Timestamp": item.date,
          "Candidate Name": item.studentName,
          "Mobile Number": item.phone,
          Class: item.class,
          Course: item.course,
          "Quiz Title": item.quizTitle,
          Subject: item.subject,
          Score: item.score,
          "Max Marks": item.totalMarks,
          "Accuracy (%)": item.percentage,
          "Duration (Minutes)": item.timeTakenMinutes,
          "Correct Answers": item.correctCount,
          "Incorrect Answers": item.incorrectCount,
          "Unattempted Questions": item.unattemptedCount
        }));
        const wsDetailed = XLSX.utils.json_to_sheet(detailedRows);
        XLSX.utils.book_append_sheet(wb, wsDetailed, "Audit Logs (Submissions)");
      }

      const classTag = filters.class !== "All Classes" ? `${filters.class.replace(/\s+/g, '_')}_` : "";
      const courseTag = filters.course !== "All Courses" ? `${filters.course}_` : "";
      const dateTag = new Date().toISOString().split("T")[0];
      const fileName = `EduSpark_Audit_Report_${classTag}${courseTag}${dateTag}.xlsx`;

      XLSX.writeFile(wb, fileName);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err: any) {
      console.error("Error generating audit report:", err);
      setDownloadError(err?.response?.data?.message || "Failed to generate report. Please try again.");
      setTimeout(() => setDownloadError(""), 4000);
    } finally {
      setDownloading(false);
    }
  };

  const COLORS = ["#8B0E2A", "#C9A86A", "#1F2A44", "#2E7D32"];

  if (loading && !overview) return (
    <div className="h-[70vh] flex flex-col items-center justify-center space-y-4">
      <div className="w-14 h-14 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      <p className="font-display text-xl font-black text-navy italic">Generating Global Intelligence...</p>
    </div>
  );

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl font-black text-navy leading-tight">
            Intelligence <span className="text-primary italic">Command Center</span>
          </h1>
          <p className="text-navy/60 mt-1 text-xs sm:text-sm font-bold">Institutional Performance Analytics & Real-Time Student Metrics</p>
          
          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-navy/40">Filters:</span>
              {filters.class !== "All Classes" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                  {filters.class}
                  <button type="button" onClick={() => handleRemoveFilter("class")} className="hover:text-navy transition-colors">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.course !== "All Courses" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-xs font-bold border border-blue-500/20">
                  {filters.course}
                  <button type="button" onClick={() => handleRemoveFilter("course")} className="hover:text-navy transition-colors">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.subject !== "All Subjects" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 text-xs font-bold border border-amber-500/20">
                  {filters.subject}
                  <button type="button" onClick={() => handleRemoveFilter("subject")} className="hover:text-navy transition-colors">
                    <X size={12} />
                  </button>
                </span>
              )}
              {filters.timeRange !== "all" && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy/10 text-navy text-xs font-bold border border-navy/20">
                  {TIME_RANGE_OPTIONS.find(t => t.value === filters.timeRange)?.label}
                  <button type="button" onClick={() => handleRemoveFilter("timeRange")} className="hover:text-navy transition-colors">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={handleResetFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline ml-1"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button 
            type="button"
            variant="outline" 
            onClick={handleOpenFilterModal}
            className={`h-11 px-4 gap-2 text-xs transition-all ${
              activeFilterCount > 0 ? "border-primary text-primary bg-primary/5 font-black shadow-sm" : ""
            }`}
          >
            <Filter size={16} className={activeFilterCount > 0 ? "text-primary" : ""} />
            <span>Advanced Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-primary text-white text-[10px] flex items-center justify-center font-bold shrink-0">
                {activeFilterCount}
              </span>
            )}
          </Button>

          <Button 
            type="button"
            variant="navy" 
            onClick={handleDownloadAuditReport}
            disabled={downloading}
            className="h-11 px-5 gap-2 text-xs transition-all"
          >
            {downloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                <span>Generating Report...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                <span>Report Downloaded!</span>
              </>
            ) : (
              <>
                <Download size={16} className="shrink-0" />
                <span>Download Audit Report</span>
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Download Error Alert (if any) */}
      <AnimatePresence>
        {downloadError && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 font-bold text-xs flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} />
              <span>{downloadError}</span>
            </div>
            <button type="button" onClick={() => setDownloadError("")} className="hover:text-red-800">
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Advanced Filters Modal */}
      <AnimatePresence>
        {showFilterModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-navy/10 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-navy/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <SlidersHorizontal size={20} />
                  </div>
                  <div>
                    <h3 className="font-display font-black text-xl text-navy">Advanced Analytics Filters</h3>
                    <p className="text-xs font-medium text-navy/50">Filter institutional intelligence by cohort and timeline</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilterModal(false)}
                  className="p-2 rounded-xl text-navy/40 hover:text-navy hover:bg-navy/5 transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Filter Controls Grid */}
              <div className="py-6 space-y-5">
                {/* Class / Standard */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-navy/60">
                    Cohort / Class
                  </label>
                  <select
                    value={tempFilters.class}
                    onChange={(e) => setTempFilters({ ...tempFilters, class: e.target.value })}
                    className="w-full h-12 px-4 bg-navy/5 border border-navy/10 rounded-2xl text-navy font-bold text-sm outline-none focus:bg-white focus:border-primary/40 transition-all cursor-pointer"
                  >
                    {CLASS_OPTIONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Course / Stream */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-navy/60">
                    Target Examination Stream
                  </label>
                  <select
                    value={tempFilters.course}
                    onChange={(e) => setTempFilters({ ...tempFilters, course: e.target.value })}
                    className="w-full h-12 px-4 bg-navy/5 border border-navy/10 rounded-2xl text-navy font-bold text-sm outline-none focus:bg-white focus:border-primary/40 transition-all cursor-pointer"
                  >
                    {COURSE_OPTIONS.map((cr) => (
                      <option key={cr} value={cr}>{cr}</option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-navy/60">
                    Academic Subject
                  </label>
                  <select
                    value={tempFilters.subject}
                    onChange={(e) => setTempFilters({ ...tempFilters, subject: e.target.value })}
                    className="w-full h-12 px-4 bg-navy/5 border border-navy/10 rounded-2xl text-navy font-bold text-sm outline-none focus:bg-white focus:border-primary/40 transition-all cursor-pointer"
                  >
                    {SUBJECT_OPTIONS.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Timeframe */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-black uppercase tracking-wider text-navy/60">
                    Activity Timeframe
                  </label>
                  <select
                    value={tempFilters.timeRange}
                    onChange={(e) => setTempFilters({ ...tempFilters, timeRange: e.target.value })}
                    className="w-full h-12 px-4 bg-navy/5 border border-navy/10 rounded-2xl text-navy font-bold text-sm outline-none focus:bg-white focus:border-primary/40 transition-all cursor-pointer"
                  >
                    {TIME_RANGE_OPTIONS.map((tr) => (
                      <option key={tr.value} value={tr.value}>{tr.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-between pt-5 border-t border-navy/5 gap-3">
                <button
                  type="button"
                  onClick={() => setTempFilters(DEFAULT_FILTERS)}
                  className="flex items-center gap-1.5 text-xs font-bold text-navy/50 hover:text-navy transition-colors px-2 py-1"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilterModal(false)}
                    className="h-10 px-4 text-xs font-bold"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={handleApplyFilters}
                    className="h-10 px-5 text-xs font-bold"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
              {trendData.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-navy/40 font-medium italic">
                  No activity records found for the selected timeframe.
                </div>
              ) : (
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
              )}
            </div>
         </Card>

         {/* Pie Chart: Subject Distribution */}
         <Card className="p-6 sm:p-8 bg-white border-white shadow-xl flex flex-col justify-between">
            <h3 className="font-bold text-xl sm:text-2xl text-navy mb-6">Subject <span className="text-primary italic">Efficiency</span></h3>
            <div className="h-[240px] w-full flex-1">
              {subjectData.length === 0 ? (
                <div className="h-full w-full flex items-center justify-center text-navy/40 font-medium italic text-xs">
                  No subject attempt data found for the selected filter.
                </div>
              ) : (
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
              )}
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
                        {leaderboard.length === 0 ? (
                           <tr>
                              <td colSpan={4} className="px-6 py-10 text-center text-navy/40 font-medium italic text-xs">
                                 No candidate records match the selected filter criteria.
                              </td>
                           </tr>
                        ) : (
                           leaderboard.map((item, i) => (
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
                        )))}
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
                     <Card className="p-4 sm:p-5 bg-white border-white shadow-xl hover:border-red-500/20 transition-all">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full">
                           <div className="flex items-center gap-3.5 min-w-0 flex-1">
                              <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center shrink-0">
                                 <AlertTriangle size={22} />
                              </div>
                              <div className="min-w-0 flex-1">
                                 <h4 className="font-bold text-navy text-base truncate" title={item.student?.fullName || "Student"}>
                                    {item.student?.fullName || "Student"}
                                 </h4>
                                 <p className="text-xs font-bold text-navy/60 truncate mt-0.5">
                                   Average: <span className="text-red-600 font-black">{Math.round(item.avgPercentage)}%</span> • {item.totalTests} Tests
                                 </p>
                              </div>
                           </div>

                           <div className="shrink-0 flex items-center sm:self-center">
                              {item.student?._id ? (
                                <Link href={`/admin/students/${item.student._id}`} className="block w-full sm:w-auto">
                                  <Button 
                                    type="button" 
                                    variant="destructive" 
                                    size="sm" 
                                    className="h-9 px-4 text-xs font-bold whitespace-nowrap w-full sm:w-auto"
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
                                  className="h-9 px-4 text-xs font-bold whitespace-nowrap w-full sm:w-auto"
                                >
                                   Profile Unavailable
                                </Button>
                              )}
                           </div>
                        </div>
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
