import { logNoTest } from "@/domain/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { ExercisesRepo } from "../../../../domain/repos/ExercisesRepo.port";

export type DeleteExerciseUsecaseRequest = {
  id: string;
};

export class DeleteExerciseUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(request: DeleteExerciseUsecaseRequest): Promise<void> {
    // Search exercise
    const exercise = await this.exercisesRepo.getExerciseById(request.id);

    if (!exercise) {
      logNoTest(
        `DeleteExerciseUsecase: Exercise with id ${request.id} not found`,
      );

      throw new NotFoundError("El ejercicio no existe.");
    }

    await this.exercisesRepo.deleteExercise(request.id);
  }
}
