import { MdOutlineVideoSettings } from "react-icons/md";
import { twMerge } from "tailwind-merge";

import TextMassive from "@/app/_ui/typography/TextMassive";

import ButtonCTA, { ButtonCTASecondary } from "../../ButtonCTA";
import Eyebrow from "./Eyebrow";

// TODO IMPORTANT: Finish styling when design is done
function HeroCopy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex flex-col gap-4", className)} {...rest}>
      <Eyebrow />

      <TextMassive
        as="h1"
        className="font-semibold text-text leading-18 font-secondary max-bp-landing-hero:leading-14"
      >
        Build the body that{" "}
        <span className="text-primary">gives you confidence</span> without
        obsessing over every gram.
      </TextMassive>

      <p className={`pt-1 text-text-minor-emphasis`}>
        Cimientos helps you simplify nutrition, stay consistent, and create a
        practical foundation for muscle gain, fat loss, and real
        self-confidence. No confusing plans. No extreme tracking. Just a clear
        path forward.
      </p>

      <div className="flex gap-4 pt-4 max-bp-landing-hero-smallest:flex-col">
        <ButtonCTA href="/auth/register">Start Your Journey</ButtonCTA>

        {/* 
        <ButtonCTASecondary>
          <MdOutlineVideoSettings size={20} className="my-auto mr-2" />
          See How It Works
        </ButtonCTASecondary>
          */}
      </div>
    </div>
  );
}

export default HeroCopy;
