import { HiBolt } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import { ExerciseDTO } from "@/application-layer/dtos/ExerciseDTO";

function Exercise({
  exercise,
  isSelected = false,
  ...props
}: {
  exercise: ExerciseDTO;
  isSelected?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "flex items-center gap-3 p-3 rounded-xl cursor-pointer select-none transition-all border",
        isSelected
          ? "bg-primary/8 border-primary/25"
          : "bg-surface-card border-border/50 hover:border-border/70",
        className,
      )}
      {...rest}
    >
      <div
        className={`flex items-center justify-center rounded-lg w-9 h-9 shrink-0 ${
          isSelected ? "bg-primary/20" : "bg-primary/10"
        }`}
      >
        <HiBolt
          className={`text-base ${isSelected ? "text-primary/60" : "text-primary"}`}
        />
      </div>

      <span
        className={`text-sm font-semibold truncate ${
          isSelected ? "text-text-minor-emphasis" : "text-text"
        }`}
      >
        {exercise.name}
      </span>
    </div>
  );
}

export default Exercise;
