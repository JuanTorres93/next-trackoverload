import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';

export type RemoveExerciseFromWorkoutTemplateUsecaseRequest = {
  workoutTemplateId: string;
  exerciseId: string;
};

export class RemoveExerciseFromWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: RemoveExerciseFromWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplate> {
    validateNonEmptyString(
      request.workoutTemplateId,
      'RemoveExerciseFromWorkoutTemplate workoutTemplateId'
    );
    validateNonEmptyString(
      request.exerciseId,
      'RemoveExerciseFromWorkoutTemplate exerciseId'
    );

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateById(
        request.workoutTemplateId
      );

    if (!workoutTemplate) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    workoutTemplate.removeExercise(request.exerciseId);

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return workoutTemplate;
  }
}
