import type { ReactNode } from 'react';

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(' ');
}

export function LegalPage({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="min-h-screen px-4 py-10 bg-background">
      <main
        className={cx(
          'max-w-3xl mx-auto leading-7 text-text',
          'bg-surface-card border border-border rounded-2xl shadow-sm',
          'px-8 py-10 sm:px-12 sm:py-12',
          className,
        )}
        {...props}
      >
        {children}
      </main>
    </div>
  );
}

export function LegalTitle({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h1
      className={cx(
        'text-3xl font-bold text-text pb-4 border-b border-border',
        className,
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function LegalMeta({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cx('mt-3 text-sm text-text-minor-emphasis', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function LegalSection({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <section
      className={cx('mt-8 pt-8 border-t border-border/60', className)}
      {...props}
    >
      {children}
    </section>
  );
}

export function LegalH2({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cx(
        'text-lg font-semibold text-primary pl-3 border-l-4 border-primary',
        className,
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function LegalH3({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cx('mt-5 text-base font-semibold text-text', className)}
      {...props}
    >
      {children}
    </h3>
  );
}

export function LegalP({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cx('mt-3 text-sm text-text leading-relaxed', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function LegalList({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cx(
        'pl-5 mt-3 space-y-1.5 list-disc marker:text-primary text-sm leading-relaxed',
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  );
}

export function LegalExternalLink({
  children,
  className,
  ...props
}: {
  children: ReactNode;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a
      className={cx(
        'text-primary underline underline-offset-2 hover:text-primary-shade transition-colors',
        className,
      )}
      {...props}
    >
      {children}
    </a>
  );
}
