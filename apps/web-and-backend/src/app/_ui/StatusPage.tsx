import type { ReactNode } from 'react';

import Logo from './Logo';

type StatusPageProps = {
  badge?: string;
  code: string;
  title: string;
  description: string;
  accentClassName: string;
  detail?: ReactNode;
  actions: ReactNode;
};

function StatusPage({
  badge,
  code,
  title,
  description,
  accentClassName,
  detail,
  actions,
}: StatusPageProps) {
  return (
    <main className="relative isolate min-h-dvh overflow-hidden bg-background px-6 py-10 text-text sm:px-8 lg:px-12">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(0,130,54,0.14),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(0,130,54,0.08),_transparent_30%)]" />
      <div className="absolute left-1/2 top-0 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      <div className="mx-auto flex min-h-[calc(100dvh-5rem)] max-w-6xl items-center justify-center">
        <section className="w-full max-w-3xl animate-fade-in">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-border/60 bg-white px-4 py-2">
            <Logo size={28} />
            <span className="text-sm font-medium tracking-[0.24em] uppercase text-text-minor-emphasis">
              Cimientos
            </span>
          </div>

          {badge && (
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/8 px-4 py-2 text-xs font-semibold tracking-[0.24em] uppercase text-primary">
              {badge}
            </div>
          )}

          <div className={`${badge ? 'mt-6' : 'mt-2'} flex items-end gap-4`}>
            <span
              className={`text-6xl font-black leading-none sm:text-7xl ${accentClassName}`}
            >
              {code}
            </span>
            <div className="mb-2 h-px flex-1 bg-border/80" />
          </div>

          <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-tight sm:text-5xl">
            {title}
          </h1>

          <p className="mt-5 max-w-2xl text-lg leading-8 text-text-minor-emphasis sm:text-xl">
            {description}
          </p>

          <div className="mt-10 flex flex-wrap gap-4">{actions}</div>

          {detail && <div className="mt-12 max-w-2xl space-y-4">{detail}</div>}
        </section>
      </div>
    </main>
  );
}

export default StatusPage;
