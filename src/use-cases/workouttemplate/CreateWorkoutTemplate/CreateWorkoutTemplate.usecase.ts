import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { v4 as uuidv4 } from 'uuid';

export type CreateWorkoutTemplateUsecaseRequest = {
  userId: string;
  name: string;
};

export class CreateWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: CreateWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplate> {
    // NOTE: validation is done at the entity level
    const newWorkoutTemplate = WorkoutTemplate.create({
      id: uuidv4(),
      userId: request.userId,
      name: request.name,
      exercises: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(newWorkoutTemplate);

    return newWorkoutTemplate;
  }
}
