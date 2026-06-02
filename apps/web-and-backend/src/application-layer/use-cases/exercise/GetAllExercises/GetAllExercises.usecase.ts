import { ExerciseDTO } from "shared";

import { ExercisesRepo } from "../../../../domain/repos/ExercisesRepo.port";
import { toExerciseDTO } from "../../../dtos/ExerciseDTO";

export class GetAllExercisesUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(): Promise<ExerciseDTO[]> {
    const exercises = await this.exercisesRepo.getAllExercises();

    return exercises.map(toExerciseDTO);
  }
}
