import { twMerge } from "tailwind-merge";

import SectionTitle from "./SectionTitle";

function LandingSection({
  title,
  subtitle,
  children,
  ...props
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <section
      className={twMerge(
        "flex px-35 flex-col gap-10 max-bp-landing-reduce-padding:px-15 max-bp-landing-reduce-more-padding:px-8",
        className,
      )}
      {...rest}
    >
      {title && <SectionTitle title={title} subtitle={subtitle} />}

      {children}
    </section>
  );
}

export default LandingSection;
