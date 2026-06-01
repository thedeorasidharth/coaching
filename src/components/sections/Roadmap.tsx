"use client";

import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Star, BookOpen, Trophy } from "lucide-react";

const steps = [
  {
    title: "Conceptual Foundation",
    desc: "Start with deep-dive sessions into fundamental concepts in Physics, Chemistry, and Bio/Maths.",
    icon: BookOpen,
    phase: "Phase 01",
  },
  {
    title: "AI-Integrated Learning",
    desc: "Use smart classroom technology to visualize complex theories and retain information 3x faster.",
    icon: Star,
    phase: "Phase 02",
  },
  {
    title: "Rigorous Assessment",
    desc: "Weekly tests and performance analysis to identify and fix knowledge gaps in real-time.",
    icon: CheckCircle2,
    phase: "Phase 03",
  },
  {
    title: "Topper Transformation",
    desc: "Intensive revision and rank-improvement batches to ensure top scores in JEE and NEET.",
    icon: Trophy,
    phase: "Phase 04",
  },
];

export const Roadmap = () => {
  return (
    <section className="py-16 sm:py-24 bg-navy text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="text-center mb-12 sm:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-black mb-4"
          >
            Student Success Roadmap
          </motion.h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm sm:text-base">
            Our systematic approach ensures that every student follows a proven path to excellence.
          </p>
        </div>

        <div className="relative">
          {/* Central Line (visible on all screens, centered behind the icons/cards) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-accent/30 z-0" />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative flex flex-col md:flex-row items-center justify-between w-full md:gap-8"
              >
                {/* Desktop Left Column */}
                <div className="flex-1 w-full text-right md:block hidden">
                  {i % 2 === 0 && (
                    <div className="pr-8 lg:pr-12">
                      <span className="text-accent font-black tracking-widest text-sm uppercase mb-2 block">{step.phase}</span>
                      <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                      <p className="text-white/60 leading-relaxed text-sm lg:text-base">{step.desc}</p>
                    </div>
                  )}
                </div>

                {/* Central Circle (Always centered and visible) */}
                <div className="relative z-10 flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-full bg-navy flex items-center justify-center shadow-[0_0_20px_rgba(201,168,106,0.3)] border-4 border-accent mb-4 md:mb-0">
                  <step.icon className="text-accent" size={24} />
                </div>

                {/* Desktop Right Column & Mobile Center Card */}
                <div className="flex-1 w-full flex justify-start">
                  {/* Desktop/Tablet display for odd phases */}
                  <div className="hidden md:block pl-8 lg:pl-12 max-w-md text-left">
                    {i % 2 !== 0 && (
                      <div>
                        <span className="text-accent font-black tracking-widest text-sm uppercase mb-2 block">{step.phase}</span>
                        <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                        <p className="text-white/60 leading-relaxed text-sm lg:text-base">{step.desc}</p>
                      </div>
                    )}
                  </div>

                  {/* Mobile-Only display */}
                  <div className="md:hidden w-full max-w-md mx-auto bg-navy border border-white/10 rounded-2xl p-6 text-center z-10 shadow-lg relative">
                    <span className="text-accent font-black tracking-widest text-xs uppercase mb-1 block">{step.phase}</span>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
