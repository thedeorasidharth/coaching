"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Settings, 
  CheckCircle, 
  ArrowLeft, 
  BookOpen, 
  Clock, 
  Copy, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  AlertTriangle, 
  X, 
  Check, 
  ChevronUp, 
  ChevronDown,
  Layers,
  Calendar,
  HelpCircle,
  Award,
  Sparkles
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as XLSX from "xlsx";

interface TestBuilderFormProps {
  initialData?: any;
  isEdit?: boolean;
  onSubmit: (data: any) => Promise<void>;
}

const formatForDateTimeLocal = (dateVal?: string | Date) => {
  if (!dateVal) return "";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "";
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export function TestBuilderForm({ initialData, isEdit = false, onSubmit }: TestBuilderFormProps) {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [quizData, setQuizData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    testType: initialData?.testType || "Full Test",
    examType: initialData?.examType || "JEE",
    targetClass: initialData?.targetClass || "Class 12",
    subject: initialData?.subject || "Physics",
    class: initialData?.class || "Class 12",
    duration: initialData?.duration || 60,
    published: initialData?.published || false,
    startDate: formatForDateTimeLocal(initialData?.startDate),
    endDate: formatForDateTimeLocal(initialData?.endDate),
    questions: initialData?.questions?.length > 0 ? initialData.questions : [
      { 
        question: "", 
        options: ["", "", "", ""], 
        correctAnswer: 0, 
        marks: 4,
        negativeMarks: 1,
        subject: "Physics",
        chapter: "",
        explanation: ""
      }
    ]
  });

  // Excel Modal States
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [parsedQuestions, setParsedQuestions] = useState<any[]>([]);
  const [excelErrors, setExcelErrors] = useState<string[]>([]);
  const [excelFileName, setExcelFileName] = useState("");

  // Question Management
  const addQuestion = () => {
    setQuizData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { 
          question: "", 
          options: ["", "", "", ""], 
          correctAnswer: 0, 
          marks: 4,
          negativeMarks: 1,
          subject: prev.subject || "Physics",
          chapter: "",
          explanation: ""
        }
      ]
    }));
  };

  const removeQuestion = (idx: number) => {
    if (quizData.questions.length <= 1) {
      alert("A test must contain at least one question.");
      return;
    }
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter((_: any, i: number) => i !== idx)
    }));
  };

  const duplicateQuestion = (idx: number) => {
    const targetQ = quizData.questions[idx];
    const newQ = JSON.parse(JSON.stringify(targetQ));
    const newQuestions = [...quizData.questions];
    newQuestions.splice(idx + 1, 0, newQ);
    setQuizData(prev => ({ ...prev, questions: newQuestions }));
  };

  const moveQuestion = (idx: number, direction: "up" | "down") => {
    if ((direction === "up" && idx === 0) || (direction === "down" && idx === quizData.questions.length - 1)) return;
    const targetIdx = direction === "up" ? idx - 1 : idx + 1;
    const newQs = [...quizData.questions];
    const temp = newQs[idx];
    newQs[idx] = newQs[targetIdx];
    newQs[targetIdx] = temp;
    setQuizData(prev => ({ ...prev, questions: newQs }));
  };

  const updateQuestion = (idx: number, field: string, value: any) => {
    const newQs = [...quizData.questions];
    (newQs[idx] as any)[field] = value;
    setQuizData(prev => ({ ...prev, questions: newQs }));
  };

  const updateOption = (qIdx: number, oIdx: number, value: string) => {
    const newQs = [...quizData.questions];
    newQs[qIdx].options[oIdx] = value;
    setQuizData(prev => ({ ...prev, questions: newQs }));
  };

  const calculateTotalMarks = () => {
    return quizData.questions.reduce((acc: number, q: any) => acc + (Number(q.marks) || 4), 0);
  };

  // EXCEL TEMPLATE GENERATOR
  const downloadExcelTemplate = () => {
    const templateData = [
      {
        question: "An object is thrown vertically upwards with velocity 20m/s. Maximum height reached is? (g=10m/s^2)",
        optionA: "10m",
        optionB: "20m",
        optionC: "30m",
        optionD: "40m",
        correctAnswer: "B",
        marks: 4,
        negativeMarks: 1,
        subject: "Physics",
        chapter: "Kinematics",
        explanation: "H = u^2 / (2g) = 400 / 20 = 20m"
      },
      {
        question: "Which of the following elements has the highest electronegativity?",
        optionA: "Oxygen",
        optionB: "Fluorine",
        optionC: "Chlorine",
        optionD: "Nitrogen",
        correctAnswer: "B",
        marks: 4,
        negativeMarks: 1,
        subject: "Chemistry",
        chapter: "Periodic Properties",
        explanation: "Fluorine is the most electronegative element (Pauling scale 4.0)."
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Questions Template");
    XLSX.writeFile(workbook, "EduSpark_Test_Questions_Template.xlsx");
  };

  // EXCEL FILE PARSER & VALIDATOR
  const handleExcelFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setExcelFileName(file.name);
    setExcelErrors([]);
    setParsedQuestions([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: "binary" });
        const wsname = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[wsname];
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rawData || rawData.length === 0) {
          setExcelErrors(["Excel sheet is empty or invalid."]);
          setShowExcelModal(true);
          return;
        }

        const errors: string[] = [];
        const validQs: any[] = [];

        rawData.forEach((row: any, rIdx: number) => {
          const rowNum = rIdx + 2;

          const questionText = row.question || row.Question || "";
          const optA = row.optionA || row.OptionA || row["option A"] || "";
          const optB = row.optionB || row.OptionB || row["option B"] || "";
          const optC = row.optionC || row.OptionC || row["option C"] || "";
          const optD = row.optionD || row.OptionD || row["option D"] || "";
          const rawAnswer = String(row.correctAnswer || row.CorrectAnswer || row["correct answer"] || "").trim().toUpperCase();
          const marksVal = Number(row.marks ?? 4);
          const negMarksVal = Number(row.negativeMarks ?? 1);
          const subjVal = String(row.subject || quizData.subject || "Physics").trim();
          const chapVal = String(row.chapter || "").trim();
          const expVal = String(row.explanation || "").trim();

          if (!questionText || String(questionText).trim() === "") {
            errors.push(`Row ${rowNum}: Question text is missing.`);
          }

          if (!optA || !optB || !optC || !optD) {
            errors.push(`Row ${rowNum}: All 4 options (optionA, optionB, optionC, optionD) must be non-empty.`);
          }

          let correctIdx = -1;
          if (["A", "0", "OPTION A"].includes(rawAnswer)) correctIdx = 0;
          else if (["B", "1", "OPTION B"].includes(rawAnswer)) correctIdx = 1;
          else if (["C", "2", "OPTION C"].includes(rawAnswer)) correctIdx = 2;
          else if (["D", "3", "OPTION D"].includes(rawAnswer)) correctIdx = 3;
          else {
            errors.push(`Row ${rowNum}: correctAnswer must be 'A', 'B', 'C', or 'D' (or 0, 1, 2, 3). Got: "${rawAnswer}".`);
          }

          if (isNaN(marksVal) || marksVal < 0) {
            errors.push(`Row ${rowNum}: Marks must be a non-negative number.`);
          }

          if (isNaN(negMarksVal) || negMarksVal < 0) {
            errors.push(`Row ${rowNum}: Negative marks must be a non-negative number.`);
          }

          if (errors.length === 0 || errors.filter(e => e.startsWith(`Row ${rowNum}`)).length === 0) {
            validQs.push({
              question: String(questionText).trim(),
              options: [String(optA).trim(), String(optB).trim(), String(optC).trim(), String(optD).trim()],
              correctAnswer: correctIdx >= 0 ? correctIdx : 0,
              marks: isNaN(marksVal) ? 4 : marksVal,
              negativeMarks: isNaN(negMarksVal) ? 1 : negMarksVal,
              subject: subjVal,
              chapter: chapVal,
              explanation: expVal
            });
          }
        });

        setExcelErrors(errors);
        setParsedQuestions(validQs);
        setShowExcelModal(true);
      } catch (err) {
        setExcelErrors(["Failed to parse Excel file. Please make sure it is a valid .xlsx or .xls file."]);
        setShowExcelModal(true);
      }
    };
    reader.readAsBinaryString(file);
    e.target.value = "";
  };

  const confirmExcelImport = () => {
    if (parsedQuestions.length > 0) {
      setQuizData(prev => ({
        ...prev,
        questions: [...prev.questions.filter((q: any) => q.question.trim() !== ""), ...parsedQuestions]
      }));
      setShowExcelModal(false);
      setParsedQuestions([]);
      setExcelErrors([]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!quizData.title.trim()) {
      setFormError("Test Title is required.");
      setActiveStep(1);
      return;
    }

    if (!quizData.duration || quizData.duration <= 0) {
      setFormError("Test Duration must be a positive number of minutes.");
      setActiveStep(1);
      return;
    }

    if (quizData.startDate && quizData.endDate && new Date(quizData.endDate) <= new Date(quizData.startDate)) {
      setFormError("End Date & Time must be strictly after Start Date & Time.");
      setActiveStep(2);
      return;
    }

    if (quizData.questions.length === 0) {
      setFormError("Test must contain at least one question.");
      setActiveStep(3);
      return;
    }

    for (let i = 0; i < quizData.questions.length; i++) {
      const q = quizData.questions[i];
      if (!q.question.trim()) {
        setFormError(`Question #${i + 1} text is empty.`);
        setActiveStep(3);
        return;
      }
      if (q.options.some((o: string) => !o.trim())) {
        setFormError(`Question #${i + 1} has empty options.`);
        setActiveStep(3);
        return;
      }
    }

    setLoading(true);
    try {
      const formatToISO = (dateStr?: string) => {
        if (!dateStr) return undefined;
        const d = new Date(dateStr);
        return isNaN(d.getTime()) ? undefined : d.toISOString();
      };

      await onSubmit({
        ...quizData,
        startDate: formatToISO(quizData.startDate),
        endDate: formatToISO(quizData.endDate),
        class: quizData.targetClass,
        totalQuestions: quizData.questions.length,
        totalMarks: calculateTotalMarks()
      });
      router.push("/admin/tests");
    } catch (err: any) {
      setFormError(err.response?.data?.message || err.message || "Error saving assessment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-10 pb-20 w-full">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="/admin/tests">
            <Button variant="outline" className="w-10 h-10 sm:w-12 sm:h-12 p-0 rounded-2xl border-navy/10 bg-white hover:bg-navy hover:text-white transition-all shrink-0">
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <div>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-navy leading-tight">
              {isEdit ? "Edit" : "Create"} <span className="text-primary italic">Test Series</span>
            </h1>
            <p className="text-navy/40 mt-0.5 uppercase text-[9px] sm:text-[10px] font-black tracking-widest italic">NEET / JEE Exam Builder</p>
          </div>
        </div>

        {/* Step Indicator Tabs */}
        <div className="flex bg-white p-1 rounded-2xl shadow-lg border border-navy/5 w-full sm:w-auto overflow-x-auto">
          <button 
            type="button"
            onClick={() => setActiveStep(1)} 
            className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase transition-all whitespace-nowrap ${activeStep === 1 ? 'bg-primary text-white shadow-md' : 'text-navy/40 hover:text-navy'}`}
          >
            1. Basic Info
          </button>
          <button 
            type="button"
            onClick={() => setActiveStep(2)} 
            className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase transition-all whitespace-nowrap ${activeStep === 2 ? 'bg-primary text-white shadow-md' : 'text-navy/40 hover:text-navy'}`}
          >
            2. Schedule
          </button>
          <button 
            type="button"
            onClick={() => setActiveStep(3)} 
            className={`flex-1 sm:flex-initial px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase transition-all whitespace-nowrap ${activeStep === 3 ? 'bg-primary text-white shadow-md' : 'text-navy/40 hover:text-navy'}`}
          >
            3. Questions ({quizData.questions.length})
          </button>
        </div>
      </div>

      {formError && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-600 font-bold text-sm flex items-center gap-3">
          <AlertTriangle size={20} className="shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      <form onSubmit={handleFormSubmit} className="space-y-8 sm:space-y-10">
        {/* STICKY TOP ACTION BAR */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border border-navy/10 py-3 px-4 sm:px-6 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-3 transition-all">
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/tests">
              <Button type="button" variant="outline" size="sm" className="h-9 px-3 text-xs font-bold gap-1.5 border-navy/10 shrink-0">
                <ArrowLeft size={14} /> Back
              </Button>
            </Link>
            <div className="min-w-0">
              <h4 className="font-bold text-navy text-sm leading-none truncate max-w-[180px] sm:max-w-md">
                {quizData.title || "Untitled Assessment"}
              </h4>
              <p className="text-[10px] font-black text-navy/40 uppercase tracking-widest mt-0.5">
                {quizData.examType} • {quizData.targetClass} • {quizData.questions.length} Questions ({calculateTotalMarks()} Marks)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end shrink-0">
            {activeStep > 1 && (
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setActiveStep(prev => prev - 1)} 
                className="h-10 px-4 font-bold text-xs border-navy/10"
              >
                ← Back
              </Button>
            )}
            {activeStep < 3 && (
              <Button 
                type="button" 
                size="sm"
                onClick={() => setActiveStep(prev => prev + 1)} 
                className="h-10 px-5 font-bold text-xs bg-navy text-white hover:bg-navy/90"
              >
                Next →
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={loading} 
              size="sm"
              className="h-10 px-6 text-xs font-black gap-2 bg-primary hover:bg-primary/90 text-white shadow-md rounded-xl"
            >
              {loading ? "Saving..." : (
                <>
                  <CheckCircle size={16} /> {isEdit ? "Save Changes" : "Save & Finalize Test"}
                </>
              )}
            </Button>
          </div>
        </div>
        {/* STEP 1: BASIC INFORMATION */}
        {activeStep === 1 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card className="p-6 sm:p-10 space-y-6 sm:space-y-8 bg-white border-white shadow-2xl rounded-[2rem] sm:rounded-[2.5rem]">
              <div className="flex items-center gap-3 border-b border-navy/5 pb-4">
                <BookOpen size={22} className="text-primary shrink-0" />
                <h3 className="font-black text-navy text-base sm:text-lg uppercase tracking-wider">Test Configuration & Profile</h3>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Assessment Title *</label>
                  <input 
                    required 
                    type="text" 
                    placeholder="e.g. NEET 2026 Full Syllabus Mock Test #1"
                    className="w-full h-12 sm:h-14 bg-navy/5 rounded-2xl px-4 sm:px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy text-lg sm:text-xl"
                    value={quizData.title}
                    onChange={(e) => setQuizData({ ...quizData, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Instructions / Description</label>
                  <textarea 
                    placeholder="Provide exam instructions, negative marking guidelines, or subject instructions..."
                    className="w-full h-28 bg-navy/5 rounded-2xl p-4 sm:p-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-medium text-navy/70 text-sm resize-none"
                    value={quizData.description}
                    onChange={(e) => setQuizData({ ...quizData, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Test Format / Type</label>
                    <select 
                      className="w-full h-12 sm:h-14 bg-navy/5 rounded-2xl px-4 sm:px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy appearance-none text-sm"
                      value={quizData.testType}
                      onChange={(e) => setQuizData({ ...quizData, testType: e.target.value })}
                    >
                      <option value="Full Test">Full Test</option>
                      <option value="Chapter Test">Chapter Test</option>
                      <option value="Subject Test">Subject Test</option>
                      <option value="Practice Test">Practice Test</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Exam Profile Target</label>
                    <select 
                      className="w-full h-12 sm:h-14 bg-navy/5 rounded-2xl px-4 sm:px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy appearance-none text-sm"
                      value={quizData.examType}
                      onChange={(e) => setQuizData({ ...quizData, examType: e.target.value })}
                    >
                      <option value="JEE">JEE (Main & Advanced)</option>
                      <option value="NEET">NEET (UG)</option>
                      <option value="Foundation">Foundation</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Target Batch / Class</label>
                    <select 
                      className="w-full h-12 sm:h-14 bg-navy/5 rounded-2xl px-4 sm:px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy appearance-none text-sm"
                      value={quizData.targetClass}
                      onChange={(e) => setQuizData({ ...quizData, targetClass: e.target.value, class: e.target.value })}
                    >
                      <option value="Class 11">Class 11</option>
                      <option value="Class 12">Class 12</option>
                      <option value="Dropper">Dropper / Repeater</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Default Primary Subject</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Physics, Chemistry, All Subjects"
                      className="w-full h-12 sm:h-14 bg-navy/5 rounded-2xl px-4 sm:px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy text-sm"
                      value={quizData.subject}
                      onChange={(e) => setQuizData({ ...quizData, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Duration (Minutes) *</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-navy/30" size={18} />
                      <input 
                        required 
                        type="number" 
                        min="1"
                        className="w-full h-12 sm:h-14 bg-navy/5 rounded-2xl pl-12 pr-4 sm:pr-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy text-sm"
                        value={quizData.duration}
                        onChange={(e) => setQuizData({ ...quizData, duration: parseInt(e.target.value) || 60 })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-navy/5 flex justify-end">
                <Button type="button" onClick={() => setActiveStep(2)} className="w-full sm:w-auto h-12 sm:h-14 px-8 font-bold text-sm sm:text-base">
                  Proceed to Schedule & Status →
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* STEP 2: AVAILABILITY & SCHEDULE */}
        {activeStep === 2 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <Card className="p-6 sm:p-10 space-y-6 sm:space-y-8 bg-white border-white shadow-2xl rounded-[2rem] sm:rounded-[2.5rem]">
              <div className="flex items-center gap-3 border-b border-navy/5 pb-4">
                <Calendar size={22} className="text-primary shrink-0" />
                <h3 className="font-black text-navy text-base sm:text-lg uppercase tracking-wider">Test Publishing & Schedule Windows</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
                {/* Draft vs Published Toggle */}
                <div 
                  onClick={() => setQuizData({ ...quizData, published: false })}
                  className={`p-5 sm:p-6 rounded-3xl border-4 cursor-pointer transition-all ${!quizData.published ? 'border-navy bg-navy/5' : 'border-navy/10 bg-white hover:border-navy/20'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-navy uppercase text-xs sm:text-sm tracking-wider">Save as Draft</span>
                    {!quizData.published && <CheckCircle className="text-navy shrink-0" size={22} />}
                  </div>
                  <p className="text-xs text-navy/60 mt-2 font-medium">Test will remain hidden from students and only visible to Admin.</p>
                </div>

                <div 
                  onClick={() => setQuizData({ ...quizData, published: true })}
                  className={`p-5 sm:p-6 rounded-3xl border-4 cursor-pointer transition-all ${quizData.published ? 'border-green-500 bg-green-500/5' : 'border-navy/10 bg-white hover:border-green-500/30'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-green-600 uppercase text-xs sm:text-sm tracking-wider">Publish Assessment</span>
                    {quizData.published && <CheckCircle className="text-green-500 shrink-0" size={22} />}
                  </div>
                  <p className="text-xs text-navy/60 mt-2 font-medium">Test will be live & accessible for eligible students within configured schedule windows.</p>
                </div>
              </div>

              <div className="space-y-6 pt-4 border-t border-navy/5">
                <h4 className="font-bold text-navy text-xs sm:text-sm uppercase tracking-widest">Schedule Availability Window (Optional)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Start Date & Time</label>
                    <input 
                      type="datetime-local" 
                      className="w-full h-12 sm:h-14 bg-navy/5 rounded-2xl px-4 sm:px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy text-xs sm:text-sm"
                      value={quizData.startDate}
                      onChange={(e) => setQuizData({ ...quizData, startDate: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">End Date & Time</label>
                    <input 
                      type="datetime-local" 
                      className="w-full h-12 sm:h-14 bg-navy/5 rounded-2xl px-4 sm:px-6 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy text-xs sm:text-sm"
                      value={quizData.endDate}
                      onChange={(e) => setQuizData({ ...quizData, endDate: e.target.value })}
                    />
                  </div>
                </div>
                <p className="text-xs text-navy/40 italic font-medium">If left empty, test will be available indefinitely when published.</p>
              </div>

              <div className="pt-6 border-t border-navy/5 flex flex-col sm:flex-row justify-between gap-3">
                <Button type="button" variant="outline" onClick={() => setActiveStep(1)} className="h-12 sm:h-14 px-8 font-bold text-xs sm:text-base">
                  ← Back to Basic Info
                </Button>
                <Button type="button" onClick={() => setActiveStep(3)} className="h-12 sm:h-14 px-8 font-bold text-xs sm:text-base">
                  Proceed to Questions Builder →
                </Button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* STEP 3: QUESTIONS BUILDER */}
        {activeStep === 3 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Action Bar for Excel Import & Template */}
            <Card className="p-6 sm:p-8 bg-white border-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 rounded-[2rem] sm:rounded-[2.5rem]">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-navy flex items-center gap-3">
                  <FileSpreadsheet className="text-green-600 shrink-0" size={24} /> Excel Question Integration
                </h3>
                <p className="text-xs text-navy/60 mt-1 font-medium">Bulk import questions or manage questions manually below.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={downloadExcelTemplate}
                  className="h-12 px-6 gap-2 border-green-600/30 text-green-700 hover:bg-green-50 rounded-2xl font-bold text-xs uppercase w-full sm:w-auto"
                >
                  <Download size={18} /> Download Template
                </Button>
                <label className="w-full sm:w-auto">
                  <span className="h-12 px-6 gap-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-bold text-xs uppercase flex items-center justify-center cursor-pointer shadow-lg shadow-green-600/20 transition-all w-full sm:w-auto">
                    <Upload size={18} /> Import Excel File
                  </span>
                  <input 
                    type="file" 
                    accept=".xlsx, .xls" 
                    className="hidden" 
                    onChange={handleExcelFileUpload} 
                  />
                </label>
              </div>
            </Card>

            {/* Questions Summary Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-2 sm:px-4">
              <h3 className="text-xl sm:text-2xl font-black text-navy">
                Questions List ({quizData.questions.length})
              </h3>
              <div>
                <span className="text-xs font-black uppercase text-navy/40 tracking-widest">Total Weightage: </span>
                <span className="text-xl sm:text-2xl font-black text-primary italic">{calculateTotalMarks()} Marks</span>
              </div>
            </div>

            {/* Questions Cards List */}
            <div className="space-y-6 sm:space-y-8">
              <AnimatePresence>
                {quizData.questions.map((q: any, qIdx: number) => (
                  <motion.div
                    key={qIdx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: qIdx * 0.05 }}
                  >
                    <Card className="p-6 sm:p-8 space-y-6 bg-white border-white shadow-xl relative group/q border-l-8 border-l-navy hover:border-l-primary transition-all duration-300 rounded-[2rem]">
                      {/* Top Header Card Controls */}
                      <div className="flex items-center justify-between border-b border-navy/5 pb-4">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 sm:w-10 sm:h-10 bg-navy text-white rounded-xl flex items-center justify-center font-black italic text-xs sm:text-sm shadow-md">
                            {qIdx + 1}
                          </span>
                          <span className="text-xs font-black text-navy/40 uppercase tracking-widest">Question #{qIdx + 1}</span>
                        </div>

                        <div className="flex items-center gap-1 sm:gap-2">
                          <button 
                            type="button" 
                            onClick={() => moveQuestion(qIdx, "up")}
                            disabled={qIdx === 0}
                            title="Move Up"
                            className="p-1.5 sm:p-2 text-navy/30 hover:text-navy disabled:opacity-20 transition-all"
                          >
                            <ChevronUp size={18} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => moveQuestion(qIdx, "down")}
                            disabled={qIdx === quizData.questions.length - 1}
                            title="Move Down"
                            className="p-1.5 sm:p-2 text-navy/30 hover:text-navy disabled:opacity-20 transition-all"
                          >
                            <ChevronDown size={18} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => duplicateQuestion(qIdx)}
                            title="Duplicate Question"
                            className="p-1.5 sm:p-2 text-navy/30 hover:text-primary transition-all"
                          >
                            <Copy size={16} />
                          </button>
                          <button 
                            type="button" 
                            onClick={() => removeQuestion(qIdx)}
                            title="Delete Question"
                            className="p-1.5 sm:p-2 text-navy/30 hover:text-red-500 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Question Text & Marks */}
                      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        <div className="lg:col-span-3 space-y-1">
                          <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Question Statement *</label>
                          <textarea 
                            required 
                            rows={3}
                            placeholder="Enter the complete question text..."
                            className="w-full bg-navy/5 rounded-2xl p-4 outline-none border-2 border-transparent focus:bg-white focus:border-primary/20 transition-all font-bold text-navy text-sm sm:text-base resize-none"
                            value={q.question}
                            onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                          />
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Positive (+Marks)</label>
                            <input 
                              type="number" 
                              min="0"
                              className="w-full h-11 bg-navy/5 rounded-xl px-4 outline-none font-bold text-navy text-xs sm:text-sm"
                              value={q.marks}
                              onChange={(e) => updateQuestion(qIdx, "marks", parseInt(e.target.value) || 4)}
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Negative (-Marks)</label>
                            <input 
                              type="number" 
                              min="0"
                              className="w-full h-11 bg-navy/5 rounded-xl px-4 outline-none font-bold text-navy text-xs sm:text-sm"
                              value={q.negativeMarks}
                              onChange={(e) => updateQuestion(qIdx, "negativeMarks", parseInt(e.target.value) || 1)}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Subject & Chapter Attributes */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Question Subject</label>
                          <input 
                            type="text" 
                            placeholder="Physics, Chemistry, Mathematics, Biology..."
                            className="w-full h-11 bg-navy/5 rounded-xl px-4 outline-none font-bold text-navy text-xs"
                            value={q.subject}
                            onChange={(e) => updateQuestion(qIdx, "subject", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Chapter Tag</label>
                          <input 
                            type="text" 
                            placeholder="e.g. Thermodynamics, Organic Chemistry..."
                            className="w-full h-11 bg-navy/5 rounded-xl px-4 outline-none font-bold text-navy text-xs"
                            value={q.chapter}
                            onChange={(e) => updateQuestion(qIdx, "chapter", e.target.value)}
                          />
                        </div>
                      </div>

                      {/* 4 Options Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        {q.options.map((opt: string, oIdx: number) => (
                          <div key={oIdx} className="space-y-1">
                            <div className="flex justify-between items-center ml-1">
                              <span className="text-[10px] font-black text-navy/40 uppercase tracking-widest">Option {String.fromCharCode(65 + oIdx)}</span>
                              <button 
                                type="button" 
                                onClick={() => updateQuestion(qIdx, "correctAnswer", oIdx)}
                                className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full transition-all ${
                                  q.correctAnswer === oIdx ? "bg-green-500 text-white" : "bg-navy/5 text-navy/30 hover:bg-navy/10"
                                }`}
                              >
                                {q.correctAnswer === oIdx ? "✓ Correct Answer" : "Set Correct"}
                              </button>
                            </div>
                            <input 
                              required 
                              type="text" 
                              placeholder={`Option ${String.fromCharCode(65 + oIdx)} text...`}
                              className={`w-full h-12 rounded-xl px-4 outline-none border-2 transition-all font-bold text-navy text-xs sm:text-sm ${
                                q.correctAnswer === oIdx 
                                  ? "border-green-500 bg-green-500/5" 
                                  : "border-transparent bg-navy/5 focus:bg-white focus:border-primary/20"
                              }`}
                              value={opt}
                              onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Explanation Field */}
                      <div className="space-y-1 pt-2">
                        <label className="text-[10px] font-black text-navy/40 uppercase tracking-widest ml-1">Explanation / Solution Text (Optional)</label>
                        <textarea 
                          rows={2}
                          placeholder="Provide step-by-step solution text shown after exam submission..."
                          className="w-full bg-navy/5 rounded-xl p-3 outline-none font-medium text-navy text-xs resize-none"
                          value={q.explanation}
                          onChange={(e) => updateQuestion(qIdx, "explanation", e.target.value)}
                        />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              <button 
                type="button" 
                onClick={addQuestion}
                className="w-full h-16 sm:h-20 border-4 border-dashed border-navy/10 rounded-[2rem] sm:rounded-[2.5rem] text-navy/40 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest group"
              >
                <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                Add Another Question Manually
              </button>
            </div>

            {/* Bottom Actions Bar */}
            <Card className="p-4 sm:p-6 bg-white border border-navy/5 shadow-xl flex flex-col sm:flex-row justify-between items-center gap-4 rounded-2xl sm:rounded-3xl mt-8">
              <Button type="button" variant="outline" onClick={() => setActiveStep(2)} className="w-full sm:w-auto h-12 px-8 font-bold text-xs sm:text-sm border-navy/10">
                ← Back to Schedule
              </Button>
              <Button type="submit" disabled={loading} className="w-full sm:w-auto h-12 px-10 text-xs sm:text-sm font-black gap-2 bg-primary hover:bg-primary/90 text-white shadow-lg rounded-xl">
                {loading ? "Saving Assessment..." : (
                  <>
                    <CheckCircle size={18} /> {isEdit ? "Save Changes" : "Save & Finalize Test"}
                  </>
                )}
              </Button>
            </Card>
          </motion.div>
        )}
      </form>

      {/* EXCEL IMPORT & PREVIEW MODAL */}
      <AnimatePresence>
        {showExcelModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowExcelModal(false)} className="absolute inset-0 bg-navy/30 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-3xl bg-white rounded-[2.5rem] p-6 sm:p-8 space-y-6 shadow-2xl max-h-[90vh] flex flex-col z-10">
              <div className="flex items-center justify-between border-b border-navy/5 pb-4">
                <div className="flex items-center gap-3">
                  <FileSpreadsheet className="text-green-600 shrink-0" size={24} />
                  <div>
                    <h3 className="font-bold text-navy text-lg sm:text-xl">Excel Import Preview</h3>
                    <p className="text-xs text-navy/40 font-bold truncate max-w-[180px] sm:max-w-xs">{excelFileName}</p>
                  </div>
                </div>
                <button onClick={() => setShowExcelModal(false)} className="text-navy/40 hover:text-navy p-2"><X size={20} /></button>
              </div>

              {/* Errors List if any */}
              {excelErrors.length > 0 && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 space-y-2">
                  <p className="text-xs font-black uppercase text-red-600 flex items-center gap-2">
                    <AlertTriangle size={16} /> Validation Errors Found ({excelErrors.length})
                  </p>
                  <ul className="max-h-36 overflow-y-auto space-y-1 text-xs font-bold text-red-600 pl-4 list-disc">
                    {excelErrors.map((err, i) => <li key={i}>{err}</li>)}
                  </ul>
                </div>
              )}

              {/* Valid Questions Preview Table */}
              <div className="flex-1 overflow-y-auto space-y-4">
                <p className="text-xs font-black uppercase tracking-widest text-navy/40">
                  Parsed Valid Questions ({parsedQuestions.length})
                </p>
                {parsedQuestions.length === 0 ? (
                  <p className="text-center py-8 text-navy/40 font-bold text-sm italic">No valid questions found to import.</p>
                ) : (
                  <div className="space-y-3">
                    {parsedQuestions.map((pq, idx) => (
                      <div key={idx} className="p-4 bg-navy/5 rounded-2xl text-xs space-y-2 border border-navy/5">
                        <div className="flex justify-between font-bold text-navy flex-col sm:flex-row gap-1">
                          <span>Q{idx + 1}. {pq.question}</span>
                          <span className="text-green-600 shrink-0">Correct: Option {String.fromCharCode(65 + pq.correctAnswer)}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-navy/60 font-medium">
                          <div>A. {pq.options[0]}</div>
                          <div>B. {pq.options[1]}</div>
                          <div>C. {pq.options[2]}</div>
                          <div>D. {pq.options[3]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3 border-t border-navy/5 pt-4">
                <Button variant="outline" className="h-12 rounded-xl" onClick={() => setShowExcelModal(false)}>
                  Cancel
                </Button>
                <Button 
                  disabled={parsedQuestions.length === 0} 
                  className="h-12 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold" 
                  onClick={confirmExcelImport}
                >
                  Confirm & Append {parsedQuestions.length} Questions
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
