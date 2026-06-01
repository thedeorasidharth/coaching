"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Atom, BookOpen, Calculator, FlaskConical, GraduationCap, Microscope } from "lucide-react";

const icons = [Atom, BookOpen, Calculator, FlaskConical, GraduationCap, Microscope];

export const FloatingParticles = () => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; size: number; iconIdx: number; duration: number }[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const newParticles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 20,
        iconIdx: Math.floor(Math.random() * icons.length),
        duration: Math.random() * 20 + 10,
      }));
      setParticles(newParticles);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((p) => {
        const Icon = icons[p.iconIdx];
        return (
          <motion.div
            key={p.id}
            initial={{ x: `${p.x}%`, y: `${p.y}%`, opacity: 0 }}
            animate={{
              y: [`${p.y}%`, `${p.y - 10}%`, `${p.y}%`],
              opacity: [0.1, 0.3, 0.1],
              rotate: [0, 360],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute text-primary/20"
            style={{ width: p.size, height: p.size }}
          >
            <Icon size={p.size} strokeWidth={1} />
          </motion.div>
        );
      })}
    </div>
  );
};
