import { GetRecipeByIdForUserUsecase } from "../../../../application-layer/use-cases/recipe/GetRecipeByIdForUser/GetRecipeByIdForUser.usecase";
import { AppRecipesRepo } from "../../repos/AppRecipesRepo";
import { AppUsersRepo } from "../../repos/AppUsersRepo";

export const AppGetRecipeByIdForUserUsecase = new GetRecipeByIdForUserUsecase(
  AppRecipesRepo,
  AppUsersRepo,
);
