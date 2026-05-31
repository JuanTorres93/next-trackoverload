import { twMerge } from "tailwind-merge";

import LandingSection from "../LandingSection";
import HeroCopy from "./HeroCopy";
import HeroImage from "./HeroImage";

function Hero({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection
      className={twMerge(
        "relative pb-20 rounded-b-4xl overflow-hidden",
        className,
      )}
      {...rest}
    >
      <div className="grid relative z-3 grid-cols-[1fr_.75fr] items-stretch gap-10 mt-6 max-bp-landing-hero:grid-cols-1 max-bp-landing-hero:gap-16">
        <HeroCopy />

        <HeroImage />
      </div>

      <div className="z-2 absolute inset-0 opacity-70 bg-[linear-gradient(to_top,var(--color-primary-lightest)_0%,transparent_60%)]" />
    </LandingSection>
  );
}

export default Hero;
