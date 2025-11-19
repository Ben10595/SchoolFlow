
import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noHover?: boolean;
  variant?: 'default' | 'featured' | 'alert';
  delay?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  noHover = false,
  variant = 'default',
  delay = 0
}) => {
  // VisionOS Base Styles: High Blur, Saturated Backdrop, Smooth Transition
  const baseStyles = "group relative overflow-hidden rounded-[2.5rem] transition-all duration-500 ease-vision border backdrop-blur-3xl backdrop-saturate-[180%]";
  
  const variants = {
    default: "bg-white/60 dark:bg-[#0f172a]/40 border-white/40 dark:border-white/10 shadow-2xl shadow-indigo-500/10 dark:shadow-black/40",
    featured: "bg-white/70 dark:bg-[#5E35B1]/20 border-white/50 dark:border-white/10 shadow-2xl shadow-brand-purple/20 dark:shadow-black/50",
    alert: "bg-white/70 dark:bg-[#D81B60]/10 border-brand-magenta/20 dark:border-brand-magenta/20 shadow-2xl shadow-brand-magenta/10"
  };

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        animate-fade-in-up
        ${(onClick && !noHover) ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-brand-purple/20 dark:hover:shadow-brand-neon/20 active:scale-[0.98] active:duration-200' : ''}
        ${className}
      `}
    >
      {/* Layer 1: Enhanced Noise Overlay (12% Opacity) */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none bg-noise z-0 mix-blend-overlay" />
      
      {/* Layer 2: Vision Pro Top Gradient (Light Source) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-white/5 to-transparent opacity-100 pointer-events-none" />
      
      {/* Layer 3: 3D Depth Inset Shadow (Top Highlight) */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/90 to-transparent opacity-90 shadow-[0_1px_2px_rgba(255,255,255,0.5)_inset]" />
      
      {/* Layer 4: Bottom Reflection (Glass Edge) */}
      <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />

      {/* Layer 5: Shine Effect on Hover (45 deg sweep) */}
      {!noHover && onClick && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
           <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/20 to-transparent -translate-x-[150%] -translate-y-[150%] transition-transform duration-1000 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0 rotate-45 blur-2xl" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};
