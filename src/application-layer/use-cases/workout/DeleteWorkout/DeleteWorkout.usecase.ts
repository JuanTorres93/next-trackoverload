import { NotFoundError } from '@/domain/common/errors';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type DeleteWorkoutUsecaseRequest = {
  id: string;
  userId: string;
};

export class DeleteWorkoutUsecase {
  constructor(
    private workoutsRepo: WorkoutsRepo,
    private usersRepo: UsersRepo,
  ) {}

  async execute(request: DeleteWorkoutUsecaseRequest): Promise<void> {
    const [user, workout] = await Promise.all([
      this.usersRepo.getUserById(request.userId),

      this.workoutsRepo.getWorkoutByIdAndUserId(request.id, request.userId),
    ]);

    if (!user) {
      throw new NotFoundError(
        `DeleteWorkoutUsecase: user with id ${request.userId} not found`,
      );
    }

    if (!workout) {
      throw new NotFoundError('DeleteWorkoutUsecase: Workout not found');
    }

    await this.workoutsRepo.deleteWorkout(request.id);
  }
}
