import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';

export type UpdateWorkoutTemplateUsecaseRequest = {
  id: string;
  name: string;
};

export class UpdateWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: UpdateWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplate> {
    validateNonEmptyString(request.id, 'UpdateWorkoutTemplateUsecase id');

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateById(request.id);

    if (!workoutTemplate) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    // Create updated template with new name
    // NOTE: name validation is done in the entity
    const updatedTemplate = WorkoutTemplate.create({
      id: workoutTemplate.id,
      name: request.name,
      exercises: workoutTemplate.exercises,
      createdAt: workoutTemplate.createdAt,
      updatedAt: new Date(),
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(updatedTemplate);

    return updatedTemplate;
  }
}
