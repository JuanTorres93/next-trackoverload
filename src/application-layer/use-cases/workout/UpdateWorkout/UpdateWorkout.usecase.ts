import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { NotFoundError } from '@/domain/common/errors';
import { validateNonEmptyString } from '@/domain/common/validation';
import { Id } from '@/domain/types/Id/Id';

export type UpdateWorkoutUsecaseRequest = {
  id: string;
  userId: string;
  name?: string;
};

export class UpdateWorkoutUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(request: UpdateWorkoutUsecaseRequest): Promise<WorkoutDTO> {
    validateNonEmptyString(request.id, 'UpdateWorkoutUsecase id');
    validateNonEmptyString(request.userId, 'UpdateWorkoutUsecase userId');
    if (request.name !== undefined)
      validateNonEmptyString(request.name, 'UpdateWorkoutUsecase name');

    const existingWorkout = await this.workoutsRepo.getWorkoutByIdAndUserId(
      request.id,
      request.userId
    );

    if (!existingWorkout) {
      throw new NotFoundError('UpdateWorkoutUsecase: Workout not found');
    }

    const updatedWorkout = Workout.create({
      id: Id.create(existingWorkout.id),
      userId: Id.create(existingWorkout.userId),
      name: request.name ?? existingWorkout.name,
      workoutTemplateId: Id.create(existingWorkout.workoutTemplateId),
      exercises: existingWorkout.exercises,
      createdAt: existingWorkout.createdAt,
      updatedAt: new Date(),
    });

    await this.workoutsRepo.saveWorkout(updatedWorkout);

    return toWorkoutDTO(updatedWorkout);
  }
}
