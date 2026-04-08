import { twMerge } from "tailwind-merge";
import { HiBolt } from "react-icons/hi2";

import { ExerciseDTO } from "@/application-layer/dtos/ExerciseDTO";

function Exercise({
  exercise,
  ...props
}: { exercise: ExerciseDTO } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "flex items-center gap-3 p-3 rounded-xl bg-surface-card border border-border/50 hover:border-border/70 transition-colors",
        className,
      )}
      {...rest}
    >
      <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-primary/10 shrink-0">
        <HiBolt className="text-base text-primary" />
      </div>

      <span className="text-sm font-semibold truncate text-text">
        {exercise.name}
      </span>
    </div>
  );
}

export default Exercise;
