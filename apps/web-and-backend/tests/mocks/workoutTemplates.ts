import {
  AppAddExerciseToWorkoutTemplateUsecase,
  AppCreateWorkoutTemplateUsecase,
} from "../../src/interface-adapters/app/use-cases/workouttemplate";
import { TestExercisesRepo } from "../../tests/repos/TestExercisesRepo";
import { TestExternalExercisesRefRepo } from "../../tests/repos/TestExternalExercisesRefRepo";
import { TestUsersRepo } from "../../tests/repos/TestUsersRepo";
import { TestWorkoutsTemplatesRepo } from "../../tests/repos/TestWorkoutsTemplatesRepo";
import { mockExercisesForExerciseFinder } from "./exercises";
import { createAndPersistTestUser } from "./user";

const setsForExercises = [3, 4, 5];

export const createAndPersistTestWorkoutTemplates = async () => {
  const mockUser = await createAndPersistTestUser();

  const firstExercise = mockExercisesForExerciseFinder[0];

  let mockTemplate = await AppCreateWorkoutTemplateUsecase.execute({
    actorUserId: mockUser.id,
    targetUserId: mockUser.id,
    name: "Upper Body A",
    templateLines: [
      {
        externalExerciseId: firstExercise.externalRef.externalId,
        source: firstExercise.externalRef.source,
        name: firstExercise.exercise.name,
        sets: setsForExercises[0],
      },
    ],
  });

  const exercisesForTemplates = mockExercisesForExerciseFinder.map(
    ({ exercise, externalRef }, i) => ({
      name: exercise.name,
      externalId: externalRef.externalId,
      source: externalRef.source,
      sets: setsForExercises[i],
    }),
  );

  for (const exercise of exercisesForTemplates.slice(1)) {
    mockTemplate = await AppAddExerciseToWorkoutTemplateUsecase.execute({
      userId: mockUser.id,
      workoutTemplateId: mockTemplate.id,
      externalExerciseId: exercise.externalId,
      source: exercise.source,
      name: exercise.name,
      sets: exercise.sets,
    });
  }

  afterAll(() => {
    TestExercisesRepo.clearForTesting();
    TestWorkoutsTemplatesRepo.clearForTesting();
    TestExternalExercisesRefRepo.clearForTesting();
    TestUsersRepo.clearForTesting();
  });

  return { mockTemplate, mockUser, exercisesForTemplates };
};
