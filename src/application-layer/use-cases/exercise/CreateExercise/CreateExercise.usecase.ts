import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { Exercise } from '@/domain/entities/exercise/Exercise';
import {
  ExerciseDTO,
  toExerciseDTO,
} from '@/application-layer/dtos/ExerciseDTO';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type CreateExerciseUsecaseRequest = {
  name: string;
};

export class CreateExerciseUsecase {
  constructor(
    private exercisesRepo: ExercisesRepo,
    private idGenerator: IdGenerator
  ) {}

  async execute(request: CreateExerciseUsecaseRequest): Promise<ExerciseDTO> {
    const newExercise = Exercise.create({
      id: this.idGenerator.generateId(),
      name: request.name,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.exercisesRepo.saveExercise(newExercise);

    return toExerciseDTO(newExercise);
  }
}
