import {
  ExerciseDTO,
  toExerciseDTO,
} from '@/application-layer/dtos/ExerciseDTO';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';

export type GetExercisesByIdsUsecaseRequest = {
  ids: string[];
};

export class GetExercisesByIdsUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(
    request: GetExercisesByIdsUsecaseRequest
  ): Promise<ExerciseDTO[]> {
    const exercises: Exercise[] = [];

    for (const id of request.ids) {
      const exercise = await this.exercisesRepo.getExerciseById(id);
      if (exercise) {
        exercises.push(exercise);
      }
    }

    return exercises.map(toExerciseDTO);
  }
}
