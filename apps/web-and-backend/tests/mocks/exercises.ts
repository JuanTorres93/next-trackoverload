import { ExerciseFinderResult } from "../../src/domain/services/ExerciseFinder.port";
import { AppCreateExerciseUsecase } from "../../src/interface-adapters/app/use-cases/exercise";
import { TestExercisesRepo } from "../../tests/repos/TestExercisesRepo";

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

export const createAndPersistTestExercises = async () => {
  const createdExercises = [];

  for (const props of exercisePropsForUseCase) {
    const exerciseDTO = await AppCreateExerciseUsecase.execute(props);
    createdExercises.push(exerciseDTO);
  }

  afterAll(() => {
    TestExercisesRepo.clearForTesting();
  });

  return createdExercises;
};
