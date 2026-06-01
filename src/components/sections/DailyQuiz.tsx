"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Brain, Sparkles, CheckCircle2 } from "lucide-react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

interface StaticQuiz {
  id: string;
  subject: string;
  question: string;
  options: string[];
  correct: number;
}

const staticQuizzes: StaticQuiz[] = [
  {
    id: "quiz1",
    subject: "Physics",
    question: "What is the relation between the focal length (f) and radius of curvature (R) of a spherical mirror?",
    options: ["f = R", "f = R / 2", "f = 2R", "f = 3R / 2"],
    correct: 1
  },
  {
    id: "quiz2",
    subject: "Chemistry",
    question: "Which of the following is the strongest oxidizing agent in the halogen group?",
    options: ["Fluorine (F₂)", "Chlorine (Cl₂)", "Bromine (Br₂)", "Iodine (I₂)"],
    correct: 0
  },
  {
    id: "quiz3",
    subject: "Physics",
    question: "For a particle moving in a straight line under a constant force, the power delivered is proportional to:",
    options: ["Time (t)", "Displacement (x)", "Velocity (v)", "Acceleration (a)"],
    correct: 2
  }
];

export const DailyQuiz = () => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [quiz, setQuiz] = useState<StaticQuiz | null>(null);
  const [loading, setLoading] = useState(true);

  // Pick a random quiz, ideally different from the current one
  const getNextQuiz = (currentQuiz: StaticQuiz | null): StaticQuiz => {
    const availableQuizzes = currentQuiz 
      ? staticQuizzes.filter(q => q.id !== currentQuiz.id)
      : staticQuizzes;
    
    const choices = availableQuizzes.length > 0 ? availableQuizzes : staticQuizzes;
    return choices[Math.floor(Math.random() * choices.length)];
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        const initialQuiz = getNextQuiz(null);
        setQuiz(initialQuiz);
      } catch (error) {
        console.error("Error setting daily quiz:", error);
      } finally {
        setLoading(false);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleOptionClick = (idx: number) => {
    if (!quiz) return;
    setSelectedOption(idx);
    setIsCorrect(idx === quiz.correct);
  };

  const handleTryAnother = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setQuiz(getNextQuiz(quiz));
  };

  return (
    <section className="py-16 sm:py-24 bg-card/50 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-5xl mx-auto flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1">
            <ScrollReveal direction="left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-navy font-bold text-sm mb-6 border border-accent/20">
                <Brain size={18} /> Interactive Learning
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-black text-navy mb-8">Test Your Brain with <br /><span className="text-primary italic">Daily Quick Quiz</span></h2>
              <p className="text-lg text-navy/70 leading-relaxed mb-8">
                Engagement is the key to retention. Every day, we post a &quot;Concept of the Day&quot; quiz to keep our students sharp and competitive.
              </p>
              <ul className="space-y-4">
                {["Real-time performance feedback", "Conceptual clarity check", "Ranked leaderboard for students"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-navy font-bold">
                    <CheckCircle2 size={20} className="text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          <div className="flex-1 w-full max-w-lg">
            <ScrollReveal direction="right">
              <div className="glass rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative border-8 border-white min-h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-full min-h-[300px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : quiz ? (
                  <>
                    <div className="absolute -top-6 -right-6 w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white shadow-xl animate-pulse">
                      <Sparkles size={32} />
                    </div>
                    
                    <span className="text-xs font-black text-primary uppercase tracking-widest mb-4 block">{quiz.subject} • Daily Challenge</span>
                    <h3 className="text-xl font-bold text-navy mb-10 leading-tight">
                      {quiz.question}
                    </h3>

                    <div className="space-y-4">
                      {quiz.options.map((opt: string, i: number) => (
                        <button
                          key={i}
                          disabled={selectedOption !== null}
                          onClick={() => handleOptionClick(i)}
                          className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 font-bold ${
                            selectedOption === i 
                              ? isCorrect 
                                ? "bg-green-500/10 border-green-500 text-green-700" 
                                : "bg-red-500/10 border-red-500 text-red-700"
                              : "bg-white/50 border-transparent hover:border-primary/20 text-navy/70"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{String.fromCharCode(65 + i)}. {opt}</span>
                            {selectedOption === i && (
                              isCorrect ? <CheckCircle2 size={20} /> : <div className="w-5 h-5 rounded-full border-2 border-red-500 flex items-center justify-center">×</div>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>

                    <AnimatePresence>
                      {selectedOption !== null && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-8 pt-8 border-t border-navy/5 text-center"
                        >
                          <p className="text-sm font-bold text-navy/60 mb-4">
                            {isCorrect ? "Correct! Well done." : `Oops! The correct answer was ${quiz.options[quiz.correct]}.`}
                          </p>
                          <Button variant="ghost" onClick={handleTryAnother}>
                            Try Another
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="text-center py-20">
                    <Brain className="mx-auto text-navy/10 mb-4" size={48} />
                    <p className="text-navy/40 font-bold">New quiz coming soon!</p>
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
