import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExternalExerciseRef } from "@/domain/entities/externalexerciseref/ExternalExerciseRef";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";
import { ExternalExercisesRefRepo } from "@/domain/repos/ExternalExercisesRefRepo.port";
import { IdGenerator } from "@/domain/services/IdGenerator.port";

export type CreateWorkoutTemplateLineData = {
  externalExerciseId: string;
  source: string;
  name: string;
  sets: number;
};

export async function createExercisesAndExternalExercisesForWorkoutTemplateLineNoSaveInRepo(
  workoutTemplateLinesInfo: CreateWorkoutTemplateLineData[],
  exercisesRepo: ExercisesRepo,
  externalExercisesRefRepo: ExternalExercisesRefRepo,
  idGenerator: IdGenerator,
) {
  const externalExerciseIds = workoutTemplateLinesInfo.map(
    (info) => info.externalExerciseId,
  );

  const fetchedExternalExercises: ExternalExerciseRef[] =
    await externalExercisesRefRepo.getByExternalIdsAndSource(
      externalExerciseIds,
      workoutTemplateLinesInfo[0].source,
    );

  const existingExercises = await exercisesRepo.getExercisesByIds(
    fetchedExternalExercises.map((ref) => ref.exerciseId),
  );

  const createdExternalExercises: Record<string, ExternalExerciseRef> = {};
  const createdExercises: Record<string, Exercise> = {};

  if (externalExerciseIds.length !== fetchedExternalExercises.length) {
    for (const lineInfo of workoutTemplateLinesInfo) {
      const alreadyExistsInRepo = fetchedExternalExercises.find(
        (ex) =>
          ex.externalId === lineInfo.externalExerciseId &&
          ex.source === lineInfo.source,
      );

      if (alreadyExistsInRepo) continue;

      const newExerciseId = idGenerator.generateId();

      createdExternalExercises[lineInfo.externalExerciseId] =
        ExternalExerciseRef.create({
          externalId: lineInfo.externalExerciseId,
          source: lineInfo.source,
          exerciseId: newExerciseId,
        });

      createdExercises[lineInfo.externalExerciseId] = Exercise.create({
        id: newExerciseId,
        name: lineInfo.name,
      });
    }
  }

  const setsMapByExternalId: Record<
    string,
    { exerciseId: string; sets: number }
  > = {};

  // Existing exercises
  for (const existingExternalExercise of fetchedExternalExercises) {
    const lineInfo = workoutTemplateLinesInfo.find(
      (info) => info.externalExerciseId === existingExternalExercise.externalId,
    );

    setsMapByExternalId[existingExternalExercise.externalId] = {
      exerciseId: existingExternalExercise.exerciseId,
      sets: lineInfo!.sets,
    };
  }

  // Just created exercises
  for (const missingExtExerciseId of Object.keys(createdExternalExercises)) {
    const lineInfo = workoutTemplateLinesInfo.find(
      (info) => info.externalExerciseId === missingExtExerciseId,
    );

    setsMapByExternalId[missingExtExerciseId] = {
      exerciseId: createdExternalExercises[missingExtExerciseId].exerciseId,
      sets: lineInfo!.sets,
    };
  }

  const allExercises = [
    ...existingExercises,
    ...Object.values(createdExercises),
  ];

  return {
    existingExercises,
    fetchedExternalExercises,
    createdExercises,
    createdExternalExercises,
    allExercises,
    setsMapByExternalId,
  };
}
