import { twMerge } from "tailwind-merge";

import TextLarge from "@/app/_ui/typography/TextLarge";

function CEOCopy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "bg-white flex flex-col gap-6 justify-center px-8.5 py-13 rounded-2xl",
        className,
      )}
      {...rest}
    >
      <h3 className="text-[28px] font-medium text-primary">
        Why I Created This App?
      </h3>

      <TextLarge as="div" className="flex flex-col gap-4.5">
        <p>
          When I first started with fitness, I struggled to find an app that
          made the process simple and clear for beginners. Tracking workouts,
          meals and progress across multiple apps was overwhelming.
        </p>

        <p>
          I created this app to make fitness simple, focused, and
          straightforward so users can see progress early, adjust quickly, and
          stay motivated.
        </p>

        <p className="pt-2">What You Can Do:</p>

        <ul className="list-disc list-inside ">
          <li>
            Plan meals with focus on calories and protein, and create reusable
            recipes.
          </li>

          <li>Build and customize workout templates.</li>

          <li>Track strength progress and body weight over time.</li>
        </ul>

        <p>
          This app removes friction, helps build consistency, and gives you a
          practical, sustainable system to transform your body with confidence.
        </p>
      </TextLarge>
    </div>
  );
}

export default CEOCopy;
