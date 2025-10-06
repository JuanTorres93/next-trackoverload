import { NotFoundError } from '@/domain/common/errors';
import {
  validateInteger,
  validateNonEmptyString,
  validatePositiveNumber,
} from '@/domain/common/validation';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type ReorderExerciseInWorkoutTemplateUsecaseRequest = {
  workoutTemplateId: string;
  exerciseId: string;
  newIndex: number;
};

export class ReorderExerciseInWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: ReorderExerciseInWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplate> {
    validateNonEmptyString(
      request.workoutTemplateId,
      'ReorderExerciseInWorkoutTemplate workoutTemplateId'
    );
    validateNonEmptyString(
      request.exerciseId,
      'ReorderExerciseInWorkoutTemplate exerciseId'
    );

    // Validate newIndex
    validatePositiveNumber(
      request.newIndex,
      'ReorderExerciseInWorkoutTemplate newIndex'
    );
    validateInteger(
      request.newIndex,
      'ReorderExerciseInWorkoutTemplate newIndex'
    );

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateById(
        request.workoutTemplateId
      );

    if (!workoutTemplate) {
      throw new NotFoundError(
        'ReorderExerciseInWorkoutTemplate WorkoutTemplate not found'
      );
    }

    workoutTemplate.reorderExercise(request.exerciseId, request.newIndex);

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return workoutTemplate;
  }
}
