"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { ChevronRight, Atom, HeartPulse, GraduationCap } from "lucide-react";

const courses = [
  {
    id: "jee",
    title: "IIT-JEE",
    subtitle: "Engineering Entrance",
    icon: Atom,
    color: "bg-blue-500",
    features: ["Physics", "Chemistry", "Maths", "Advanced Problem Solving", "Mock Tests"],
    desc: "Rigorous training for JEE Main & Advanced with focus on high-level concepts and speed.",
  },
  {
    id: "neet",
    title: "NEET",
    subtitle: "Medical Entrance",
    icon: HeartPulse,
    color: "bg-red-500",
    features: ["Physics", "Chemistry", "Biology", "Conceptual Clarity", "Speed Training"],
    desc: "Comprehensive preparation for NEET aspirants with specialized focus on Biology and numerical Physics.",
  },
  {
    id: "foundation",
    title: "XI-XII Foundation",
    subtitle: "Board + Competitive",
    icon: GraduationCap,
    color: "bg-green-500",
    features: ["School Curriculum", "Concept Building", "Regular Assessment", "Career Guidance"],
    desc: "Building a strong base for board exams while preparing students for future competitive challenges.",
  },
];

export const Courses = () => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <section id="courses" className="py-16 sm:py-24 bg-navy/5">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 sm:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-black text-navy mb-4"
          >
            Courses Offered
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-navy/60 max-w-2xl mx-auto"
          >
            Choose your path to success with our expertly crafted programs designed to turn your dreams into reality.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {courses.map((course) => (
            <Card 
              key={course.id}
              className="group cursor-pointer overflow-hidden p-0"
              glowColor="rgba(24, 78, 80, 0.1)"
            >
              <div className="p-8">
                <div className={`w-16 h-16 rounded-2xl ${course.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <course.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-navy mb-1">{course.title}</h3>
                <p className="text-sm font-bold text-primary uppercase tracking-widest mb-6">{course.subtitle}</p>
                
                <p className="text-navy/70 mb-8 line-clamp-3">
                  {course.desc}
                </p>

                <div className="space-y-4">
                  {course.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm font-medium text-navy/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {f}
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setExpandedId(expandedId === course.id ? null : course.id)}
                  className="mt-10 flex items-center gap-2 text-primary font-bold group/btn"
                >
                  View Details 
                  <ChevronRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>

              <AnimatePresence>
                {expandedId === course.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-white/50 border-t border-primary/10 overflow-hidden"
                  >
                    <div className="p-8 space-y-6">
                      <h4 className="font-bold text-navy">Detailed Curriculum:</h4>
                      <div className="grid grid-cols-1 gap-3">
                        {course.features.map((f, i) => (
                          <div key={i} className="flex items-center gap-3 text-sm text-navy/80">
                            <ChevronRight size={14} className="text-accent" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
