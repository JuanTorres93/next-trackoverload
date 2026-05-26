import { twMerge } from "tailwind-merge";

import HeroCopy from "./HeroCopy";
import HeroImage from "./HeroImage";

// TODO IMPORTANT: Finish styling when design is done
function Hero({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <section className={twMerge("", className)} {...rest}>
      <div className="grid grid-cols-[1fr_.8fr] items-center gap-10 mt-6">
        <HeroCopy />

        <HeroImage />
      </div>
    </section>
  );
}

export default Hero;
