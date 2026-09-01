"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "navy" | "outline" | "ghost" | "destructive" | "icon";
  size?: "sm" | "md" | "lg" | "icon";
  isMagnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isMagnetic = false, children, disabled, ...props }, ref) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const localRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (ref as React.RefObject<HTMLButtonElement | null>) || localRef;

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isMagnetic || disabled) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = buttonRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      setPosition({ x: x * 0.2, y: y * 0.2 });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    const variants = {
      primary: "bg-primary text-white hover:bg-primary/90 shadow-md shadow-primary/20 active:scale-[0.98]",
      navy: "bg-navy text-white hover:bg-navy/90 shadow-md shadow-navy/20 active:scale-[0.98]",
      secondary: "bg-white border-2 border-primary text-primary hover:bg-primary/5 active:scale-[0.98]",
      outline: "bg-white border border-navy/10 text-navy hover:bg-navy/5 hover:border-navy/20 active:scale-[0.98]",
      ghost: "text-navy/70 hover:text-navy hover:bg-navy/5 active:scale-[0.98]",
      destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md shadow-red-600/20 active:scale-[0.98]",
      icon: "bg-white border border-navy/10 text-navy/60 hover:text-navy hover:bg-navy/5 active:scale-[0.98]",
    };

    const sizes = {
      sm: "h-9 px-3.5 text-xs font-bold rounded-xl",
      md: "h-11 px-5 text-sm font-bold rounded-xl",
      lg: "h-13 px-7 text-base font-bold rounded-2xl",
      icon: "w-10 h-10 p-0 rounded-xl flex items-center justify-center shrink-0",
    };

    return (
      <motion.button
        ref={buttonRef}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        disabled={disabled}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-sans transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as Record<string, unknown>)}
      >
        <span className="relative z-10 inline-flex items-center gap-2 leading-none">{children}</span>
      </motion.button>
    );
  }
);

Button.displayName = "Button";
