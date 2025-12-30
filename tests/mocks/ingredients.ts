import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { AppIngredientsRepo } from '@/interface-adapters/app/repos/AppIngredientsRepo';
import { AppCreateIngredientUsecase } from '@/interface-adapters/app/use-cases/ingredient';

const ingredientPropsForUseCase = [
  {
    name: 'Carrot',
    calories: 41,
    protein: 0.9,
  },
  {
    name: 'Cabbage',
    calories: 25,
    protein: 1.3,
  },
  {
    name: 'Celery',
    calories: 16,
    protein: 0.7,
  },
];

export const mockIngredientsForIngredientFinder = ingredientPropsForUseCase.map(
  (props, index) => ({
    id: `ingredient-${index + 1}`,
    name: props.name,
    nutritionalInfoPer100g: {
      calories: props.calories,
      protein: props.protein,
    },
    imageUrl: undefined,
  })
);

export const createMockIngredients = async () => {
  const createdIngredients = [];

  for (const props of ingredientPropsForUseCase) {
    const ingredientDTO = await AppCreateIngredientUsecase.execute(props);
    createdIngredients.push(ingredientDTO);
  }

  afterAll(() => {
    // Clean up after tests
    if (AppIngredientsRepo instanceof MemoryIngredientsRepo) {
      AppIngredientsRepo.clearForTesting();
    }
  });

  return createdIngredients;
};
