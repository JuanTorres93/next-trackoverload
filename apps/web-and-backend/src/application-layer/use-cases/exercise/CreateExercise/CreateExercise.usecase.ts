import { ExerciseDTO } from "shared";

import { Exercise } from "../../../../domain/entities/exercise/Exercise";
import { ExercisesRepo } from "../../../../domain/repos/ExercisesRepo.port";
import { IdGenerator } from "../../../../domain/services/IdGenerator.port";
import { toExerciseDTO } from "../../../dtos/ExerciseDTO";

export type CreateExerciseUsecaseRequest = {
  name: string;
};

export class CreateExerciseUsecase {
  constructor(
    private exercisesRepo: ExercisesRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(request: CreateExerciseUsecaseRequest): Promise<ExerciseDTO> {
    const newExercise = Exercise.create({
      id: this.idGenerator.generateId(),
      name: request.name,
    });

    await this.exercisesRepo.saveExercise(newExercise);

    return toExerciseDTO(newExercise);
  }
}
