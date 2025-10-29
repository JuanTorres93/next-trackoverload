import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { UpdateRecipeUsecase } from '@/application-layer/use-cases/recipe/UpdateRecipe/UpdateRecipe.usecase';

export const AppUpdateRecipeUsecase = new UpdateRecipeUsecase(AppRecipesRepo);
