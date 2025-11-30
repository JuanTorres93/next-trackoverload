import { MealDTO, toMealDTO } from '@/application-layer/dtos/MealDTO';
import { NotFoundError } from '@/domain/common/errors';
import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { UsersRepo } from '@/domain/repos/UsersRepo.port';

export type GetAllMealsForUserUsecaseRequest = {
  userId: string;
};

export class GetAllMealsForUserUsecase {
  constructor(private mealsRepo: MealsRepo, private usersRepo: UsersRepo) {}

  async execute(request: GetAllMealsForUserUsecaseRequest): Promise<MealDTO[]> {
    const user = await this.usersRepo.getUserById(request.userId);
    if (!user) {
      throw new NotFoundError(
        `GetAllMealsForUserUsecase: user with id ${request.userId} not found`
      );
    }

    const meals = await this.mealsRepo.getAllMealsForUser(request.userId);

    return meals.map(toMealDTO) || [];
  }
}
