import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';

export type UpdateWorkoutUsecaseRequest = {
  id: string;
  name?: string;
};

export class UpdateWorkoutUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(request: UpdateWorkoutUsecaseRequest): Promise<Workout> {
    validateNonEmptyString(request.id, 'UpdateWorkoutUsecase');
    if (request.name !== undefined)
      validateNonEmptyString(request.name, 'UpdateWorkoutUsecase');

    const existingWorkout = await this.workoutsRepo.getWorkoutById(request.id);

    if (!existingWorkout) {
      throw new NotFoundError('UpdateWorkoutUsecase: Workout not found');
    }

    const updatedWorkout = Workout.create({
      id: existingWorkout.id,
      name: request.name ?? existingWorkout.name,
      workoutTemplateId: existingWorkout.workoutTemplateId,
      exercises: existingWorkout.exercises,
      createdAt: existingWorkout.createdAt,
      updatedAt: new Date(),
    });

    await this.workoutsRepo.saveWorkout(updatedWorkout);

    return updatedWorkout;
  }
}
