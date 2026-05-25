"use client";

import React from "react";
import { ScrollReveal } from "@/components/animations/ScrollReveal";
import { Card } from "@/components/ui/Card";
import { Zap, Shield, Users, Clock, Trophy, Laptop } from "lucide-react";

const features = [
  {
    icon: Users,
    title: "Expert Faculty",
    desc: "17+ years of experience from premier institutes like IIT Delhi.",
    color: "text-blue-500",
  },
  {
    icon: Laptop,
    title: "AI Smart Classes",
    desc: "Personalized learning paths using next-gen education technology.",
    color: "text-purple-500",
  },
  {
    icon: Zap,
    title: "Concept Building",
    desc: "Focus on deep understanding rather than rote memorization.",
    color: "text-yellow-500",
  },
  {
    icon: Trophy,
    title: "Result Oriented",
    desc: "Proven track record of producing top rankers in JEE & NEET.",
    color: "text-orange-500",
  },
  {
    icon: Clock,
    title: "Personal Attention",
    desc: "Small batch sizes to ensure every student gets the focus they need.",
    color: "text-green-500",
  },
  {
    icon: Shield,
    title: "Regular Tests",
    desc: "Performance analysis and regular assessment to track growth.",
    color: "text-red-500",
  },
];

export const WhyChooseUs = () => {
  return (
    <section id="why-us" className="py-16 sm:py-24 bg-navy text-white overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-full h-full bg-pattern opacity-10 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-20">
          <ScrollReveal>
            <h2 className="font-display text-4xl md:text-5xl font-black mb-4">Why Choose EDUSPARK?</h2>
            <p className="text-white/60 max-w-2xl mx-auto">
              We combine traditional excellence with modern technology to provide the best learning experience.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction={i % 2 === 0 ? "left" : "right"}>
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors h-full group">
                <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 ${f.color} group-hover:scale-110 transition-transform duration-300`}>
                  <f.icon size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </Card>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
