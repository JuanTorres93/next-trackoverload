import { ExercisesRepo } from "../../../../domain/repos/ExercisesRepo.port";
import { ExerciseDTO, toExerciseDTO } from "../../../dtos/ExerciseDTO";

export type GetExerciseByIdUsecaseRequest = {
  id: string;
};

export class GetExerciseByIdUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(
    request: GetExerciseByIdUsecaseRequest,
  ): Promise<ExerciseDTO | null> {
    const exercise = await this.exercisesRepo.getExerciseById(request.id);

    return exercise ? toExerciseDTO(exercise) : null;
  }
}
