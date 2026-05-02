"use client";
import { useState } from "react";

import { twMerge } from "tailwind-merge";

import ExerciseSearch from "@/app/_features/exercise/ExerciseSearch";
import { SelectedExerciseEntry } from "@/app/_features/exercise/ExerciseSearch";
import { useFormSetup } from "@/app/_hooks/useFormSetup";

import FormTitleTextArea from "../common/FormTitleInput";

export type NewTemplateFormState = {
  newTemplateName: string;
  selectedExercises: SelectedExerciseEntry[];
};

const INITIAL_FORM_STATE: NewTemplateFormState = {
  newTemplateName: "",
  selectedExercises: [],
};

function NewTemplateForm({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const { formState, setField, isLoading, resetForm, setIsLoading } =
    useFormSetup<NewTemplateFormState>(INITIAL_FORM_STATE);

  const hasExercises = formState.selectedExercises.length > 0;

  const invalidForm =
    formState.newTemplateName.trim() === "" || !hasExercises || isLoading;

  function onExerciseSelection(exerciseEntries: SelectedExerciseEntry[]) {
    setField("selectedExercises", exerciseEntries);
  }

  return (
    <div className={twMerge("", className)} {...rest}>
      <ExerciseSearch onExerciseSelection={onExerciseSelection}>
        <div className="flex gap-2">
          <ExerciseSearch.SearchTermInput />
        </div>

        <ExerciseSearch.FoundExercisesList className="mb-3" />
        <ExerciseSearch.SelectedExercisesList />
      </ExerciseSearch>

      <PreviewCard formState={formState} setField={setField} />
    </div>
  );
}

function PreviewCard({
  formState,
  setField,
  ...props
}: {
  formState: NewTemplateFormState;
  setField: (
    fieldName: keyof NewTemplateFormState,
    value: NewTemplateFormState[keyof NewTemplateFormState],
  ) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <FormTitleTextArea
        value={formState.newTemplateName}
        onChange={(e) => setField("newTemplateName", e.target.value)}
        placeholder="Nombre de la nueva plantilla"
      />
    </div>
  );
}

export default NewTemplateForm;
