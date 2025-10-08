import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';

export type UpdateExerciseInWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  exerciseId: string;
  sets: number;
};

export class UpdateExerciseInWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: UpdateExerciseInWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplate> {
    validateNonEmptyString(
      request.userId,
      'UpdateExerciseInWorkoutTemplate userId'
    );
    validateNonEmptyString(
      request.workoutTemplateId,
      'UpdateExerciseInWorkoutTemplate workoutTemplateId'
    );
    validateNonEmptyString(
      request.exerciseId,
      'UpdateExerciseInWorkoutTemplate exerciseId'
    );

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError(
        'UpdateExerciseInWorkoutTemplate WorkoutTemplate not found'
      );
    }

    // NOTE: sets is validated in the entity
    workoutTemplate.updateExercise(request.exerciseId, {
      sets: request.sets,
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return workoutTemplate;
  }
}
