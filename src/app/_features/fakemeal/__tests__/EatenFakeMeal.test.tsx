import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';

import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';

import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';

import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';

const daysRepo = AppDaysRepo as MemoryDaysRepo;
const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
const mealsRepo = AppMealsRepo as MemoryMealsRepo;

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';
import { TEST_USER_ID } from '@/../tests/mocks/nextjs';

import { createMockDayWithFakeMeal } from '../../../../../tests/mocks/days';
import { createMockRecipes } from '../../../../../tests/mocks/recipes';
import { createServer } from '../../../../../tests/mocks/server';
import EatenFakeMeal from '../EatenFakeMeal';

describe('EatenFakeMeal - food replacement', () => {
  let mockRecipesForApi: RecipeDTO[] = [];

  createServer([
    {
      path: '/api/recipe/getAll',
      method: 'get',
      response: () => ({ status: 'success', data: mockRecipesForApi }),
    },
  ]);

  afterEach(() => {
    daysRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
    mealsRepo.clearForTesting();
  });

  it('shows replacement type selection modal when replace button is clicked', async () => {
    const dayWithFakeMeal = await createMockDayWithFakeMeal();
    render(
      <EatenFakeMeal
        fakeMeal={dayWithFakeMeal.fakeMeals[0]}
        dayId={dayWithFakeMeal.id}
      />,
    );

    await userEvent.click(screen.getByTestId('replace-food-button'));

    expect(screen.getByText(/elige una opción/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^comida/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /entrada rápida/i }),
    ).toBeInTheDocument();
  });

  it('replaces a fake meal with a meal from a recipe', async () => {
    const dayWithFakeMeal = await createMockDayWithFakeMeal();
    const originalFakeMealId = dayWithFakeMeal.fakeMeals[0].id;
    const { mockRecipes } = await createMockRecipes();
    mockRecipesForApi = mockRecipes;

    render(
      <EatenFakeMeal
        fakeMeal={dayWithFakeMeal.fakeMeals[0]}
        dayId={dayWithFakeMeal.id}
      />,
    );

    await userEvent.click(screen.getByTestId('replace-food-button'));
    await userEvent.click(screen.getByRole('button', { name: /^comida/i }));

    await userEvent.click(await screen.findByText(mockRecipes[0].name));
    await userEvent.click(
      screen.getByRole('button', { name: /añadir comidas/i }),
    );

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayByIdAndUserId(
        dayWithFakeMeal.id,
        TEST_USER_ID,
      );
      expect(updatedDay?.fakeMealIds).not.toContain(originalFakeMealId);
      expect(updatedDay?.fakeMealIds).toHaveLength(0);
      expect(updatedDay?.mealIds).toHaveLength(1);
    });
  });

  it('replaces a fake meal with another fake meal', async () => {
    const dayWithFakeMeal = await createMockDayWithFakeMeal();
    const originalFakeMealId = dayWithFakeMeal.fakeMeals[0].id;

    render(
      <EatenFakeMeal
        fakeMeal={dayWithFakeMeal.fakeMeals[0]}
        dayId={dayWithFakeMeal.id}
      />,
    );

    await userEvent.click(screen.getByTestId('replace-food-button'));
    await userEvent.click(
      screen.getByRole('button', { name: /entrada rápida/i }),
    );

    await userEvent.type(
      screen.getByLabelText(/nombre de la comida/i),
      'Ensalada',
    );
    await userEvent.type(screen.getByLabelText(/calorías/i), '200');
    await userEvent.type(screen.getByLabelText(/proteínas/i), '10');
    await userEvent.click(screen.getByRole('button', { name: /reemplazar/i }));

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayByIdAndUserId(
        dayWithFakeMeal.id,
        TEST_USER_ID,
      );
      expect(updatedDay?.fakeMealIds).not.toContain(originalFakeMealId);
      expect(updatedDay?.fakeMealIds).toHaveLength(1);
    });
  });
});
