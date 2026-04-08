"use client";

import Link from "next/link";

import { useState } from "react";

import { HiPlay, HiRectangleStack } from "react-icons/hi2";
import { twMerge } from "tailwind-merge";

import SpinnerMini from "@/app/_ui/SpinnerMini";
import { WorkoutTemplateDTO } from "@/application-layer/dtos/WorkoutTemplateDTO";

function WorkoutTemplate({
  workoutTemplate,
  ...props
}: {
  workoutTemplate: WorkoutTemplateDTO;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const [isStartingWorkout, setIsStartingWorkout] = useState(false);

  const exerciseCount = workoutTemplate.exercises.length;
  const totalSets = workoutTemplate.exercises.reduce(
    (sum, e) => sum + e.sets,
    0,
  );

  async function handleStartWorkout() {
    if (isStartingWorkout) return;

    setIsStartingWorkout(true);

    try {
      // TODO IMPORTANT: implement
      console.log("Start workout with template:", workoutTemplate);

      // MOck wait for tests (IMPORTANT: remove this when implemented)
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch {
    } finally {
      setIsStartingWorkout(false);
    }
  }

  return (
    <div
      className={twMerge(
        "rounded-2xl border border-border/40 bg-surface-card shadow-sm overflow-hidden",
        className,
      )}
      {...rest}
    >
      <div className="flex items-start gap-3 p-4 pb-3">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 shrink-0">
          <HiRectangleStack className="text-lg text-primary" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold leading-tight truncate text-text">
            {workoutTemplate.name}
          </h3>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-light text-text-minor-emphasis">
              {exerciseCount} ejercicio{exerciseCount !== 1 ? "s" : ""}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-surface-light text-text-minor-emphasis">
              {totalSets} series
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 px-4 pt-1 pb-4">
        <Link
          href={`/app/templates/${workoutTemplate.id}`}
          className="text-xs transition-colors text-text-minor-emphasis underline-offset-2 hover:underline hover:text-text"
        >
          Ver plantilla
        </Link>

        <button
          onClick={handleStartWorkout}
          data-testid="start-workout-button"
          disabled={isStartingWorkout}
          className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isStartingWorkout ? (
            <span data-testid="start-workout-spinner">
              <SpinnerMini className="shrink-0" />
            </span>
          ) : (
            <HiPlay className="shrink-0" />
          )}
          Empezar
        </button>
      </div>
    </div>
  );
}

export default WorkoutTemplate;
