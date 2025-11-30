import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppCreateRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { createMockUser } from './user';
import { createMockIngredients } from './ingredients';

export const createMockRecipes = async () => {
  const mockIngredients = await createMockIngredients();
  const mockUser = await createMockUser();

  const recipesPropsForUseCase = [
    {
      userId: mockUser.id,
      name: 'Carrot Soup',
      ingredientLinesInfo: [
        { ingredientId: mockIngredients[0].id, quantityInGrams: 200 },
        { ingredientId: mockIngredients[1].id, quantityInGrams: 100 },
      ],
    },
    {
      userId: mockUser.id,
      name: 'Cabbage Salad',
      ingredientLinesInfo: [
        { ingredientId: mockIngredients[1].id, quantityInGrams: 150 },
        { ingredientId: mockIngredients[2].id, quantityInGrams: 50 },
      ],
    },
    {
      userId: mockUser.id,
      name: 'Celery Stir-fry',
      ingredientLinesInfo: [
        { ingredientId: mockIngredients[2].id, quantityInGrams: 250 },
        { ingredientId: mockIngredients[0].id, quantityInGrams: 300 },
      ],
    },
  ];

  const mockRecipes = [];

  for (const props of recipesPropsForUseCase) {
    const recipeDTO = await AppCreateRecipeUsecase.execute(props);
    mockRecipes.push(recipeDTO);
  }

  afterAll(() => {
    // Clean up after tests
    // @ts-expect-error AppIngredientsRepo will always be MemoryIngredientsRepo
    AppIngredientsRepo.clearForTesting();
    // @ts-expect-error AppRecipesRepo will always be MemoryRecipesRepo
    AppRecipesRepo.clearForTesting();
    // @ts-expect-error AppUsersRepo will always be MemoryUsersRepo
    AppUsersRepo.clearForTesting();
  });

  return { mockRecipes, mockIngredients, mockUser };
};
