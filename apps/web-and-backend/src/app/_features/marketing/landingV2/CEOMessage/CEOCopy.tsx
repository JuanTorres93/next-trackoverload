import { twMerge } from "tailwind-merge";

// TODO IMPORTANT: Finish styling when design is done
function CEOCopy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "bg-white flex flex-col gap-6 justify-center px-8 rounded-2xl",
        className,
      )}
      {...rest}
    >
      <h3 className="text-xl font-semibold text-primary-light">
        Why I Created This App?
      </h3>

      <div className="flex flex-col gap-4 text-sm ">
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

        <p>What You Can Do:</p>

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
      </div>
    </div>
  );
}

export default CEOCopy;
