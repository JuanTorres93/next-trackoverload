import { GetAllRecipesForUserUsecase } from "../../../../application-layer/use-cases/recipe/GetAllRecipesForUser/GetAllRecipesForUser.usecase";
import { AppRecipesRepo } from "../../repos/AppRecipesRepo";
import { AppUsersRepo } from "../../repos/AppUsersRepo";

export const AppGetAllRecipesForUserUsecase = new GetAllRecipesForUserUsecase(
  AppRecipesRepo,
  AppUsersRepo,
);
