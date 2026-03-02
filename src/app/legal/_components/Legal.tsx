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
    <main
      className={cx('max-w-3xl p-6 mx-auto leading-7', className)}
      {...props}
    >
      {children}
    </main>
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
    <h1 className={cx('text-3xl font-semibold', className)} {...props}>
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
      className={cx('mt-2 text-sm text-text-minor-emphasis', className)}
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
    <section className={cx('mt-8', className)} {...props}>
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
    <h2 className={cx('text-xl font-semibold', className)} {...props}>
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
    <h3 className={cx('mt-4 text-lg font-semibold', className)} {...props}>
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
    <p className={cx('mt-2', className)} {...props}>
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
    <ul className={cx('pl-6 mt-2 list-disc', className)} {...props}>
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
    <a className={cx('underline', className)} {...props}>
      {children}
    </a>
  );
}
