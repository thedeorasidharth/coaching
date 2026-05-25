"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { FloatingParticles } from "@/components/animations/FloatingParticles";
import { ArrowRight, Trophy, Users, Lightbulb } from "lucide-react";

export const Hero = () => {
  const stats = [
    { icon: Trophy, label: "17+ Years Experience", value: "17+" },
    { icon: Lightbulb, label: "Smart AI Learning", value: "AI" },
    { icon: Users, label: "JEE & NEET Selection", value: "95%" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-pattern">
      <FloatingParticles />

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-widest mb-6 border border-primary/10">
                Premium Coaching Institute
              </span>
              <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-black text-navy leading-[1.1] mb-6">
                EDUSPARK <br />
                <span className="text-primary italic font-serif">Excellence</span>
              </h1>
              <p className="text-lg md:text-xl text-navy/70 max-w-xl mb-10 leading-relaxed">
                “Building Concepts, Creating Toppers”. Experience the future of learning with our AI-integrated classrooms and expert faculty.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
                <Button size="lg" className="flex items-center gap-2" onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}>
                  Book Free Demo <ArrowRight size={20} />
                </Button>
                <Button size="lg" variant="outline" onClick={() => document.getElementById('courses')?.scrollIntoView({ behavior: 'smooth' })}>
                  Explore Courses
                </Button>
              </div>
            </motion.div>

            {/* Counters */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-16 flex flex-wrap justify-center lg:justify-start gap-8 md:gap-12"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center lg:items-start">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className="text-accent" size={24} />
                    <span className="text-3xl font-display font-black text-navy">{stat.value}</span>
                  </div>
                  <span className="text-xs uppercase tracking-widest font-bold text-primary/60">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Content - Visual */}
          <div className="flex-1 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative z-10 w-full max-w-[450px]"
            >
              <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50 glass p-4">
                <Image
                  src="/hero_illustration.png"
                  alt="EDUSPARK Study Center - Premium IIT-JEE and NEET Coaching Center in Sheoganj"
                  width={410}
                  height={270}
                  priority={true}
                  className="rounded-[2.5rem] w-full object-cover"
                />
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 glass p-6 rounded-3xl shadow-xl hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
                    <Trophy className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Top Results</p>
                    <p className="text-[10px] text-navy/60 font-medium">IIT-JEE & NEET</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-10 -left-10 glass p-6 rounded-3xl shadow-xl hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                    <Lightbulb className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-navy">Smart Learning</p>
                    <p className="text-[10px] text-navy/60 font-medium">AI Technology</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Background Glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/20 blur-[100px] rounded-full -z-10" />
            <div className="absolute top-1/4 left-1/4 w-[60%] h-[60%] bg-primary/20 blur-[80px] rounded-full -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
