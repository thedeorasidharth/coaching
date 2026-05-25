"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: "up" | "down" | "left" | "right";
  delay?: number;
  duration?: number;
  distance?: number;
}

export const ScrollReveal = ({ 
  children, 
  direction = "up", 
  delay = 0, 
  duration = 1, 
  distance = 50 
}: ScrollRevealProps) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const directions = {
      up: { y: distance },
      down: { y: -distance },
      left: { x: distance },
      right: { x: -distance },
    };

    const initialPos = directions[direction];

    gsap.fromTo(
      element,
      { 
        ...initialPos, 
        opacity: 0,
        visibility: "hidden"
      },
      {
        x: 0,
        y: 0,
        opacity: 1,
        visibility: "visible",
        duration,
        delay,
        ease: "power4.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [direction, delay, duration, distance]);

  return (
    <div ref={elementRef} className="invisible">
      {children}
    </div>
  );
};
