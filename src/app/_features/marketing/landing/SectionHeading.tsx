import { ReactNode } from "react";

import { twMerge } from "tailwind-merge";

interface SectionHeadingProps {
  children: ReactNode;
  subtitle?: string;
  align?: "left" | "center" | "right";
  className?: string;
  inverted?: boolean;
}

export default function SectionHeading({
  children,
  subtitle,
  align = "center",
  className = "",
  inverted = false,
}: SectionHeadingProps) {
  const alignClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  return (
    <div className={twMerge(`mb-10 ${alignClasses[align]} ${className}`)}>
      <h2
        className={twMerge(
          "text-4xl font-bold leading-tight tracking-tight md:text-5xl",
          inverted ? "text-white" : "text-text",
        )}
      >
        {children}
      </h2>

      <div
        className={`w-14 h-1 mt-5 rounded-full bg-gradient-to-r from-primary to-primary-light ${align === "center" ? "mx-auto" : ""}`}
      />
      {subtitle && (
        <p
          className={twMerge(
            `max-w-2xl mt-5 text-lg ${align === "center" ? "mx-auto" : ""}`,
            inverted ? "text-white/60" : "text-text-minor-emphasis",
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
