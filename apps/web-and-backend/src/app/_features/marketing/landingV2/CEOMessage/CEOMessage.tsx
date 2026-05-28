import { twMerge } from "tailwind-merge";

import LandingSection from "../LandingSection";
import CEOCopy from "./CEOCopy";
import CEOView from "./CEOView";

// TODO IMPORTANT: Finish styling when design is done
function CEOMessage({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection
      className={twMerge("relative overflow-hidden rounded-4xl", className)}
      title="A Message from Our CEO: Simple, Focused Fitness for Real Results."
      {...rest}
    >
      <div className="relative z-3 py-20 grid grid-cols-[.40fr_1fr] gap-7.5">
        <CEOView />

        <CEOCopy />
      </div>

      {/* Gradients */}
      <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute -top-40 -left-25 h-300 w-220 bg-radial from-primary-light/30 via-primary-lightest/20 to-transparent blur-2xl" />

        <div className="absolute -top-30 -right-30 h-300 w-192.25 bg-radial from-primary-light/30 via-primary-lightest/20 to-transparent blur-2xl" />
      </div>
    </LandingSection>
  );
}

export default CEOMessage;
