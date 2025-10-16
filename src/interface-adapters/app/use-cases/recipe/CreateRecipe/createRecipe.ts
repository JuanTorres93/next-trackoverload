import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { CreateRecipeUsecase } from '@/use-cases/recipe/CreateRecipe/CreateRecipe.usecase';

export const AppCreateRecipeUsecase = new CreateRecipeUsecase(AppRecipesRepo);
