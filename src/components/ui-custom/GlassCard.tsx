
import { cn } from "@/lib/utils";
import React from "react";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  animationDelay?: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className,
  animationDelay = 0
}) => {
  return (
    <div 
      className={cn(
        "glass-card rounded-2xl p-6 appear-animate", 
        className
      )}
      style={{ '--delay': animationDelay } as React.CSSProperties}
    >
      {children}
    </div>
  );
};

export default GlassCard;
