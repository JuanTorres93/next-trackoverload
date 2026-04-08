"use client";
import { useState } from "react";

import { HiBolt } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import Input from "@/app/_ui/Input";
import ButtonX from "@/app/_ui/buttons/ButtonX";
import { WorkoutTemplateLineDTO } from "@/application-layer/dtos/WorkoutTemplateLineDTO";

import LoadingOverlay from "../common/LoadingOverlay";

function WorkoutTemplateLine({
  workoutTemplateLine,
  exerciseName,
  onSetsChange,
  onRemove,
  ...props
}: {
  workoutTemplateLine: WorkoutTemplateLineDTO;
  exerciseName: string;
  onSetsChange?: (sets: number) => void;
  onRemove?: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemove() {
    if (!onRemove) return;
    setIsLoading(true);
    try {
      await onRemove();
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={twMerge(
        "relative grid grid-cols-[2.25rem_1fr_auto_auto] items-center gap-x-3 p-3 rounded-xl border border-border/50 bg-surface-card hover:border-border/70 transition-colors",
        className,
      )}
      {...rest}
    >
      {isLoading && <LoadingOverlay className="rounded-xl" />}

      {/* Icon */}
      <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10 shrink-0">
        <HiBolt className="text-base text-primary" />
      </div>

      {/* Name */}
      <p className="text-sm font-semibold leading-tight truncate text-text">
        {exerciseName}
      </p>

      {/* Sets input */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="text-xs text-text-minor-emphasis">Series</span>
        <Input
          type="number"
          defaultValue={workoutTemplateLine.sets}
          onChange={(e) => onSetsChange?.(Number(e.target.value))}
          disabled={isLoading}
          min={1}
          className="w-10 text-sm text-right"
          containerClassName="gap-1.5 px-2.5 py-1.5 min-w-0 shrink-0 border-border/60"
        />
      </div>

      {/* Remove button */}
      {onRemove && <ButtonX onClick={handleRemove} disabled={isLoading} />}
    </div>
  );
}

export default WorkoutTemplateLine;
