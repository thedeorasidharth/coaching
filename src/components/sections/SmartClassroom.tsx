"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Monitor, Tablet, Wifi } from "lucide-react";

export const SmartClassroom = () => {
  const features = [
    { icon: Cpu, title: "AI Integration", desc: "Adaptive learning paths for every student." },
    { icon: Monitor, title: "Smart Boards", desc: "Visualizing complex concepts with interactive 3D models." },
    { icon: Tablet, title: "Digital Library", desc: "Access to thousands of study materials at your fingertips." },
    { icon: Wifi, title: "Hybrid Learning", desc: "Seamlessly switch between physical and digital sessions." },
  ];

  return (
    <section className="py-16 sm:py-24 bg-card/30 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white/50 glass aspect-video flex items-center justify-center bg-navy/80">
               {/* Visual representation of smart classroom */}
               <div className="text-center p-12">
                 <div className="flex justify-center gap-4 mb-8">
                    {[1, 2, 3].map(i => (
                      <motion.div 
                        key={i}
                        animate={{ height: [20, 60, 20] }}
                        transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                        className="w-2 bg-accent rounded-full"
                      />
                    ))}
                 </div>
                 <h3 className="text-3xl font-black text-white mb-4">Smart AI Technology</h3>
                 <p className="text-white/60">Experience education like never before.</p>
               </div>
               
               {/* Floating icons over image area */}
               <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-0 opacity-10 pointer-events-none">
                  <div className="absolute top-10 left-10"><Cpu size={100} /></div>
                  <div className="absolute bottom-10 right-10"><Wifi size={100} /></div>
               </motion.div>
            </div>
          </motion.div>

          <div className="flex-1">
            <h2 className="font-display text-4xl md:text-5xl font-black text-navy mb-8">Smart Classroom Experience</h2>
            <p className="text-lg text-navy/70 leading-relaxed mb-12">
              We leverage cutting-edge technology to make learning intuitive and engaging. Our classrooms are equipped with AI-driven analytics that help us track student progress and tailor our teaching methods.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-8">
              {features.map((f, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    <f.icon size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-navy">{f.title}</h4>
                    <p className="text-xs text-navy/60 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
