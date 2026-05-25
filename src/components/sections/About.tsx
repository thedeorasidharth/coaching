"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Target, Award, ShieldCheck } from "lucide-react";

export const About = () => {
  const points = [
    {
      icon: Target,
      title: "Our Mission",
      desc: "To provide quality education that builds strong conceptual foundations and empowers students to excel in competitive exams.",
    },
    {
      icon: Award,
      title: "Excellence Driven",
      desc: "We focus on student success through personalized attention and innovative teaching methods tailored for the modern era.",
    },
    {
      icon: ShieldCheck,
      title: "Trust & Quality",
      desc: "With 17+ years of experience, we have established ourselves as a trusted name in student career building.",
    },
  ];

  return (
    <section id="about" className="py-16 sm:py-24 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-black text-navy mb-8">
              Why EDUSPARK is the <br />
              <span className="text-primary italic">Study Center For Excellence</span>
            </h2>
            <p className="text-lg text-navy/70 leading-relaxed mb-12">
              At EDUSPARK, we believe that every student has the potential to reach the top. Our approach goes beyond traditional coaching; we combine deep conceptual learning with state-of-the-art AI technology to create an environment where students thrive.
            </p>
            
            <div className="space-y-8">
              {points.map((point, i) => (
                <div key={i} className="flex gap-6">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <point.icon size={28} />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-navy mb-2">{point.title}</h4>
                    <p className="text-navy/60 leading-relaxed">{point.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 pt-12">
                <Card className="aspect-square flex flex-col justify-center items-center text-center p-8">
                  <h3 className="text-4xl font-black text-primary mb-2">17+</h3>
                  <p className="text-sm font-bold text-navy/60 uppercase tracking-widest">Years of Experience</p>
                </Card>
                <Card className="bg-primary text-white p-8">
                  <h3 className="text-2xl font-bold mb-2">AI-Powered</h3>
                  <p className="text-white/70 text-sm">Next-gen learning tools for better retention.</p>
                </Card>
              </div>
              <div className="space-y-6">
                <Card className="bg-accent text-navy p-8">
                  <h3 className="text-2xl font-bold mb-2">IIT-JEE</h3>
                  <p className="text-navy/70 text-sm">Specialized training for engineering aspirants.</p>
                </Card>
                <Card className="aspect-square flex flex-col justify-center items-center text-center p-8">
                  <h3 className="text-4xl font-black text-primary mb-2">NEET</h3>
                  <p className="text-sm font-bold text-navy/60 uppercase tracking-widest">Top Medical Coaching</p>
                </Card>
              </div>
            </div>
            
            {/* Background pattern */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
