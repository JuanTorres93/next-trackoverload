import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import {
  ExerciseDTO,
  toExerciseDTO,
} from '@/application-layer/dtos/ExerciseDTO';
import { v4 as uuidv4 } from 'uuid';

export type CreateExerciseUsecaseRequest = {
  name: string;
};

export class CreateExerciseUsecase {
  constructor(private exercisesRepo: ExercisesRepo) {}

  async execute(request: CreateExerciseUsecaseRequest): Promise<ExerciseDTO> {
    const newExercise = Exercise.create({
      id: uuidv4(),
      name: request.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.exercisesRepo.saveExercise(newExercise);

    return toExerciseDTO(newExercise);
  }
}
