import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';
import { ExercisesRepo } from '@/domain/repos/ExercisesRepo.port';
import { WorkoutTemplate } from '@/domain/entities/workouttemplate/WorkoutTemplate';
import { NotFoundError } from '@/domain/common/errors';
import {
  validateGreaterThanZero,
  validateInteger,
  validateNonEmptyString,
} from '@/domain/common/validation';

export type AddExerciseToWorkoutTemplateUsecaseRequest = {
  userId: string;
  workoutTemplateId: string;
  exerciseId: string;
  sets: number;
};

export class AddExerciseToWorkoutTemplateUsecase {
  constructor(
    private workoutTemplatesRepo: WorkoutTemplatesRepo,
    private exercisesRepo: ExercisesRepo
  ) {}

  async execute(
    request: AddExerciseToWorkoutTemplateUsecaseRequest
  ): Promise<WorkoutTemplate> {
    validateNonEmptyString(
      request.userId,
      'AddExerciseToWorkoutTemplate userId'
    );
    validateNonEmptyString(
      request.workoutTemplateId,
      'AddExerciseToWorkoutTemplate workoutTemplateId'
    );
    validateNonEmptyString(
      request.exerciseId,
      'AddExerciseToWorkoutTemplate exerciseId'
    );
    // Validate sets
    validateGreaterThanZero(request.sets, 'AddExerciseToWorkoutTemplate sets');
    validateInteger(request.sets, 'AddExerciseToWorkoutTemplate sets');

    const workoutTemplate =
      await this.workoutTemplatesRepo.getWorkoutTemplateByIdAndUserId(
        request.workoutTemplateId,
        request.userId
      );

    const isDeleted = workoutTemplate?.isDeleted ?? false;

    if (!workoutTemplate || isDeleted) {
      throw new NotFoundError(
        'AddExerciseToWorkoutTemplateUsecase: WorkoutTemplate not found'
      );
    }

    const exercise = await this.exercisesRepo.getExerciseById(
      request.exerciseId
    );
    if (!exercise) {
      throw new NotFoundError(
        'AddExerciseToWorkoutTemplateUsecase: Exercise not found'
      );
    }

    // NOTE: duplicate exercise handled in entity
    workoutTemplate.addExercise({
      exerciseId: request.exerciseId,
      sets: request.sets,
    });

    await this.workoutTemplatesRepo.saveWorkoutTemplate(workoutTemplate);

    return workoutTemplate;
  }
}
