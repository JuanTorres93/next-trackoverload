import { twMerge } from "tailwind-merge";

import LandingSection from "../LandingSection";
import HeroCopy from "./HeroCopy";
import HeroImage from "./HeroImage";

// TODO IMPORTANT: Finish styling when design is done
function Hero({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection className={twMerge("relative pb-20", className)} {...rest}>
      <div className="grid relative z-3 grid-cols-[1fr_.8fr] items-center gap-10 mt-6">
        <HeroCopy />

        <HeroImage />
      </div>

      <div className="z-2 absolute inset-0 bg-[linear-gradient(to_top,var(--color-primary-lightest)_0%,transparent_60%)]" />
    </LandingSection>
  );
}

export default Hero;
