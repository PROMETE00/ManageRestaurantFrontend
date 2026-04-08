import React from 'react';
import { clsx } from 'clsx';

export const Card = ({ children, className = '', padded = true, hover = false }) => {
  return (
    <div
      className={clsx(
        'bg-surface border border-white/5 rounded-2xl overflow-hidden transition-all duration-300 shadow-xl shadow-black/20',
        padded ? 'p-6' : '',
        hover ? 'hover:border-primary/30 hover:shadow-primary/5' : '',
        className
      )}
    >
      {children}
    </div>
  );
};
