"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cpu, Monitor, Tablet, Wifi, Brain, Atom, FlaskConical, Sigma, Dna, GraduationCap, Sparkles } from "lucide-react";

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
            className="flex-1 w-full"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-[0_20px_50px_rgba(139,14,42,0.06)] border-4 border-accent/30 bg-gradient-to-br from-[#FDFBF7] via-[#FAF6F0] to-[#EFE6DD] aspect-video flex items-center justify-center select-none group">
              
              {/* Soft Grid Background Overlay */}
              <div 
                className="absolute inset-0 opacity-[0.05] pointer-events-none transition-opacity duration-700 group-hover:opacity-[0.08]" 
                style={{
                  backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A86A 1.5px, transparent 0)',
                  backgroundSize: '20px 20px'
                }} 
              />

              {/* Gentle Background Radial Glow */}
              <div className="absolute w-[200px] h-[200px] rounded-full bg-accent/8 blur-[60px] pointer-events-none" />

              {/* HUD Header Bar (Refined for Academic branding) */}
              <div className="absolute top-4 sm:top-6 left-6 sm:left-8 right-6 sm:right-8 flex justify-between items-center text-[9px] sm:text-[10px] tracking-widest text-navy/55 font-mono pointer-events-none z-10">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                  </span>
                  <span className="font-bold">EDUSPARK SMART LEARNING PLATFORM</span>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-navy/40">
                  <Sparkles size={10} className="text-accent/80" />
                  <span>ACADEMIC INTEGRATION</span>
                </div>
              </div>

              {/* HUD Footer Bar (Academic Branding) */}
              <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-8 right-6 sm:right-8 flex justify-between items-center text-[9px] sm:text-[10px] tracking-wider text-navy/45 font-mono pointer-events-none z-10">
                <div>IIT-JEE & NEET PREPARATION</div>
                <div className="text-accent/80 font-bold">EDUSPARK STUDY CENTER</div>
              </div>

              {/* Main Illustration Scaled Wrapper for perfect responsiveness */}
              <div className="scale-[0.7] xs:scale-[0.8] sm:scale-[0.85] md:scale-100 flex items-center justify-center relative w-full h-full">

                {/* --- CENTRAL AI ENGINE --- */}
                <div className="relative z-10 flex flex-col items-center justify-center">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="relative w-20 h-20 rounded-full flex items-center justify-center bg-white border-2 border-accent shadow-[0_10px_30px_rgba(201,168,106,0.25)]"
                  >
                    {/* Ring 1 (Pulse) */}
                    <motion.div 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }} 
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} 
                      className="absolute inset-0 rounded-full border border-accent/30 pointer-events-none" 
                    />
                    {/* Ring 2 (Pulse) */}
                    <motion.div 
                      animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0, 0.2] }} 
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                      className="absolute inset-0 rounded-full border border-accent/15 pointer-events-none" 
                    />
                    
                    {/* Central Brain Icon */}
                    <Brain className="text-accent w-10 h-10 drop-shadow-[0_0_8px_rgba(201,168,106,0.4)]" />
                  </motion.div>

                  {/* Pulsing Tag below the center AI */}
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -bottom-10 bg-white/95 backdrop-blur-sm border border-accent/30 text-navy px-3 py-1 rounded-full text-[9px] font-mono font-bold tracking-widest shadow-[0_4px_15px_rgba(0,0,0,0.05)] whitespace-nowrap"
                  >
                    AI ADAPTIVE LEARNING
                  </motion.div>
                </div>


                {/* --- INNER ORBIT (Physics & Chemistry) --- */}
                {/* Clockwise Rotation */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                  className="absolute w-0 h-0 flex items-center justify-center"
                >
                  {/* Orbit Track Line */}
                  <div className="absolute w-[180px] h-[180px] rounded-full border border-accent/20 border-dashed pointer-events-none" />

                  {/* SVG Connection Lines for Inner Orbit */}
                  <svg className="absolute w-[200px] h-[200px] pointer-events-none overflow-visible" viewBox="-100 -100 200 200">
                    {/* Connection to Physics (at y = -90) */}
                    <motion.line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-90"
                      stroke="#8B0E2A"
                      strokeWidth="1.5"
                      strokeOpacity="0.25"
                      strokeDasharray="4 6"
                      animate={{ strokeDashoffset: [20, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Connection to Chemistry (at y = 90) */}
                    <motion.line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="90"
                      stroke="#8B0E2A"
                      strokeWidth="1.5"
                      strokeOpacity="0.25"
                      strokeDasharray="4 6"
                      animate={{ strokeDashoffset: [-20, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>

                  {/* Node 1: Physics (Top, y = -90) */}
                  <div className="absolute top-[-90px] -translate-y-1/2">
                    {/* Cancel out orbit rotation to keep upright */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                      className="flex flex-col items-center group/node"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1, borderColor: "rgba(139,14,42,0.8)" }}
                        className="w-12 h-12 rounded-xl bg-white border-2 border-accent/30 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-primary relative cursor-pointer"
                      >
                        {/* Custom atom loop effect */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 border border-accent/15 rounded-full animate-[spin_6s_linear_infinite]" />
                        </div>
                        <Atom className="w-6 h-6 animate-pulse" />
                      </motion.div>

                      {/* Sequentially fading labels */}
                      <motion.div
                        animate={{ opacity: [0.1, 1, 1, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 0, ease: "easeInOut" }}
                        className="mt-2 bg-white/95 border border-accent/25 text-navy px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider shadow-[0_4px_10px_rgba(0,0,0,0.05)] whitespace-nowrap"
                      >
                        Physics
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Node 2: Chemistry (Bottom, y = 90) */}
                  <div className="absolute bottom-[-90px] translate-y-1/2">
                    {/* Cancel out orbit rotation to keep upright */}
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
                      className="flex flex-col items-center group/node"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1, borderColor: "rgba(139,14,42,0.8)" }}
                        className="w-12 h-12 rounded-xl bg-white border-2 border-accent/30 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-primary relative cursor-pointer"
                      >
                        {/* Interactive Chemistry Bubble Particles */}
                        {[1, 2, 3].map((b) => (
                          <motion.div
                            key={b}
                            className="absolute w-1.5 h-1.5 rounded-full bg-accent"
                            animate={{
                              y: [-8, -25],
                              x: [0, (b % 2 === 0 ? 4 : -4), 0],
                              opacity: [0, 1, 0],
                            }}
                            transition={{
                              duration: 2,
                              repeat: Infinity,
                              delay: b * 0.6,
                              ease: "easeOut",
                            }}
                            style={{ top: "12px", left: `${12 + b * 6}px` }}
                          />
                        ))}
                        <FlaskConical className="w-5 h-5 relative z-10" />
                      </motion.div>

                      <motion.div
                        animate={{ opacity: [0.1, 1, 1, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 1.25, ease: "easeInOut" }}
                        className="mt-2 bg-white/95 border border-accent/25 text-navy px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider shadow-[0_4px_10px_rgba(0,0,0,0.05)] whitespace-nowrap"
                      >
                        Chemistry
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>


                {/* --- OUTER ORBIT (Mathematics & Biology) --- */}
                {/* Counter-Clockwise Rotation */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                  className="absolute w-0 h-0 flex items-center justify-center"
                >
                  {/* Orbit Track Line */}
                  <div className="absolute w-[290px] h-[290px] rounded-full border border-accent/15 border-dashed pointer-events-none" />

                  {/* SVG Connection Lines for Outer Orbit */}
                  <svg className="absolute w-[310px] h-[310px] pointer-events-none overflow-visible" viewBox="-155 -155 310 310">
                    {/* Connection to Math (at y = -145) */}
                    <motion.line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="-145"
                      stroke="#8B0E2A"
                      strokeWidth="1.5"
                      strokeOpacity="0.2"
                      strokeDasharray="4 6"
                      animate={{ strokeDashoffset: [-20, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                    {/* Connection to Biology (at y = 145) */}
                    <motion.line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="145"
                      stroke="#8B0E2A"
                      strokeWidth="1.5"
                      strokeOpacity="0.2"
                      strokeDasharray="4 6"
                      animate={{ strokeDashoffset: [20, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    />
                  </svg>

                  {/* Node 3: Mathematics (Top, y = -145) */}
                  <div className="absolute top-[-145px] -translate-y-1/2">
                    {/* Cancel out orbit rotation to keep upright (matches overall rotation) */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                      className="flex flex-col items-center group/node"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1, borderColor: "rgba(139,14,42,0.8)" }}
                        className="w-12 h-12 rounded-xl bg-white border-2 border-accent/30 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-primary relative cursor-pointer"
                      >
                        {/* Tech matrix mathematical markers */}
                        <div className="absolute -top-1 -right-1 text-[8px] font-mono text-accent/70 font-bold">+</div>
                        <div className="absolute -bottom-1 -left-1 text-[8px] font-mono text-accent/70 font-bold">×</div>
                        <Sigma className="w-5 h-5" />
                      </motion.div>

                      <motion.div
                        animate={{ opacity: [0.1, 1, 1, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 2.5, ease: "easeInOut" }}
                        className="mt-2 bg-white/95 border border-accent/25 text-navy px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider shadow-[0_4px_10px_rgba(0,0,0,0.05)] whitespace-nowrap"
                      >
                        Mathematics
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Node 4: Biology (Bottom, y = 145) */}
                  <div className="absolute bottom-[-145px] translate-y-1/2">
                    {/* Cancel out orbit rotation to keep upright */}
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                      className="flex flex-col items-center group/node"
                    >
                      <motion.div 
                        whileHover={{ scale: 1.1, borderColor: "rgba(139,14,42,0.8)" }}
                        className="w-12 h-12 rounded-xl bg-white border-2 border-accent/30 shadow-[0_8px_20px_rgba(0,0,0,0.06)] flex items-center justify-center text-primary relative cursor-pointer overflow-hidden"
                      >
                        {/* DNA Helix 3D Rotation cancellation representation */}
                        <motion.div
                          animate={{ rotateY: 360 }}
                          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                        >
                          <Dna className="w-5 h-5" />
                        </motion.div>
                      </motion.div>

                      <motion.div
                        animate={{ opacity: [0.1, 1, 1, 0.1] }}
                        transition={{ duration: 5, repeat: Infinity, delay: 3.75, ease: "easeInOut" }}
                        className="mt-2 bg-white/95 border border-accent/25 text-navy px-2 py-0.5 rounded-full text-[8px] font-mono font-bold uppercase tracking-wider shadow-[0_4px_10px_rgba(0,0,0,0.05)] whitespace-nowrap"
                      >
                        Biology
                      </motion.div>
                    </motion.div>
                  </div>
                </motion.div>

                {/* --- FLOATING AMBIENT EDUCATION ELEMENTS --- */}
                {/* Floating Graduation Cap */}
                <motion.div
                  animate={{ 
                    y: [0, -10, 0],
                    x: [0, 5, 0],
                    rotate: [0, 3, -3, 0]
                  }}
                  transition={{ 
                    duration: 7, 
                    repeat: Infinity, 
                    ease: "easeInOut" 
                  }}
                  className="absolute top-[-110px] left-[130px] w-10 h-10 rounded-lg bg-white/90 border border-accent/35 flex items-center justify-center shadow-md text-primary pointer-events-none z-10"
                >
                  <GraduationCap className="w-5 h-5" />
                </motion.div>

                {/* Floating Small Sparkle Tech Node */}
                <motion.div
                  animate={{ 
                    y: [0, 8, 0],
                    x: [0, -4, 0]
                  }}
                  transition={{ 
                    duration: 6, 
                    repeat: Infinity, 
                    ease: "easeInOut",
                    delay: 2 
                  }}
                  className="absolute bottom-[-110px] right-[130px] w-8 h-8 rounded-lg bg-white/90 border border-accent/25 flex items-center justify-center shadow-md text-primary/80 pointer-events-none z-10"
                >
                  <Sparkles className="w-4 h-4 text-accent" />
                </motion.div>

              </div>
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
