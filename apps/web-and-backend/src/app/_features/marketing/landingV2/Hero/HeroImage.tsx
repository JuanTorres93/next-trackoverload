import Image from "next/image";

import { PiFireDuotone } from "react-icons/pi";
import { twMerge } from "tailwind-merge";

import afterImage from "@/../public/after.jpg";

import { SemiCircleProgress } from "../SemicircleProgress";

function HeroImage({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("relative h-full", className)} {...rest}>
      <PopupOverlay />

      <div className="relative bg-primary-lightest ml-8 mt-8 h-[92%] w-[92%] overflow-hidden rounded-3xl max-bp-landing-hero:h-160 ">
        <Image
          src={afterImage}
          alt={"Hero Image"}
          fill
          className="object-cover"
          priority
        />
      </div>
    </div>
  );
}

function PopupOverlay({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "bg-primary-light absolute flex flex-col gap-2 top-0 left-0 z-2 w-fit rounded-[18px] p-3 pb-1 text-white shadow-2xl",
        className,
      )}
      {...rest}
    >
      <span className="text-[10px] font-semibold leading-none ">
        Monday, June 25
      </span>

      <SemiCircleProgress
        value={1250}
        max={1800}
        unit="kcal"
        icon={<PiFireDuotone size={16} />}
      />
    </div>
  );
}

export default HeroImage;
