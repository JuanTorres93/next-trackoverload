import { GetAllRecipesForUserUsecase } from "@/application-layer/use-cases/recipe/GetAllRecipesForUser/GetAllRecipesForUser.usecase";
import { AppRecipesRepo } from "@/interface-adapters/app/repos/AppRecipesRepo";
import { AppUsersRepo } from "@/interface-adapters/app/repos/AppUsersRepo";

export const AppGetAllRecipesForUserUsecase = new GetAllRecipesForUserUsecase(
  AppRecipesRepo,
  AppUsersRepo,
);
