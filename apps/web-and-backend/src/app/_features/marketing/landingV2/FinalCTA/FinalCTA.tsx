import { twMerge } from "tailwind-merge";

import TextHuge from "@/app/_ui/typography/TextHuge";
import TextLarge from "@/app/_ui/typography/TextLarge";

import ButtonCTA, { ButtonCTASecondary } from "../../ButtonCTA";
import LandingSection from "../LandingSection";

function FinalCTA({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection className={twMerge("", className)} {...rest}>
      <div className="relative flex flex-col items-center justify-center gap-6 px-10 overflow-hidden text-center text-white py-33 rounded-3xl bg-text max-bp-change-font:py-20 max-bp-landing-final-cta:py-10">
        <TextHuge
          as="h2"
          className="flex flex-col gap-2 font-semibold leading-15 z-3 font-secondary max-bp-change-font:leading-12"
        >
          Start your fitness journey with balanced nutrition and consistent
          exercise.
        </TextHuge>

        <TextLarge as="p" className=" z-3 text-[#aeaead]">
          No more overthinking or waiting for the perfect moment. Take the first
          step today with Cimientos and create something meaningful for
          yourself.
        </TextLarge>

        <div className="flex items-stretch justify-center gap-4 pt-6 z-3 max-bp-landing-final-cta:flex-col max-bp-landing-final-cta:w-full">
          <ButtonCTA href="/auth/register">Start Your Journey</ButtonCTA>

          <ButtonCTASecondary href="/#features">
            Explore Features
          </ButtonCTASecondary>
        </div>
        <div className="z-2 absolute inset-0 bg-[radial-gradient(circle,var(--color-primary-shade)_0%,transparent_70%)] " />
      </div>
    </LandingSection>
  );
}

export default FinalCTA;
