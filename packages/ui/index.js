import React from "react";

export function cx(...values) {
  return values.filter(Boolean).join(" ");
}

export function ShellCard({ className = "", children }) {
  return (
    <div
      className={cx(
        "rounded-[28px] border border-white/10 bg-[rgba(15,23,42,0.72)] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.45)] backdrop-blur-xl",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SectionHeading({ eyebrow, title, description, actions = null }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2">
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--color-accent)]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">{title}</h2>
        {description ? <p className="max-w-2xl text-sm text-slate-300">{description}</p> : null}
      </div>
      {actions}
    </div>
  );
}

export function StatusPill({ tone = "neutral", children }) {
  const tones = {
    neutral: "bg-white/10 text-slate-200",
    success: "bg-emerald-500/15 text-emerald-300",
    warning: "bg-amber-500/15 text-amber-200",
    danger: "bg-rose-500/15 text-rose-200",
    info: "bg-sky-500/15 text-sky-200"
  };

  return (
    <span className={cx("inline-flex rounded-full px-3 py-1 text-xs font-medium", tones[tone] ?? tones.neutral)}>
      {children}
    </span>
  );
}
