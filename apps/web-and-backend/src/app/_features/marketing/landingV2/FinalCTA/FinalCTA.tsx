import { twMerge } from "tailwind-merge";

import ButtonCTA, { ButtonCTASecondary } from "../../landing/ButtonCTA";
import LandingSection from "../LandingSection";

function FinalCTA({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection
      className={twMerge(
        "h-115 relative rounded-3xl overflow-hidden bg-text flex items-center justify-center ",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col gap-6 text-center text-white z-3 max-w-180">
        <h2 className="flex flex-col gap-2 text-5xl font-semibold font-secondary">
          <span>Start your journey with nutrition.</span>

          <span>Build a strong foundation.</span>
        </h2>

        <p className="text-lg text-[#aeaead]">
          No more overthinking or waiting for the perfect moment. Take the first
          step today with Cimientos and create something meaningful for
          yourself.
        </p>

        <div className="flex items-stretch justify-center gap-4 pt-6">
          <ButtonCTA>Start Your Journey</ButtonCTA>

          <ButtonCTASecondary href="/#features">
            Explore Features
          </ButtonCTASecondary>
        </div>
      </div>

      <div className="z-2 absolute inset-0 bg-[radial-gradient(circle,var(--color-primary-shade)_0%,transparent_70%)] " />
    </LandingSection>
  );
}

export default FinalCTA;
