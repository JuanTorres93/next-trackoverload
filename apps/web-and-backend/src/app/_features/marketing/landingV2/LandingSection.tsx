import { twMerge } from "tailwind-merge";

import SectionTitle from "./SectionTitle";

// TODO IMPORTANT: Finish styling when design is done
function LandingSection({
  title,
  subtitle,
  children,
  ...props
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <section className={twMerge("flex flex-col gap-10", className)} {...rest}>
      <SectionTitle title={title} subtitle={subtitle} />

      {children}
    </section>
  );
}

export default LandingSection;
