import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExternalExerciseRef } from "@/domain/entities/externalexerciseref/ExternalExerciseRef";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";
import { ExternalExercisesRefRepo } from "@/domain/repos/ExternalExercisesRefRepo.port";
import { IdGenerator } from "@/domain/services/IdGenerator.port";

export type CreateExerciseData = {
  externalExerciseId: string;
  source: string;
  name: string;
};

export async function createExercisesAndExternalExercisesNoSaveInRepo(
  exercisesInfo: CreateExerciseData[],
  exercisesRepo: ExercisesRepo,
  externalExercisesRefRepo: ExternalExercisesRefRepo,
  idGenerator: IdGenerator,
) {
  const externalExerciseIds = exercisesInfo.map(
    (info) => info.externalExerciseId,
  );

  const fetchedExternalExercises: ExternalExerciseRef[] =
    await externalExercisesRefRepo.getByExternalIdsAndSource(
      externalExerciseIds,
      exercisesInfo[0].source,
    );

  const existingExercises = await exercisesRepo.getExercisesByIds(
    fetchedExternalExercises.map((ref) => ref.exerciseId),
  );

  const createdExternalExercises: Record<string, ExternalExerciseRef> = {};
  const createdExercises: Record<string, Exercise> = {};

  if (externalExerciseIds.length !== fetchedExternalExercises.length) {
    for (const exerciseInfo of exercisesInfo) {
      const exists = fetchedExternalExercises.find(
        (ex) =>
          ex.externalId === exerciseInfo.externalExerciseId &&
          ex.source === exerciseInfo.source,
      );

      if (exists) continue;

      const newExerciseId = idGenerator.generateId();

      createdExternalExercises[exerciseInfo.externalExerciseId] =
        ExternalExerciseRef.create({
          externalId: exerciseInfo.externalExerciseId,
          source: exerciseInfo.source,
          exerciseId: newExerciseId,
        });

      createdExercises[exerciseInfo.externalExerciseId] = Exercise.create({
        id: newExerciseId,
        name: exerciseInfo.name,
      });
    }
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
  };
}
