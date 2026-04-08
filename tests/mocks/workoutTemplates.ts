import { AppExternalExercisesRefRepo } from "@/interface-adapters/app/repos/AppExternalExercisesRefRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";
import { AppWorkoutsTemplatesRepo } from "@/interface-adapters/app/repos/AppWorkoutsTemplatesRepo";
import {
  AppAddExerciseToWorkoutTemplateUsecase,
  AppCreateWorkoutTemplateUsecase,
} from "@/interface-adapters/app/use-cases/workouttemplate";

import {
  createMockExercises,
  mockExercisesForExerciseFinder,
} from "./exercises";
import { createMockUser } from "./user";

const setsForExercises = [3, 4, 5];

export const createMockWorkoutTemplates = async () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("createMockWorkoutTemplates should only be used in tests");
  }

  await createMockExercises();
  const mockUser = await createMockUser();

  let mockTemplate = await AppCreateWorkoutTemplateUsecase.execute({
    actorUserId: mockUser.id,
    targetUserId: mockUser.id,
    name: "Upper Body A",
  });

  const exercisesForTemplates = mockExercisesForExerciseFinder.map(
    ({ exercise, externalRef }, i) => ({
      name: exercise.name,
      externalId: externalRef.externalId,
      source: externalRef.source,
      sets: setsForExercises[i],
    }),
  );

  for (const exercise of exercisesForTemplates) {
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
    // AppExercisesRepo cleanup is handled by createMockExercises
    // @ts-expect-error AppWorkoutsTemplatesRepo will always be MemoryWorkoutTemplatesRepo
    AppWorkoutsTemplatesRepo.clearForTesting();
    // @ts-expect-error AppExternalExercisesRefRepo will always be MemoryExternalExercisesRefRepo
    AppExternalExercisesRefRepo.clearForTesting();
    // @ts-expect-error AppUsersRepo will always be MemoryUsersRepo
    AppUsersRepo.clearForTesting();
  });

  return { mockTemplate, mockUser, exercisesForTemplates };
};
