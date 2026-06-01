"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Atom, HeartPulse, GraduationCap, Check } from "lucide-react";

const courses = [
  {
    id: "jee",
    title: "IIT-JEE",
    subtitle: "Engineering Entrance",
    icon: Atom,
    color: "bg-blue-500",
    desc: "Rigorous training for JEE Main & Advanced with focus on high-level concepts and speed.",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    highlights: ["Mock Tests", "Performance Analysis", "Concept Building", "Doubt Sessions"]
  },
  {
    id: "neet",
    title: "NEET",
    subtitle: "Medical Entrance",
    icon: HeartPulse,
    color: "bg-red-500",
    desc: "Comprehensive preparation for NEET aspirants with specialized focus on Biology and numerical Physics.",
    subjects: ["Physics", "Chemistry", "Biology"],
    highlights: ["Mock Tests", "Performance Analysis", "Concept Building", "Doubt Sessions"]
  },
  {
    id: "foundation",
    title: "XI-XII Foundation",
    subtitle: "Board + Competitive",
    icon: GraduationCap,
    color: "bg-green-500",
    desc: "Building a strong base for board exams while preparing students for future competitive challenges.",
    subjects: ["Physics", "Chemistry", "Mathematics / Biology"],
    highlights: ["Mock Tests", "Performance Analysis", "Concept Building", "Doubt Sessions"]
  },
];

export const Courses = () => {
  return (
    <section id="courses" className="py-20 sm:py-28 bg-navy/5">
      <div className="container mx-auto px-6 max-w-[1200px]">
        
        {/* Header Block */}
        <div className="text-center mb-16 sm:mb-20">
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

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              key={course.id}
              className="h-full"
            >
              <Card 
                className="group overflow-hidden p-0 h-full flex flex-col justify-between hover:shadow-xl hover:translate-y-[-6px] transition-all duration-300 bg-white border border-primary/5 hover:border-accent/40"
                glowColor="rgba(201, 168, 106, 0.08)"
              >
                <div className="p-8 flex flex-col justify-between h-full space-y-8">
                  
                  {/* Top Block: Icon & Basic Info */}
                  <div className="space-y-6">
                    <div className={`w-16 h-16 rounded-2xl ${course.color} text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                      <course.icon size={32} />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-navy">{course.title}</h3>
                      <p className="text-xs font-bold text-primary uppercase tracking-widest">{course.subtitle}</p>
                    </div>
                    {/* Fixed Height description to guarantee baseline alignment */}
                    <p className="text-sm text-navy/70 leading-relaxed min-h-[64px] flex items-start">
                      {course.desc}
                    </p>
                  </div>

                  {/* Middle Block: Key Subjects & Highlights */}
                  <div className="space-y-6 pt-6 border-t border-primary/5">
                    
                    {/* Key Subjects */}
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-navy text-[11px] font-mono tracking-wider uppercase">
                        Key Subjects
                      </h4>
                      <ul className="space-y-2.5">
                        {course.subjects.map((sub, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-navy/80 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                            {sub}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-extrabold text-navy text-[11px] font-mono tracking-wider uppercase">
                        Highlights
                      </h4>
                      <ul className="space-y-2.5">
                        {course.highlights.map((high, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-sm text-navy/80 font-medium">
                            <Check size={12} className="text-accent stroke-[3px] flex-shrink-0" />
                            {high}
                          </li>
                        ))}
                      </ul>
                    </div>

                  </div>

                </div>
              </Card>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
