import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  noHover?: boolean;
  variant?: 'primary' | 'secondary';
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick, 
  noHover = false,
  variant = 'secondary',
}) => {
  // Themes managed via CSS variables/Tailwind classes in parent
  // Dark: bg-[#161a24] border-white/5
  // Light: bg-white border-slate-200 shadow-sm
  // Pink: bg-white/80 border-pink-200 shadow-sm backdrop-blur-xl

  const baseStyles = "relative overflow-hidden rounded-xl transition-all duration-300 ease-out shadow-biz backdrop-blur-md";
  
  // Dynamic border/bg logic handled via dark: prefix and default (light/pink) styles
  const variants = {
    primary: "bg-white dark:bg-[#161a24] border border-slate-200 dark:border-white/15",
    secondary: "bg-white dark:bg-[#161a24] border border-slate-200 dark:border-white/5",
  };

  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        animate-fade-in
        ${(onClick && !noHover) ? 'cursor-pointer hover:brightness-[0.98] dark:hover:brightness-110 hover:scale-[1.02]' : ''}
        ${className}
      `}
    >
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
};