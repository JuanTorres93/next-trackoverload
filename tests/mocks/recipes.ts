import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppIngredientLinesRepo } from '@/interface-adapters/app/repos/AppIngredientLinesRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppCreateRecipeUsecase } from '@/interface-adapters/app/use-cases/recipe';
import { testUserId } from './user';
import { createMockIngredients } from './ingredients';

export const createMockRecipes = async () => {
  const mockIngredients = await createMockIngredients();

  const recipesPropsForUseCase = [
    {
      userId: testUserId,
      name: 'Carrot Soup',
      ingredientLinesInfo: [
        { ingredientId: mockIngredients[0].id, quantityInGrams: 200 },
        { ingredientId: mockIngredients[1].id, quantityInGrams: 100 },
      ],
    },
    {
      userId: testUserId,
      name: 'Cabbage Salad',
      ingredientLinesInfo: [
        { ingredientId: mockIngredients[1].id, quantityInGrams: 150 },
        { ingredientId: mockIngredients[2].id, quantityInGrams: 50 },
      ],
    },
    {
      userId: testUserId,
      name: 'Celery Stir-fry',
      ingredientLinesInfo: [
        { ingredientId: mockIngredients[2].id, quantityInGrams: 250 },
        { ingredientId: mockIngredients[0].id, quantityInGrams: 100 },
      ],
    },
  ];

  const createdRecipes = [];

  for (const props of recipesPropsForUseCase) {
    const recipeDTO = await AppCreateRecipeUsecase.execute(props);
    createdRecipes.push(recipeDTO);
  }

  afterAll(() => {
    // Clean up after tests
    // @ts-expect-error AppIngredientsRepo will always be MemoryIngredientsRepo
    AppIngredientsRepo.clearForTesting();
    // @ts-expect-error AppIngredientLinesRepo will always be MemoryIngredientLinesRepo
    AppIngredientLinesRepo.clearForTesting();
    // @ts-expect-error AppRecipesRepo will always be MemoryRecipesRepo
    AppRecipesRepo.clearForTesting();
  });

  return createdRecipes;
};
