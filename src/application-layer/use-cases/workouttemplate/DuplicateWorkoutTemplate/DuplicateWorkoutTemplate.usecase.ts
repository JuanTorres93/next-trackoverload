import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplateLine } from '@/domain/entities/workouttemplateline/WorkoutTemplateLine';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { IdGenerator } from '@/domain/services/IdGenerator.port';

export type DuplicateWorkoutTemplateUsecaseRequest = {
  userId: string;
  originalTemplateId: string;
  newTemplateName?: string;
};

export class DuplicateWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private usersRepo: UsersRepo,
    private idGenerator: IdGenerator,
  ) {}

  async execute(
    request: DuplicateWorkoutTemplateUsecaseRequest,
  ): Promise<WorkoutTemplateDTO> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `DuplicateWorkoutTemplateUsecase: User with id ${request.userId} not found`,
      );
    }

    const originalTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.originalTemplateId,
        request.userId,
      );

    const isDeleted = originalTemplate?.isDeleted ?? false;

    if (!originalTemplate || isDeleted) {
      throw new NotFoundError(
        'DuplicateWorkoutTemplateUsecase: WorkoutTemplate not found',
      );
    }

    const newTemplateName =
      request.newTemplateName ?? `${originalTemplate.name} (Copy)`;

    const newTemplateId = this.idGenerator.generateId();

    // Duplicate exercises
    const duplicatedExercises: WorkoutTemplateLine[] =
      originalTemplate.exercises.map((exercise) =>
        WorkoutTemplateLine.create({
          id: this.idGenerator.generateId(),
          templateId: newTemplateId,
          exerciseId: exercise.exerciseId,
          sets: exercise.sets,
        }),
      );

    const duplicatedTemplate = WorkoutTemplate.create({
      id: newTemplateId,
      userId: request.userId,
      name: newTemplateName,
      exercises: duplicatedExercises,
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(duplicatedTemplate);

    return toWorkoutTemplateDTO(duplicatedTemplate);
  }
}
