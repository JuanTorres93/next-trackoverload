import { screen, render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';

import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';

import { createMockRecipes } from '../../../../../tests/mocks/recipes';
import { getValidAssembledDayDTO } from '../../../../../tests/createProps/dayTestProps';

const mealsRepo = AppMealsRepo as MemoryMealsRepo;
const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';

import DaySummary from '../DaySummary';
import { createServer } from '../../../../../tests/mocks/server';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';

const { mockRecipes } = await createMockRecipes();

createServer([
  {
    path: '/api/recipe/getAll',
    method: 'get',
    response: () => {
      const allRecipes: RecipeDTO[] = [...mockRecipes];

      return allRecipes;
    },
  },
  {
    path: '/api/day/addMeal',
    method: 'post',
    response: () => {},
  },
]);

async function setup() {
  const { assembledDayDTO, meal, fakeMeal } = getValidAssembledDayDTO();

  mealsRepo.saveMeal(meal);
  fakeMealsRepo.saveFakeMeal(fakeMeal);

  render(
    <DaySummary dayId={assembledDayDTO.id} assembledDay={assembledDayDTO} />,
  );

  const addFoodButton = screen.getByRole('button', { name: /añadir comida/i });

  return { assembledDayDTO, addFoodButton, meal, fakeMeal };
}

describe('DaySummary', () => {
  it('should show meals info', async () => {
    const { meal } = await setup();

    const mealElement = await screen.findByText(new RegExp(meal.name, 'i'));

    expect(mealElement).toBeInTheDocument();
  });

  // TODO NEXT Test show fake meals

  it('opens recipes selection modal window on button click', async () => {
    const { addFoodButton } = await setup();

    expect(screen.queryByText(/tus recetas/i)).not.toBeInTheDocument();

    await userEvent.click(addFoodButton);

    expect(screen.getByText(/tus recetas/i)).toBeInTheDocument();
  });

  it('shows recipes in modal window', async () => {
    const { addFoodButton } = await setup();

    await userEvent.click(addFoodButton);

    await waitFor(async () => {
      for (const recipe of mockRecipes) {
        const recipeName = recipe.name;

        const recipeHTML = await screen.findByText(new RegExp(recipeName, 'i'));

        expect(recipeHTML).toBeInTheDocument();
      }
    });
  });

  it('add meals modal button should be disabled by default', async () => {
    const { addFoodButton } = await setup();

    await userEvent.click(addFoodButton);

    const addMealsButton = screen.getByRole('button', {
      name: /añadir comidas/i,
    });

    expect(addMealsButton).toBeDisabled();
  });

  it('add meals modal button should be enabled when selecting a meal', async () => {
    const { addFoodButton } = await setup();

    await userEvent.click(addFoodButton);

    const addMealsButton = screen.getByRole('button', {
      name: /añadir comidas/i,
    });

    expect(addMealsButton).toBeDisabled();

    const firstRecipeElement = await screen.findByText(
      new RegExp(mockRecipes[0].name, 'i'),
    );

    await userEvent.click(firstRecipeElement);

    expect(addMealsButton).toBeEnabled();
  });

  it('should send post request to add a meal', async () => {
    const { addFoodButton, assembledDayDTO } = await setup();

    const fetchSpy = vi.spyOn(global, 'fetch');

    await userEvent.click(addFoodButton);

    const firstRecipeElement = await screen.findByText(
      new RegExp(mockRecipes[0].name, 'i'),
    );

    await userEvent.click(firstRecipeElement);

    const addMealsButton = screen.getByRole('button', {
      name: /añadir comidas/i,
    });

    await userEvent.click(addMealsButton);

    await waitFor(() => {
      // First time is for fetching recipes
      // Second time is for adding meal
      expect(fetchSpy).toHaveBeenCalledTimes(2);
    });

    const [, options] = fetchSpy.mock.calls[1];

    const body = JSON.parse(options!.body as string);

    expect(body).toEqual(
      expect.objectContaining({
        userId: 'dev-user', // TODO IMPORTANT Change when authentication is implemented. The value is hardocoded and the test will fail
        dayId: assembledDayDTO.id,
        recipeId: mockRecipes[0].id,
      }),
    );
  });
});
