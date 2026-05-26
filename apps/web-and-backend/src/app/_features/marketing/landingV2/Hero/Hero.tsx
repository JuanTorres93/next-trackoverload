import { twMerge } from "tailwind-merge";

import HeroCopy from "./HeroCopy";
import HeroImage from "./HeroImage";

function Hero({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <div className="grid grid-cols-[1fr_.8fr] items-center gap-10 mt-6">
        <HeroCopy />

        <HeroImage />
      </div>
    </div>
  );
}

export default Hero;
