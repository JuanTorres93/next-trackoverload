"use client";

import { twMerge } from "tailwind-merge";

import ButtonNew from "@/app/_ui/buttons/ButtonNew";
import { CreateWorkoutTemplateLineData } from "@/application-layer/use-cases/workouttemplate/common/createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo";

import { useFormSetup } from "../../_hooks/useFormSetup";
import FormTitleTextArea from "../common/FormTitleInput";
import ExerciseSearch, {
  SelectedExerciseEntry,
} from "../exercise/ExerciseSearch";
import { createWorkoutTemplateForLoggedInUser } from "./actions";

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

      <PreviewCard
        formState={formState}
        setField={setField}
        invalidForm={invalidForm}
        resetForm={resetForm}
      />
    </div>
  );
}

function PreviewCard({
  formState,
  setField,
  invalidForm,
  resetForm,
  ...props
}: {
  formState: NewTemplateFormState;
  setField: SetFieldType;
  invalidForm: boolean;
  resetForm: () => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  function handleCreateTemplate() {
    if (invalidForm) return;

    const templateLines: CreateWorkoutTemplateLineData[] =
      formState.selectedExercises.map((exerciseEntry) => ({
        externalExerciseId:
          exerciseEntry.exerciseFinderResult.externalRef.externalId,
        source: exerciseEntry.exerciseFinderResult.externalRef.source,
        name: exerciseEntry.exerciseFinderResult.exercise.name,
        sets: exerciseEntry.sets,
      }));

    createWorkoutTemplateForLoggedInUser({
      name: formState.newTemplateName,
      templateLines,
    });

    resetForm();
  }

  return (
    <div className={twMerge("", className)} {...rest}>
      <FormTitleTextArea
        value={formState.newTemplateName}
        onChange={(e) => setField("newTemplateName", e.target.value)}
        placeholder="Nombre de la nueva plantilla"
        autoFocus
        data-testid="template-name-input"
      />

      <ButtonNew
        disabled={invalidForm}
        data-testid="create-template-button"
        onClick={handleCreateTemplate}
      >
        Crear plantilla
      </ButtonNew>
    </div>
  );
}

type SetFieldType = (
  fieldName: keyof NewTemplateFormState,
  value: NewTemplateFormState[keyof NewTemplateFormState],
) => void;

export default NewTemplateForm;
