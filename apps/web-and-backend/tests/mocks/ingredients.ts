import { AppCreateIngredientUsecase } from "../../src/interface-adapters/app/use-cases/ingredient";
import { TestIngredientsRepo } from "../../tests/repos/TestIngredientsRepo";

const ingredientPropsForUseCase = [
  {
    name: "Carrot",
    calories: 41,
    protein: 0.9,
    category: "vegetable",
  },
  {
    name: "Cabbage",
    calories: 25,
    protein: 1.3,
    category: "vegetable",
  },
  {
    name: "Celery",
    calories: 16,
    protein: 0.7,
    category: "vegetable",
  },
];

export const mockIngredientsForIngredientFinder = ingredientPropsForUseCase.map(
  (props, index) => {
    return {
      ingredient: {
        name: props.name,
        nutritionalInfoPer100g: {
          calories: props.calories,
          protein: props.protein,
        },
        imageUrl: undefined,
        category: props.category,
      },

      externalRef: {
        externalId: `external-id-${index + 1}`,
        source: "openfoodfacts",
      },
    };
  },
);

export const createMockIngredients = async () => {
  if (process.env.NODE_ENV !== "test") {
    throw new Error("createMockIngredients should only be used in tests");
  }

  const createdIngredients = [];

  for (const props of ingredientPropsForUseCase) {
    const ingredientDTO = await AppCreateIngredientUsecase.execute(props);
    createdIngredients.push(ingredientDTO);
  }

  afterAll(() => {
    TestIngredientsRepo.clearForTesting();
  });

  return createdIngredients;
};
