import { AppCreateRecipeUsecase } from "../../src/interface-adapters/app/use-cases/recipe";
import { TestIngredientsRepo } from "../repos/TestIngredientsRepo";
import { TestRecipesRepo } from "../repos/TestRecipesRepo";
import { TestUsersRepo } from "../repos/TestUsersRepo";
import { createAndPersistTestIngredients } from "./ingredients";
import { createAndPersistTestUser } from "./user";

export const createAndPersistTestRecipes = async () => {
  const mockIngredients = await createAndPersistTestIngredients();
  const mockUser = await createAndPersistTestUser();

  const recipesPropsForUseCase = [
    {
      actorUserId: mockUser.id,
      targetUserId: mockUser.id,
      name: "Carrot Soup",
      ingredientLinesInfo: [
        {
          externalIngredientId: mockIngredients[0].id,
          source: "openfoodfacts",
          name: mockIngredients[0].name,
          caloriesPer100g: mockIngredients[0].nutritionalInfoPer100g.calories,
          proteinPer100g: mockIngredients[0].nutritionalInfoPer100g.protein,
          imageUrl: mockIngredients[0].imageUrl,
          quantityInGrams: 200,
        },
        {
          externalIngredientId: mockIngredients[1].id,
          name: mockIngredients[1].name,
          source: "openfoodfacts",
          caloriesPer100g: mockIngredients[1].nutritionalInfoPer100g.calories,
          proteinPer100g: mockIngredients[1].nutritionalInfoPer100g.protein,
          imageUrl: mockIngredients[1].imageUrl,
          quantityInGrams: 100,
        },
      ],
    },
    {
      actorUserId: mockUser.id,
      targetUserId: mockUser.id,
      name: "Cabbage Salad",
      ingredientLinesInfo: [
        {
          externalIngredientId: mockIngredients[1].id,
          name: mockIngredients[1].name,
          source: "openfoodfacts",
          caloriesPer100g: mockIngredients[1].nutritionalInfoPer100g.calories,
          proteinPer100g: mockIngredients[1].nutritionalInfoPer100g.protein,
          imageUrl: mockIngredients[1].imageUrl,
          quantityInGrams: 150,
        },
        {
          externalIngredientId: mockIngredients[2].id,
          name: mockIngredients[2].name,
          source: "openfoodfacts",
          caloriesPer100g: mockIngredients[2].nutritionalInfoPer100g.calories,
          proteinPer100g: mockIngredients[2].nutritionalInfoPer100g.protein,
          imageUrl: mockIngredients[2].imageUrl,
          quantityInGrams: 50,
        },
      ],
    },
    {
      actorUserId: mockUser.id,
      targetUserId: mockUser.id,
      name: "Celery Stir-fry",
      ingredientLinesInfo: [
        {
          externalIngredientId: mockIngredients[2].id,
          name: mockIngredients[2].name,
          source: "openfoodfacts",
          caloriesPer100g: mockIngredients[2].nutritionalInfoPer100g.calories,
          proteinPer100g: mockIngredients[2].nutritionalInfoPer100g.protein,
          imageUrl: mockIngredients[2].imageUrl,
          quantityInGrams: 250,
        },
        {
          externalIngredientId: mockIngredients[0].id,
          source: "openfoodfacts",
          caloriesPer100g: mockIngredients[0].nutritionalInfoPer100g.calories,
          proteinPer100g: mockIngredients[0].nutritionalInfoPer100g.protein,
          imageUrl: mockIngredients[0].imageUrl,
          name: mockIngredients[0].name,
          quantityInGrams: 300,
        },
      ],
    },
  ];

  const mockRecipes = [];

  for (const props of recipesPropsForUseCase) {
    const recipeDTO = await AppCreateRecipeUsecase.execute(props);
    mockRecipes.push(recipeDTO);
  }

  afterAll(() => {
    TestIngredientsRepo.clearForTesting();
    TestRecipesRepo.clearForTesting();
    TestUsersRepo.clearForTesting();
  });

  return { mockRecipes, mockIngredients, mockUser };
};
