import { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

interface CalloutProps {
  children: ReactNode;
  className?: string;
}

export default function Callout({ children, className = "" }: CalloutProps) {
  return (
    <div
      className={twMerge(
        "not-prose my-10 rounded-r-2xl bg-primary/[0.07] border-l-4 border-primary px-7 py-5 text-lg font-semibold leading-relaxed text-text",
        className,
      )}
    >
      {children}
    </div>
  );
}
