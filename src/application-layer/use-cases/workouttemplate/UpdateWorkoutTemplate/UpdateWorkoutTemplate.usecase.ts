import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type UpdateWorkoutTemplateUsecaseRequest = {
  id: string;
  userId: string;
  name: string;
};

export class UpdateWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: UpdateWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplateDTO> {
    validateNonEmptyString(request.id, 'UpdateWorkoutTemplateUsecase id');

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.id,
        request.userId
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    // Create updated template with new name
    // NOTE: userId and name validation are done in the entity
    const updatedTemplate = WorkoutTemplate.create({
      id: workoutTemplate.id,
      userId: workoutTemplate.userId,
      name: request.name,
      exercises: workoutTemplate.exercises,
      createdAt: workoutTemplate.createdAt,
      updatedAt: new Date(),
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(updatedTemplate);

    return toWorkoutTemplateDTO(updatedTemplate);
  }
}
