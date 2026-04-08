import { ExerciseFinderResult } from "@/domain/services/ExerciseFinder.port";
import { MemoryExercisesRepo } from "@/infra/repos/memory/MemoryExercisesRepo";
import { AppExercisesRepo } from "@/interface-adapters/app/repos/AppExercisesRepo";
import { AppCreateExerciseUsecase } from "@/interface-adapters/app/use-cases/exercise";

const exercisePropsForUseCase = [
  { name: "Bench Press" },
  { name: "Incline Bench Press" },
  { name: "Squat" },
];

export const mockExercisesForExerciseFinder: ExerciseFinderResult[] =
  exercisePropsForUseCase.map((props, index) => {
    return {
      exercise: {
        name: props.name,
      },

      externalRef: {
        externalId: `ext-ex-${index + 1}`,
        source: "wger",
      },
    };
  });

export const createMockExercises = async () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("createMockExercises should only be used in tests");
  }

  const createdExercises = [];

  for (const props of exercisePropsForUseCase) {
    const exerciseDTO = await AppCreateExerciseUsecase.execute(props);
    createdExercises.push(exerciseDTO);
  }

  afterAll(() => {
    if (AppExercisesRepo instanceof MemoryExercisesRepo) {
      AppExercisesRepo.clearForTesting();
    }
  });

  return createdExercises;
};
