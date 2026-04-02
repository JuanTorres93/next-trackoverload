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
        `not-prose my-8 pl-5 border-l-[3px] border-primary/50 font-medium leading-relaxed text-text`,
        className,
      )}
    >
      {children}
    </div>
  );
}
