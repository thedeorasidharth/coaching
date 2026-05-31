"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isMagnetic?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isMagnetic = true, children, ...props }, ref) => {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const localRef = useRef<HTMLButtonElement>(null);
    const buttonRef = (ref as any) || localRef;

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!isMagnetic) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = buttonRef.current?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      setPosition({ x: x * 0.3, y: y * 0.3 });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    const variants = {
      primary: "bg-primary text-white hover:bg-primary-hover shadow-[0_10px_20px_-10px_rgba(139,14,42,0.5)]",
      secondary: "bg-white border-2 border-primary text-primary hover:bg-primary-hover hover:text-white hover:border-primary-hover shadow-[0_10px_20px_-10px_rgba(139,14,42,0.15)]",
      outline: "border-2 border-primary text-primary hover:bg-primary-hover hover:text-white hover:border-primary-hover",
      ghost: "text-primary hover:bg-primary/10",
    };

    const sizes = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base font-medium",
      lg: "px-8 py-4 text-lg font-semibold",
    };

    return (
      <motion.button
        ref={buttonRef}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative overflow-hidden rounded-full transition-colors duration-300 active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as any)}
      >
        <span className="relative z-10">{children}</span>
        <motion.div
          className="absolute inset-0 z-0 bg-white/10"
          initial={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.5, opacity: 1 }}
          transition={{ duration: 0.4 }}
        />
      </motion.button>
    );
  }
);

Button.displayName = "Button";
