import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';

import {
  createEmptyTestDay,
  getValidAssembledDayDTO,
} from '../../../../../tests/createProps/dayTestProps';
import { createMockRecipes } from '../../../../../tests/mocks/recipes';

const mealsRepo = AppMealsRepo as MemoryMealsRepo;
const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
const daysRepo = AppDaysRepo as MemoryDaysRepo;

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';

import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { createServer } from '../../../../../tests/mocks/server';
import DaySummary from '../DaySummary';

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
  const day = createEmptyTestDay({
    userId: 'dev-user', // TODO IMPORTANT Change when authentication is implemented. The value is hardocoded and the test will fail
  });

  const { assembledDayDTO, meal, fakeMeal } = getValidAssembledDayDTO();

  day.addMeal(meal.id);
  day.addFakeMeal(fakeMeal.id);

  await mealsRepo.saveMeal(meal);
  await fakeMealsRepo.saveFakeMeal(fakeMeal);
  await daysRepo.saveDay(day);

  render(
    <DaySummary dayId={assembledDayDTO.id} assembledDay={assembledDayDTO} />,
  );

  const addFoodButton = screen.getByRole('button', { name: /comida/i });

  const deleteMealButton = screen.getAllByTestId(
    'nutritional-summary-delete-button',
  );

  return { assembledDayDTO, addFoodButton, meal, fakeMeal, deleteMealButton };
}

describe('DaySummary', () => {
  it('should show meals info', async () => {
    const { meal } = await setup();

    const mealElement = await screen.findByText(new RegExp(meal.name, 'i'));

    expect(mealElement).toBeInTheDocument();
  });

  it('should show fake meals info', async () => {
    const { fakeMeal } = await setup();

    const fakeMealElement = await screen.findByText(
      new RegExp(fakeMeal.name, 'i'),
    );
    expect(fakeMealElement).toBeInTheDocument();
  });

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

  it('should remove meal on button click', async () => {
    const { deleteMealButton } = await setup();

    const mealsBefore = mealsRepo.countForTesting();
    expect(mealsBefore).toBe(1);

    await userEvent.click(deleteMealButton[0]);

    await waitFor(() => {
      const mealsAfter = mealsRepo.countForTesting();
      expect(mealsAfter).toBe(0);
    });
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
