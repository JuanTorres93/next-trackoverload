import { ExerciseDTO } from "shared";

import { logNoTest } from "@/utils/logNoTest";

import { NotFoundError } from "../../../../domain/common/errors";
import { Exercise } from "../../../../domain/entities/exercise/Exercise";
import { ExercisesRepo } from "../../../../domain/repos/ExercisesRepo.port";
import { toExerciseDTO } from "../../../dtos/ExerciseDTO";

export type UpdateExerciseUsecaseRequest = {
  id: string;
  name?: string;
};

export class UpdateExerciseUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(request: UpdateExerciseUsecaseRequest): Promise<ExerciseDTO> {
    const existingExercise = await this.exercisesRepo.getExerciseById(
      request.id,
    );

    if (!existingExercise) {
      logNoTest(
        `UpdateExerciseUsecase: Exercise with id ${request.id} not found`,
      );

      throw new NotFoundError("El ejercicio no existe.");
    }

    const updatedExercise = Exercise.create({
      id: existingExercise.id,
      name: request.name ?? existingExercise.name,
      createdAt: existingExercise.createdAt,
    });

    await this.exercisesRepo.saveExercise(updatedExercise);

    return toExerciseDTO(updatedExercise);
  }
}
