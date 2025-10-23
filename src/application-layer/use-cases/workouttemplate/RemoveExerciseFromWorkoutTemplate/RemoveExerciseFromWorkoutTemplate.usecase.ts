import {
  WorkoutTemplateDTO,
  toWorkoutTemplateDTO,
} from '@/application-layer/dtos/WorkoutTemplateDTO';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type RemoveExerciseFromWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  exerciseId: string;
};

export class RemoveExerciseFromWorkoutTemplateUsecase {
  constructor(private workoutTemplatesRepo: WorkoutTemplatesRepo) {}

  async execute(
    request: RemoveExerciseFromWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplateDTO> {
    validateNonEmptyString(
      request.userId,
      'RemoveExerciseFromWorkoutTemplate userId'
    );
    validateNonEmptyString(
      request.workoutTemplateId,
      'RemoveExerciseFromWorkoutTemplate workoutTemplateId'
    );
    validateNonEmptyString(
      request.exerciseId,
      'RemoveExerciseFromWorkoutTemplate exerciseId'
    );

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError('WorkoutTemplate not found');
    }

    workoutTemplate.removeExercise(request.exerciseId);

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return toWorkoutTemplateDTO(workoutTemplate);
  }
}
