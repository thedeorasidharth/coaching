"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Bookmark, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  X, 
  Menu, 
  Sparkles,
  FileCheck,
  Check,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";

export default function StudentTestRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasStartedTest, setHasStartedTest] = useState(false);

  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [questionStatus, setQuestionStatus] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [mobilePaletteOpen, setMobilePaletteOpen] = useState(false);
  const [activeSubject, setActiveSubject] = useState<string>("All");

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const attemptStorageKey = `eduspark_attempt_${user?._id}_${quizId}`;

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const fetchQuiz = async () => {
    try {
      const res = await api.get(`/quizzes/${quizId}`);
      const data = res.data;
      setQuiz(data);

      const savedAttempt = localStorage.getItem(attemptStorageKey);
      if (savedAttempt) {
        try {
          const parsed = JSON.parse(savedAttempt);
          setAnswers(parsed.answers || {});
          setQuestionStatus(parsed.questionStatus || {});
          setTimeLeft(parsed.timeLeft !== undefined ? parsed.timeLeft : data.duration * 60);
          setHasStartedTest(true);
        } catch (e) {
          setTimeLeft(data.duration * 60);
        }
      } else {
        setTimeLeft(data.duration * 60);
      }
    } catch (err) {
      console.error("Failed to fetch quiz details", err);
      router.push("/student/tests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!hasStartedTest || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleSubmitAuto();
          return 0;
        }
        const updated = prev - 1;
        if (updated % 5 === 0) {
          saveAttemptToLocal(answers, questionStatus, updated);
        }
        return updated;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStartedTest, timeLeft, answers, questionStatus]);

  const saveAttemptToLocal = (ansMap: any, statusMap: any, remainingTime: number) => {
    if (!user?._id) return;
    localStorage.setItem(
      attemptStorageKey,
      JSON.stringify({
        answers: ansMap,
        questionStatus: statusMap,
        timeLeft: remainingTime,
        savedAt: Date.now(),
      })
    );
  };

  const handleStartTest = () => {
    setHasStartedTest(true);
    const initialStatus: { [key: number]: string } = { ...questionStatus };
    if (!initialStatus[0]) {
      initialStatus[0] = "notAnswered";
    }
    setQuestionStatus(initialStatus);
    saveAttemptToLocal(answers, initialStatus, timeLeft);
  };

  const handleSelectOption = (optionIndex: number) => {
    const newAns = { ...answers, [currentQ]: optionIndex };
    setAnswers(newAns);
    const currentSt = questionStatus[currentQ];
    let newSt = "answered";
    if (currentSt === "markedForReview" || currentSt === "answeredAndMarkedForReview") {
      newSt = "answeredAndMarkedForReview";
    }
    const newStatus = { ...questionStatus, [currentQ]: newSt };
    setQuestionStatus(newStatus);
    saveAttemptToLocal(newAns, newStatus, timeLeft);
  };

  const handleClearResponse = () => {
    const newAns = { ...answers };
    delete newAns[currentQ];
    setAnswers(newAns);
    const newStatus = { ...questionStatus, [currentQ]: "notAnswered" };
    setQuestionStatus(newStatus);
    saveAttemptToLocal(newAns, newStatus, timeLeft);
  };

  const handleMarkForReview = () => {
    const hasAnswer = answers[currentQ] !== undefined && answers[currentQ] !== -1;
    const newSt = hasAnswer ? "answeredAndMarkedForReview" : "markedForReview";
    const newStatus = { ...questionStatus, [currentQ]: newSt };
    setQuestionStatus(newStatus);
    saveAttemptToLocal(answers, newStatus, timeLeft);
    navigateNextQuestion(newStatus);
  };

  const handleSaveAndNext = () => {
    const hasAnswer = answers[currentQ] !== undefined && answers[currentQ] !== -1;
    let newSt = questionStatus[currentQ];
    if (hasAnswer) {
      newSt = newSt === "answeredAndMarkedForReview" ? "answeredAndMarkedForReview" : "answered";
    } else {
      newSt = newSt === "markedForReview" ? "markedForReview" : "notAnswered";
    }
    const newStatus = { ...questionStatus, [currentQ]: newSt };
    setQuestionStatus(newStatus);
    saveAttemptToLocal(answers, newStatus, timeLeft);
    navigateNextQuestion(newStatus);
  };

  const navigateNextQuestion = (currentStatusMap: any) => {
    if (currentQ < (quiz?.questions?.length || 1) - 1) {
      const nextIdx = currentQ + 1;
      setCurrentQ(nextIdx);
      if (!currentStatusMap[nextIdx]) {
        const updated = { ...currentStatusMap, [nextIdx]: "notAnswered" };
        setQuestionStatus(updated);
        saveAttemptToLocal(answers, updated, timeLeft);
      }
    }
  };

  const handleNavigateQuestion = (idx: number) => {
    setCurrentQ(idx);
    setMobilePaletteOpen(false);
    if (!questionStatus[idx]) {
      const updated = { ...questionStatus, [idx]: "notAnswered" };
      setQuestionStatus(updated);
      saveAttemptToLocal(answers, updated, timeLeft);
    }
  };

  const handleSubmitAuto = async () => {
    await submitTestPayload();
  };

  const handleSubmit = async () => {
    await submitTestPayload();
  };

  const submitTestPayload = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      const timeTakenSec = quiz.duration * 60 - timeLeft;
      const formattedAnswers = quiz.questions.map((_: any, idx: number) => {
        return answers[idx] !== undefined ? answers[idx] : -1;
      });

      const formattedStatus = quiz.questions.map((_: any, idx: number) => {
        return questionStatus[idx] || "notVisited";
      });

      await api.post("/results", {
        quizId,
        answers: formattedAnswers,
        questionStatus: formattedStatus,
        timeTaken: timeTakenSec > 0 ? timeTakenSec : 1,
      });

      localStorage.removeItem(attemptStorageKey);
      router.push("/student/results");
    } catch (err: any) {
      console.error("Submission failed", err);
      alert(err.response?.data?.message || "Failed to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-navy text-white p-4 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 font-black uppercase tracking-widest text-xs">Loading NTA Examination Engine...</p>
        </div>
      </div>
    );
  }

  if (!quiz) return null;

  const subjectsList: string[] = ["All", ...Array.from(new Set(quiz.questions.map((q: any) => q.subject || quiz.subject || "General")))] as string[];
  const currentQuestion = quiz.questions[currentQ];

  const getStatusCounts = () => {
    let notVisited = 0;
    let notAnswered = 0;
    let answered = 0;
    let markedForReview = 0;
    let answeredAndMarkedForReview = 0;

    quiz.questions.forEach((_: any, idx: number) => {
      const st = questionStatus[idx] || "notVisited";
      if (st === "notVisited") notVisited++;
      else if (st === "notAnswered") notAnswered++;
      else if (st === "answered") answered++;
      else if (st === "markedForReview") markedForReview++;
      else if (st === "answeredAndMarkedForReview") answeredAndMarkedForReview++;
    });

    return { notVisited, notAnswered, answered, markedForReview, answeredAndMarkedForReview };
  };

  const counts = getStatusCounts();

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleSubjectChange = (subj: string) => {
    setActiveSubject(subj);
    if (subj === "All") return;
    const targetIdx = quiz.questions.findIndex((q: any) => (q.subject || quiz.subject || "General") === subj);
    if (targetIdx !== -1) {
      handleNavigateQuestion(targetIdx);
    }
  };

  // PRE-TEST INSTRUCTIONS OVERLAY
  if (!hasStartedTest) {
    return (
      <div className="min-h-screen bg-navy text-white flex items-center justify-center p-4 sm:p-6 font-sans relative overflow-y-auto">
        <div className="max-w-4xl w-full bg-white/5 border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 sm:p-8 md:p-12 space-y-6 sm:space-y-8 shadow-2xl my-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/10 pb-6">
            <div>
              <span className="px-4 py-1 rounded-full bg-primary/20 text-accent text-[10px] font-black uppercase tracking-widest">
                {quiz.examType || 'JEE'} • {quiz.testType || 'Full Test'}
              </span>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight mt-2">{quiz.title}</h1>
              <p className="text-white/40 text-xs font-bold mt-1">{quiz.subject} • {quiz.targetClass || quiz.class}</p>
            </div>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shrink-0">
              <Clock size={32} className="text-primary" />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-white/40">Exam Duration</p>
                <p className="text-xl sm:text-2xl font-black text-white italic">{quiz.duration} Minutes</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Total Questions</p>
              <p className="text-xl sm:text-2xl font-black text-white">{quiz.questions.length}</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Total Weightage</p>
              <p className="text-xl sm:text-2xl font-black text-primary italic">{quiz.totalMarks} Marks</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Correct Answer</p>
              <p className="text-xl sm:text-2xl font-black text-green-400">+4 Marks</p>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center">
              <p className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Negative Marking</p>
              <p className="text-xl sm:text-2xl font-black text-red-400">-1 Mark</p>
            </div>
          </div>

          {quiz.description && (
            <div className="p-4 sm:p-6 bg-white/5 rounded-2xl border border-white/5">
              <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-2">Exam Description</p>
              <p className="text-sm font-medium text-white/80 leading-relaxed">{quiz.description}</p>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
              <FileCheck size={18} className="text-primary" /> Important Guidelines
            </h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-bold text-white/70">
              <li className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Check size={16} className="text-green-400 shrink-0" /> Read every question carefully before answering.</li>
              <li className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Check size={16} className="text-green-400 shrink-0" /> Incorrect answers carry negative marking (-1).</li>
              <li className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Check size={16} className="text-green-400 shrink-0" /> Timer runs continuously once you click Start Test.</li>
              <li className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Check size={16} className="text-green-400 shrink-0" /> Use "Mark for Review" to flag questions.</li>
              <li className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Check size={16} className="text-green-400 shrink-0" /> Auto-submits when timer reaches 00:00.</li>
              <li className="flex items-center gap-2 bg-white/5 p-3 rounded-xl"><Check size={16} className="text-green-400 shrink-0" /> Do not refresh or close browser during exam.</li>
            </ul>
          </div>

          <div className="pt-4 flex justify-end">
            <Button onClick={handleStartTest} className="w-full sm:w-auto h-14 sm:h-16 px-8 sm:px-12 text-lg sm:text-xl font-black gap-3 bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-xl shadow-primary/30">
              <Zap size={22} /> START TEST NOW
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN NTA EXAMINATION INTERFACE
  return (
    <div className="fixed inset-0 z-[100] bg-background flex flex-col overflow-hidden font-sans w-full">
      {/* TOP HEADER */}
      <header className="h-16 sm:h-20 bg-navy text-white px-4 sm:px-6 flex items-center justify-between shadow-2xl relative z-20 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-primary p-2 rounded-xl shrink-0">
            <Sparkles className="text-accent" size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-base sm:text-lg leading-none">EDUSPARK</h1>
            <p className="text-[9px] font-black uppercase tracking-widest text-accent mt-0.5 truncate max-w-[120px] sm:max-w-xs">{quiz.title}</p>
          </div>
        </div>

        {/* Dynamic Subject Tabs (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-white/10 p-1.5 rounded-2xl">
          {subjectsList.map((subj) => (
            <button
              key={subj}
              onClick={() => handleSubjectChange(subj)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase transition-all ${
                activeSubject === subj ? "bg-primary text-white shadow-md" : "text-white/60 hover:text-white"
              }`}
            >
              {subj}
            </button>
          ))}
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <div className={`flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl border-2 transition-all ${
            timeLeft < 300 ? "border-red-500 bg-red-500/20 text-red-400 animate-pulse" : "border-white/10 bg-white/5 text-white"
          }`}>
            <Clock size={18} className="text-accent shrink-0" />
            <span className="text-base sm:text-xl font-black italic tabular-nums tracking-widest">{formatTime(timeLeft)}</span>
          </div>

          <Button 
            type="button"
            onClick={() => setMobilePaletteOpen(!mobilePaletteOpen)} 
            className="lg:hidden p-2.5 rounded-xl bg-white/10 text-white"
            aria-label="Open Question Palette"
          >
            <Menu size={20} />
          </Button>

          <Button 
            type="button"
            onClick={() => setShowConfirm(true)} 
            className="h-10 sm:h-11 px-4 sm:px-6 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs rounded-xl shadow-lg"
          >
            Submit
          </Button>
        </div>
      </header>

      {/* MOBILE SUBJECT TABS BAR */}
      <div className="lg:hidden bg-navy/95 border-t border-white/10 p-2 flex gap-2 overflow-x-auto text-white shrink-0 scrollbar-none">
        {subjectsList.map((subj) => (
          <button
            key={subj}
            onClick={() => handleSubjectChange(subj)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase whitespace-nowrap transition-all ${
              activeSubject === subj ? "bg-primary text-white" : "bg-white/5 text-white/60"
            }`}
          >
            {subj}
          </button>
        ))}
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex overflow-hidden relative w-full">
        {/* LEFT / MAIN QUESTION CONTAINER */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col justify-between overflow-y-auto bg-pattern w-full">
          <div className="max-w-4xl mx-auto w-full space-y-6 sm:space-y-8">
            {/* Question Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-navy/5 pb-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="px-3 py-1 rounded-xl bg-navy text-white font-black text-xs">
                  Q{currentQ + 1}
                </span>
                <span className="px-3 py-1 rounded-xl bg-primary/10 text-primary text-[10px] font-black uppercase tracking-wider">
                  {currentQuestion.subject || quiz.subject || 'General'}
                </span>
                {currentQuestion.chapter && (
                  <span className="px-3 py-1 rounded-xl bg-navy/5 text-navy/60 text-[10px] font-bold">
                    {currentQuestion.chapter}
                  </span>
                )}
              </div>
              <div className="text-right text-xs font-bold text-navy/40">
                <span>+ Marks: <strong className="text-green-600">{currentQuestion.marks || 4}</strong></span>
                <span className="ml-3">- Marks: <strong className="text-red-500">{currentQuestion.negativeMarks || 1}</strong></span>
              </div>
            </div>

            {/* Question Statement */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-navy leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="grid grid-cols-1 gap-3 sm:gap-4 pt-2">
              {currentQuestion.options.map((opt: string, oIdx: number) => {
                const isSelected = answers[currentQ] === oIdx;
                return (
                  <button
                    key={oIdx}
                    type="button"
                    onClick={() => handleSelectOption(oIdx)}
                    className={`w-full text-left p-4 sm:p-5 md:p-6 rounded-2xl border-2 transition-all flex items-center gap-3 sm:gap-4 ${
                      isSelected 
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                        : "bg-white border-navy/5 text-navy hover:border-primary/30 hover:bg-navy/5"
                    }`}
                  >
                    <span className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shrink-0 ${
                      isSelected ? "bg-white/20 text-white" : "bg-navy/5 text-navy/40"
                    }`}>
                      {String.fromCharCode(65 + oIdx)}
                    </span>
                    <span className="text-sm sm:text-base font-bold flex-1">{opt}</span>
                    {isSelected && <CheckCircle size={20} className="text-white shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BOTTOM ACTION BUTTONS BAR */}
          <div className="max-w-4xl mx-auto w-full pt-6 mt-6 border-t border-navy/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClearResponse}
                disabled={answers[currentQ] === undefined || answers[currentQ] === -1}
                className="flex-1 sm:flex-none h-11 px-4 text-xs font-bold gap-2 border-navy/10 text-navy"
              >
                <RotateCcw size={16} /> Clear Response
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleMarkForReview}
                className="flex-1 sm:flex-none h-11 px-4 text-xs font-bold gap-2 border-purple-600/30 text-purple-700 hover:bg-purple-50"
              >
                <Bookmark size={16} /> Mark for Review
              </Button>
            </div>

            <div className="flex gap-2 sm:gap-3">
              <Button 
                type="button" 
                variant="outline" 
                disabled={currentQ === 0}
                onClick={() => setCurrentQ(prev => prev - 1)}
                className="flex-1 sm:flex-none h-11 px-4 text-xs font-bold gap-2 border-navy/10"
              >
                <ChevronLeft size={18} /> Previous
              </Button>
              <Button 
                type="button" 
                onClick={handleSaveAndNext}
                className="flex-1 sm:flex-none h-11 px-6 text-xs font-bold gap-2 bg-navy hover:bg-primary text-white shadow-md"
              >
                Save & Next <ChevronRight size={18} />
              </Button>
            </div>
          </div>
        </main>

        {/* QUESTION PALETTE SIDEBAR & MOBILE DRAWER */}
        <AnimatePresence>
          {(mobilePaletteOpen || typeof window === "undefined") && (
            <div 
              className="fixed inset-0 z-50 lg:hidden bg-navy/60 backdrop-blur-sm"
              onClick={() => setMobilePaletteOpen(false)}
            />
          )}
        </AnimatePresence>

        <aside className={`w-80 bg-white border-l border-navy/5 p-6 flex flex-col justify-between shadow-2xl z-50 transition-all ${
          mobilePaletteOpen 
            ? "fixed inset-y-0 right-0 h-full w-full max-w-xs" 
            : "hidden lg:flex"
        }`}>
          <div className="space-y-6 overflow-y-auto flex-1">
            <div className="flex items-center justify-between border-b border-navy/5 pb-4">
              <h3 className="font-black text-navy text-sm uppercase tracking-widest">Question Palette</h3>
              <button 
                type="button"
                className="lg:hidden text-navy/40 hover:text-navy p-1" 
                onClick={() => setMobilePaletteOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* State Counts Legend */}
            <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
              <div className="flex items-center gap-2 p-2 bg-navy/5 rounded-xl">
                <span className="w-4 h-4 rounded-md bg-white border border-navy/10 flex items-center justify-center font-black">{counts.notVisited}</span>
                <span className="text-navy/60">Not Visited</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-red-500/10 rounded-xl">
                <span className="w-4 h-4 rounded-md bg-red-500 text-white flex items-center justify-center font-black">{counts.notAnswered}</span>
                <span className="text-red-600">Not Answered</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-500/10 rounded-xl">
                <span className="w-4 h-4 rounded-md bg-green-500 text-white flex items-center justify-center font-black">{counts.answered}</span>
                <span className="text-green-600">Answered</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-purple-500/10 rounded-xl">
                <span className="w-4 h-4 rounded-md bg-purple-600 text-white flex items-center justify-center font-black">{counts.markedForReview}</span>
                <span className="text-purple-700">Marked</span>
              </div>
              <div className="col-span-2 flex items-center gap-2 p-2 bg-purple-500/10 rounded-xl">
                <span className="w-4 h-4 rounded-md bg-purple-600 text-white ring-2 ring-green-400 flex items-center justify-center font-black">{counts.answeredAndMarkedForReview}</span>
                <span className="text-purple-700">Answered & Marked</span>
              </div>
            </div>

            {/* Question Grid Buttons */}
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-navy/40">Select Question</p>
              <div className="grid grid-cols-5 gap-2">
                {quiz.questions.map((_: any, idx: number) => {
                  const status = questionStatus[idx] || "notVisited";
                  const isCurrent = currentQ === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleNavigateQuestion(idx)}
                      className={`h-10 rounded-xl font-bold text-xs flex items-center justify-center transition-all border ${
                        isCurrent ? "ring-2 ring-primary ring-offset-2 scale-105" : ""
                      } ${
                        status === "answered"
                          ? "bg-green-500 text-white border-green-500"
                          : status === "notAnswered"
                          ? "bg-red-500 text-white border-red-500"
                          : status === "markedForReview"
                          ? "bg-purple-600 text-white border-purple-600"
                          : status === "answeredAndMarkedForReview"
                          ? "bg-purple-600 text-white border-purple-600 ring-2 ring-green-400"
                          : "bg-navy/5 text-navy/60 border-navy/5 hover:bg-navy/10"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-navy/5 mt-4">
            <Button 
              type="button"
              onClick={() => { setMobilePaletteOpen(false); setShowConfirm(true); }}
              className="w-full h-12 bg-red-600 hover:bg-red-700 text-white font-black uppercase text-xs rounded-xl shadow-lg"
            >
              Submit Assessment
            </Button>
          </div>
        </aside>
      </div>

      {/* SUBMISSION CONFIRMATION MODAL */}
      <AnimatePresence>
        {showConfirm && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowConfirm(false)} className="absolute inset-0 bg-navy/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-lg bg-white rounded-[2.5rem] p-6 sm:p-8 text-center space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto z-10">
              <div className="w-16 h-16 bg-navy/5 text-primary rounded-2xl flex items-center justify-center mx-auto">
                <AlertTriangle size={32} />
              </div>

              <div>
                <h3 className="font-bold text-navy text-xl sm:text-2xl">Submit Assessment?</h3>
                <p className="text-navy/60 text-xs sm:text-sm mt-1">Please review your submission summary before finalizing.</p>
              </div>

              {/* Summary Stats Table */}
              <div className="grid grid-cols-2 gap-3 text-xs font-bold text-left bg-navy/5 p-4 rounded-2xl">
                <div>Total Questions: <span className="text-navy font-black">{quiz.questions.length}</span></div>
                <div>Answered: <span className="text-green-600 font-black">{counts.answered + counts.answeredAndMarkedForReview}</span></div>
                <div>Not Answered: <span className="text-red-500 font-black">{counts.notAnswered}</span></div>
                <div>Marked for Review: <span className="text-purple-600 font-black">{counts.markedForReview}</span></div>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setShowConfirm(false)}>
                  Resume Test
                </Button>
                <Button type="button" className="flex-1 h-12 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold" onClick={handleSubmit} disabled={submitting}>
                  {submitting ? "Submitting..." : "Confirm & Submit"}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
