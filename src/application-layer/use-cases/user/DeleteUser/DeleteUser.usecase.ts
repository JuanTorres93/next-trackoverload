import { NotFoundError } from '@/domain/common/errors';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';
import { DaysRepo } from '@/domain/repos/DaysRepo.port';
import { FakeMealsRepo } from '@/domain/repos/FakeMealsRepo.port';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { WorkoutTemplatesRepo } from '@/domain/repos/WorkoutTemplatesRepo.port';

export type DeleteUserUsecaseRequest = {
  id: string;
};

export class DeleteUserUsecase {
  constructor(
    private usersRepo: UsersRepo,
    private daysRepo: DaysRepo,
    private fakeMealsRepo: FakeMealsRepo,
    private mealsRepo: MealsRepo,
    private recipesRepo: RecipesRepo,
    private workoutsRepo: WorkoutsRepo,
    private workoutTemplatesRepo: WorkoutTemplatesRepo
  ) {}

  async execute(request: DeleteUserUsecaseRequest): Promise<void> {
    const user = await this.usersRepo.getUserById(request.id);

    if (!user) {
      throw new NotFoundError('DeleteUserUsecase: User not found');
    }

    await this.fakeMealsRepo.deleteAllFakeMealsForUser(request.id);
    await this.mealsRepo.deleteAllMealsForUser(request.id);
    await this.recipesRepo.deleteAllRecipesForUser(request.id);
    await this.workoutsRepo.deleteAllWorkoutsForUser(request.id);
    await this.workoutTemplatesRepo.deleteAllWorkoutTemplatesForUser(
      request.id
    );
    await this.daysRepo.deleteAllDaysForUser(request.id);

    await this.usersRepo.deleteUser(request.id);
  }
}
