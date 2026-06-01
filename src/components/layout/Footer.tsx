"use client";

import React from "react";
import { Phone, MessageCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-instagram"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer = () => {
  const socialLinks = [
    {
      icon: InstagramIcon,
      href: "https://www.instagram.com/edusparksheoganj/",
      label: "Follow EDUSPARK on Instagram",
    },
    {
      icon: MessageCircle,
      href: "https://wa.me/+919413913136",
      label: "Chat with EDUSPARK on WhatsApp",
    },
    {
      icon: Phone,
      href: "tel:+919460234151",
      label: "Call EDUSPARK Office",
    },
  ];

  return (
    <footer className="bg-navy text-white pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-10 h-10 sm:w-14 sm:h-14 group-hover:scale-105 transition-transform duration-300">
                <Image
                  src="/logo.png"
                  alt="EDUSPARK Study Center Logo"
                  fill
                  sizes="(max-width: 640px) 40px, 56px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col justify-center">
                <span className="font-display text-xl sm:text-2xl font-black tracking-tight text-white leading-none mb-0.5 sm:mb-1">EDUSPARK</span>
                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest text-accent leading-none">Excellence Center</span>
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              Building concepts and creating toppers since 17+ years. Sheoganj&apos;s leading institute for IIT-JEE and NEET preparation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4">
              {["About Us", "Courses", "Faculty", "Gallery", "Contact"].map((link) => (
                <li key={link}>
                  <Link href={`#${link.toLowerCase()}`} className="text-white/50 hover:text-accent transition-colors text-sm">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h4 className="text-lg font-bold mb-6">Our Programs</h4>
            <ul className="space-y-4">
              {["IIT-JEE Preparation", "NEET Medical Entrance", "XI-XII Foundation", "Career Counseling", "Free Demo Classes"].map((item) => (
                <li key={item} className="text-white/50 text-sm">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <p className="text-white/50 text-sm mb-4">
              2nd Floor, Krishna Prime Complex, Opposite Ambuja Cement, Gaushala Road, Sheoganj – 307027
            </p>
            <p className="text-white/50 text-sm mb-2">+91 9460234151</p>
            <p className="text-white/50 text-sm">+91 7976049149</p>

            <div className="flex gap-4 mt-8">
              {socialLinks.map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-navy transition-all duration-300 text-white"
                >
                  <item.icon size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-white/30 text-xs">
            © 2024 EDUSPARK – Study Center For Excellence. All rights reserved.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-white/30 text-xs hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-white/30 text-xs hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
