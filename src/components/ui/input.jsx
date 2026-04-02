import React from 'react';
import { clsx } from 'clsx';

export const Input = ({ label, error, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-medium text-zinc-400 ml-1 uppercase tracking-wider">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full bg-surface border border-white/5 rounded-xl px-4 py-3 text-sm text-foreground transition-all',
          'placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40',
          error ? 'border-red-500/50 focus:ring-red-500/40' : '',
          className
        )}
        {...props}
      />
      {error && <span className="text-[10px] text-red-500 ml-1">{error}</span>}
    </div>
  );
};
