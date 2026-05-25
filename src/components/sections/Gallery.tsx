"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "@/lib/axios";
import { GalleryImage } from "@/types";

const staticImages: GalleryImage[] = [
  {
    _id: "classroom",
    imageUrl: "/gallery_classroom.png",
    caption: "State of the art interactive smart classrooms",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "library",
    imageUrl: "/gallery_library.png",
    caption: "Extensive library & peaceful study spots",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "lab",
    imageUrl: "/gallery_lab.png",
    caption: "Well-equipped physics & chemistry labs",
    createdAt: new Date().toISOString(),
  },
  {
    _id: "seminar",
    imageUrl: "/gallery_seminar.png",
    caption: "Interactive mentorship sessions and group learning",
    createdAt: new Date().toISOString(),
  }
];

export const Gallery = () => {
  const images = staticImages;
  const loading = false;

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12 sm:mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-black text-navy mb-4"
          >
            Campus Life
          </motion.h2>
          <p className="text-navy/60">A glimpse into the environment of excellence at EDUSPARK.</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 auto-rows-[200px]">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="animate-pulse bg-navy/5 rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
            {images.map((img, i) => (
              <motion.div
                key={img._id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="relative overflow-hidden rounded-[2rem] group cursor-pointer break-inside-avoid"
              >
                <img 
                  src={img.imageUrl} 
                  alt={img.caption || "Gallery"} 
                  className="w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 text-center">
                   <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center text-navy scale-0 group-hover:scale-100 transition-transform duration-500 mb-4">
                      <span className="font-bold text-xl">+</span>
                   </div>
                   {img.caption && (
                     <p className="text-white font-bold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                       {img.caption}
                     </p>
                   )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
