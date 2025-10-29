import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { DeleteRecipeUsecase } from '@/application-layer/use-cases/recipe/DeleteRecipe/DeleteRecipe.usecase';

export const AppDeleteRecipeUsecase = new DeleteRecipeUsecase(AppRecipesRepo);
