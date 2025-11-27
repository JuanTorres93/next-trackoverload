import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { Id } from '@/domain/types/Id/Id';
import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { v4 as uuidv4 } from 'uuid';

export type CreateWorkoutTemplateUsecaseRequest = {
  userId: string;
  name: string;
};

export class CreateWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: CreateWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplateDTO> {
    // NOTE: validation is done at the entity level
    const newWorkoutTemplate = WorkoutTemplate.create({
      id: Id.create(uuidv4()),
      userId: request.userId,
      name: request.name,
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(newWorkoutTemplate);

    return toWorkoutTemplateDTO(newWorkoutTemplate);
  }
}
