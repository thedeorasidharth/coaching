"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Courses } from "@/components/sections/Courses";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { Faculty } from "@/components/sections/Faculty";
import { Roadmap } from "@/components/sections/Roadmap";
import { DailyQuiz } from "@/components/sections/DailyQuiz";
import { SmartClassroom } from "@/components/sections/SmartClassroom";
import { Gallery } from "@/components/sections/Gallery";
import { Notices } from "@/components/sections/Notices";
import { DemoForm } from "@/components/sections/DemoForm";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Courses />
      <WhyChooseUs />
      <SmartClassroom />
      <Faculty />
      <Roadmap />
      <DailyQuiz />
      <Notices />
      <Gallery />
      <DemoForm />
      <Contact />
      <Footer />
      
      {/* WhatsApp Floating Button */}
      <a 
        href="https://wa.me/919460234151" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 lg:bottom-8 lg:right-8 z-50 w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 animate-bounce"
        aria-label="Contact Us on WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          className="w-6 h-6 sm:w-8 sm:h-8" 
          fill="white"
        >
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.526-2.961-2.64-.086-.115-.689-.916-.689-1.742 0-.826.431-1.231.585-1.41.154-.179.33-.223.44-.223.11 0 .22 0 .315.005.101.002.238-.039.373.286.14.337.478 1.164.519 1.249.04.085.07.184.01.304-.06.12-.091.194-.181.299-.09.105-.189.234-.269.315-.09.09-.184.188-.079.368.105.18.468.773.999 1.246.684.609 1.26.799 1.44.888.18.089.284.074.389-.046.105-.12.446-.52.566-.697.12-.177.239-.149.404-.089.164.059 1.041.492 1.221.582.181.089.301.134.346.21.046.075.046.435-.098.839z" />
          <path d="M12.036 3c-4.964 0-9 4.036-9 9 0 1.563.404 3.067 1.126 4.387L2.943 21.01l4.777-1.253C9.006 20.477 10.485 21 12.034 21c4.964 0 9-4.036 9-9s-4.036-9-9-9zm0 16.5c-1.398 0-2.733-.377-3.889-1.035l-.28-.16-2.885.757.77-2.812-.175-.28c-.628-1.009-.961-2.179-.961-3.38 0-3.584 2.916-6.5 6.502-6.5 3.584 0 6.5 2.916 6.502 6.5 0 3.585-2.917 6.5-6.504 6.5z" />
        </svg>
      </a>
    </main>
  );
}
