"use client";
import { twMerge } from "tailwind-merge";

import ExerciseSearch from "@/app/_features/exercise/ExerciseSearch";

function NewTemplateForm({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <ExerciseSearch>
        <div className="flex gap-2">
          <ExerciseSearch.SearchTermInput />
        </div>

        <ExerciseSearch.FoundExercisesList className="mb-3" />
        <ExerciseSearch.SelectedExercisesList />
      </ExerciseSearch>
    </div>
  );
}

export default NewTemplateForm;
