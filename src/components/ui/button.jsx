import React from 'react';
import { clsx } from 'clsx';

export const Button = ({ children, className = '', variant = 'primary', size = 'md', ...props }) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none active:scale-95';
  
  const variants = {
    primary: 'bg-primary text-black hover:bg-primary-hover shadow-lg shadow-primary/10',
    secondary: 'bg-surface text-foreground hover:bg-surface-hover border border-white/5',
    ghost: 'bg-transparent text-foreground hover:bg-white/5',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/10',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-xl',
    lg: 'px-6 py-3 text-base rounded-2xl',
  };

  return (
    <button
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
