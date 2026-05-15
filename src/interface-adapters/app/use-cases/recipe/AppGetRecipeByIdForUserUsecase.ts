import { GetRecipeByIdForUserUsecase } from "@/application-layer/use-cases/recipe/GetRecipeByIdForUser/GetRecipeByIdForUser.usecase";
import { AppRecipesRepo } from "@/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

export const AppGetRecipeByIdForUserUsecase = new GetRecipeByIdForUserUsecase(
  AppRecipesRepo,
  AppUsersRepo,
);
