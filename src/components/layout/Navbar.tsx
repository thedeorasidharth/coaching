"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Courses", href: "#courses" },
  { name: "Faculty", href: "#faculty" },
  { name: "Gallery", href: "#gallery" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-2 sm:p-4">
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "flex items-center justify-between w-full max-w-7xl px-4 sm:px-6 py-2 sm:py-3 rounded-full transition-all duration-300",
          isScrolled ? "glass shadow-lg" : "bg-transparent"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 sm:w-14 sm:h-14 group-hover:scale-105 transition-transform duration-300">
            <Image
              src="/logo.png"
              alt="EDUSPARK Study Center Logo"
              fill
              sizes="(max-width: 640px) 40px, 56px"
              priority
              className="object-contain"
            />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-navy leading-none mb-0.5 sm:mb-1">EDUSPARK</span>
            <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-primary leading-none">Study Center</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-navy/70 hover:text-primary transition-colors relative group"
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
          {/* <div className="flex items-center gap-3">
            <Link href="/login">
              <Button size="sm" variant="outline" className="hidden lg:flex border-primary/20 text-navy hover:bg-primary/5">
                Student Login
              </Button>
            </Link>
            <Link href="/admin/login">
              <Button size="sm" variant="ghost" className="hidden lg:flex text-navy/60 hover:text-primary">
                Admin
              </Button>
            </Link>
            <Button size="sm" onClick={() => document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' })}>
              Free Demo
            </Button>
          </div> */}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-navy p-2 hover:bg-navy/5 rounded-full transition-all focus:outline-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </motion.div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 md:hidden"
          >
            <div className="absolute inset-0 bg-navy/20 backdrop-blur-xl" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative w-full max-w-sm glass rounded-3xl p-8 flex flex-col items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-2xl font-display font-bold text-navy hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              {/* <div className="w-full flex flex-col gap-3">
                <Link href="/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="lg" variant="outline" className="w-full border-primary/20 text-navy">
                    Student Login
                  </Button>
                </Link>
                <Link href="/admin/login" className="w-full" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button size="lg" variant="ghost" className="w-full text-navy/60">
                    Admin Login
                  </Button>
                </Link>
                <Button size="lg" className="w-full" onClick={() => {
                  setIsMobileMenuOpen(false);
                  document.getElementById('demo-form')?.scrollIntoView({ behavior: 'smooth' });
                }}>
                  Book Free Demo
                </Button>
              </div> */}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
