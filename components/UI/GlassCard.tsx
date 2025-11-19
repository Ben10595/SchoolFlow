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
  const baseStyles = "group relative overflow-hidden rounded-[2rem] transition-all duration-500 ease-vision border backdrop-blur-2xl";
  
  const variants = {
    default: "bg-white/60 dark:bg-[#0f172a]/40 border-white/40 dark:border-white/10 shadow-lg shadow-indigo-500/5 dark:shadow-black/40",
    featured: "bg-white/70 dark:bg-[#5E35B1]/20 border-white/50 dark:border-white/10 shadow-xl shadow-brand-purple/10 dark:shadow-black/50",
    alert: "bg-white/70 dark:bg-[#D81B60]/10 border-brand-magenta/20 dark:border-brand-magenta/20 shadow-xl shadow-brand-magenta/10"
  };

  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`
        ${baseStyles}
        ${variants[variant]}
        animate-fade-in-up
        ${(onClick && !noHover) ? 'cursor-pointer hover:scale-[1.02] hover:-translate-y-1 hover:shadow-2xl hover:shadow-brand-purple/10 dark:hover:shadow-brand-neon/10 active:scale-[0.98]' : ''}
        ${className}
      `}
    >
      {/* Layer 1: Noise Overlay (12% Opacity) */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none bg-noise z-0 mix-blend-overlay" />
      
      {/* Layer 2: Top Reflection Gradient (Vision Style) */}
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-100 pointer-events-none" />
      
      {/* Layer 3: Inner Shadow / Depth Highlight (Top Edge) */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-70" />

      {/* Layer 4: Shine Effect on Hover (45 deg) */}
      {!noHover && onClick && (
        <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700">
           <div className="absolute top-0 left-0 w-[200%] h-[200%] bg-gradient-to-br from-transparent via-white/10 to-transparent -translate-x-[150%] -translate-y-[150%] transition-transform duration-1000 ease-in-out group-hover:translate-x-0 group-hover:translate-y-0 rotate-45 blur-xl" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};