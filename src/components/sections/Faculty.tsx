"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { GraduationCap, Award, Calendar } from "lucide-react";
import api from "@/lib/axios";
import { FacultyMember } from "@/types";

const staticFaculty: FacultyMember[] = [
  {
    _id: "mahipal",
    name: "Dr. Mahipal Singh Deora",
    subject: "Physics",
    qualifications: ["PhD", "M.Tech (IIT Delhi)", "M.Sc Physics"],
    experience: "17 Years",
    imageUrl: "/faculty_mahipal.png",
  },
  {
    _id: "monalisa",
    name: "Dr. Monalisa",
    subject: "Chemistry",
    qualifications: ["PhD", "M.Sc Chemistry"],
    experience: "17 Years",
    imageUrl: "/faculty_monalisa.png",
  }
];

export const Faculty = () => {
  const faculty = staticFaculty;
  const loading = false;

  return (
    <section id="faculty" className="py-16 sm:py-24 relative overflow-hidden bg-white">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12 sm:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-black text-navy mb-4"
          >
            Our Expert Faculty
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-navy/60 max-w-2xl mx-auto"
          >
            Learn from the masters. Our highly qualified faculty brings decades of experience from top institutions like IIT Delhi.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {loading ? (
            // Skeletons
            [1, 2].map((i) => (
              <Card key={i} className="animate-pulse h-80 bg-navy/5"><div /></Card>
            ))
          ) : (
            faculty.map((member, i) => (
              <Card key={member._id} className="group p-0 overflow-hidden bg-card/50 hover:bg-white transition-colors duration-500">
                <div className="flex flex-col md:flex-row h-full">
                  {/* Image */}
                  <div className="md:w-1/2 relative overflow-hidden h-80 md:h-auto">
                    <img 
                      src={member.imageUrl || "/faculty_placeholder.png"} 
                      alt={member.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent md:hidden" />
                  </div>
                  
                  {/* Info */}
                  <div className="md:w-1/2 p-8 flex flex-col justify-center">
                    <span className="text-xs uppercase tracking-widest font-black text-primary mb-2 block">{member.subject}</span>
                    <h3 className="text-2xl font-black text-navy mb-4 leading-tight">{member.name}</h3>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-start gap-3">
                        <GraduationCap size={18} className="text-accent mt-1" />
                        <div>
                          {member.qualifications.map((q, idx) => (
                            <p key={idx} className="text-sm font-medium text-navy/70 leading-tight">{q}</p>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Calendar size={18} className="text-accent" />
                        <p className="text-sm font-medium text-navy/70">Experience: {member.experience}</p>
                      </div>
                    </div>
                    
                    <div className="pt-6 border-t border-primary/10">
                      <div className="flex items-center gap-2">
                        <Award className="text-accent" size={20} />
                        <span className="text-xs font-bold text-navy/60 uppercase">Certified Excellence</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary/5 blur-[120px] rounded-full -z-0" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-accent/5 blur-[120px] rounded-full -z-0" />
    </section>
  );
};
