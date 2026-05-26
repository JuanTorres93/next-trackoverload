import { twMerge } from "tailwind-merge";

import LandingSection from "../LandingSection";
import CEOCopy from "./CEOCopy";
import CEOView from "./CEOView";

// TODO IMPORTANT: Finish styling when design is done
function CEOMessage({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <LandingSection
      className={twMerge("", className)}
      title="A Message from Our CEO: Simple, Focused Fitness for Real Results."
      {...rest}
    >
      <div className="grid grid-cols-[.33fr_1fr] gap-6">
        <CEOView />

        <CEOCopy />
      </div>
    </LandingSection>
  );
}

export default CEOMessage;
