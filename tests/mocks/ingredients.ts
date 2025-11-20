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

export const createMockIngredients = async () => {
  const createdIngredients = [];

  for (const props of ingredientPropsForUseCase) {
    const ingredientDTO = await AppCreateIngredientUsecase.execute(props);
    createdIngredients.push(ingredientDTO);
  }

  return createdIngredients;
};
