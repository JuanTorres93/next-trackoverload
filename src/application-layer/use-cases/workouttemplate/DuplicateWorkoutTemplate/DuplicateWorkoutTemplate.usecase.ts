import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';
import { validateNonEmptyString } from '@/domain/common/validation';

export type DuplicateWorkoutTemplateUsecaseRequest = {
  userId: string;
  originalTemplateId: string;
  newTemplateName?: string;
};

export class DuplicateWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: DuplicateWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplateDTO> {
    validateNonEmptyString(request.userId, 'DuplicateWorkoutTemplate userId');
    validateNonEmptyString(
      request.originalTemplateId,
      'DuplicateWorkoutTemplate originalTemplateId'
    );

    if (request.newTemplateName !== undefined)
      validateNonEmptyString(
        request.newTemplateName,
        'DuplicateWorkoutTemplate newTemplateName'
      );

    const originalTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.originalTemplateId,
        request.userId
      );

    const isDeleted = originalTemplate?.isDeleted ?? false;

    if (!originalTemplate || isDeleted) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    const newTemplateName =
      request.newTemplateName ?? `${originalTemplate.name} (Copy)`;

    const duplicatedTemplate = WorkoutTemplate.create({
      id: uuidv4(),
      userId: request.userId,
      name: newTemplateName,
      exercises: [...originalTemplate.exercises],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(duplicatedTemplate);

    return toWorkoutTemplateDTO(duplicatedTemplate);
  }
}
