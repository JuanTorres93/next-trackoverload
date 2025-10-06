import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import { v4 as uuidv4 } from 'uuid';
import { validateNonEmptyString } from '@/domain/common/validation';

export type DuplicateWorkoutTemplateUsecaseRequest = {
  originalTemplateId: string;
  newTemplateName?: string;
};

export class DuplicateWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: DuplicateWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplate> {
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
      await this.workoutTemplatesRepo.getWorkoutTemplateById(
        request.originalTemplateId
      );

    if (!originalTemplate) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    const newTemplateName =
      request.newTemplateName ?? `${originalTemplate.name} (Copy)`;

    const duplicatedTemplate = WorkoutTemplate.create({
      id: uuidv4(),
      name: newTemplateName,
      exercises: [...originalTemplate.exercises],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(duplicatedTemplate);

    return duplicatedTemplate;
  }
}
