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
    <div
      className={twMerge("flex items-start w-full max-w-4xl gap-6 ", className)}
      {...rest}
    >
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
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
}

function PreviewCard({
  formState,
  setField,
  invalidForm,
  resetForm,
  isLoading,
  setIsLoading,
  ...props
}: {
  formState: NewTemplateFormState;
  setField: SetFieldType;
  invalidForm: boolean;
  resetForm: () => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  async function handleCreateTemplate() {
    if (invalidForm) return;

    try {
      setIsLoading(true);

      const templateLines: CreateWorkoutTemplateLineData[] =
        formState.selectedExercises.map((exerciseEntry) => ({
          externalExerciseId:
            exerciseEntry.exerciseFinderResult.externalRef.externalId,
          source: exerciseEntry.exerciseFinderResult.externalRef.source,
          name: exerciseEntry.exerciseFinderResult.exercise.name,
          sets: exerciseEntry.sets,
        }));

      await createWorkoutTemplateForLoggedInUser({
        name: formState.newTemplateName,
        templateLines,
      });

      resetForm();
    } catch (error) {
      // TODO IMPORTANT HANDLE ERRORS
      // TODO DELETE THESE DEBUG LOGS
      console.log("error");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={twMerge(
        "p-6 bg-surface-card rounded-2xl shadow-sm flex flex-col gap-4",
        className,
      )}
      {...rest}
    >
      <FormTitleTextArea
        className="-mb-2 text-center"
        value={formState.newTemplateName}
        onChange={(e) => setField("newTemplateName", e.target.value)}
        placeholder="Nombre de la nueva plantilla"
        autoFocus
        data-testid="template-name-input"
      />

      <WorkoutTemplateSummary formState={formState} />

      <ButtonNew
        className="mt-4"
        disabled={invalidForm}
        data-testid="create-template-button"
        onClick={handleCreateTemplate}
        isLoading={isLoading}
      >
        Crear plantilla
      </ButtonNew>
    </div>
  );
}

function WorkoutTemplateSummary({
  formState,
  ...props
}: {
  formState: NewTemplateFormState;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const totalExercises = formState.selectedExercises.length || 0;
  const totalSets = formState.selectedExercises.reduce(
    (sum, exercise) => sum + exercise.sets,
    0,
  );

  return (
    <div
      className={twMerge(
        "border-b border-t justify-around border-text-minor-emphasis/30 grid grid-cols-[1fr_min-content_1fr] gap-4 py-4",
        className,
      )}
      {...rest}
    >
      <DataNumber value={totalExercises} label="Ejercicios" />

      <div className="border-l border-text-minor-emphasis/30"></div>

      <DataNumber value={totalSets} label="Sets" />
    </div>
  );
}

function DataNumber({
  value,
  label,
  ...props
}: { value: number; label: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div {...rest} className={twMerge("flex flex-col text-center", className)}>
      <span className="text-xl font-semibold">{value}</span>
      <span className="text-sm text-text-minor-emphasis">{label}</span>
    </div>
  );
}

type SetFieldType = (
  fieldName: keyof NewTemplateFormState,
  value: NewTemplateFormState[keyof NewTemplateFormState],
) => void;

export default NewTemplateForm;
