import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';

import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';

import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';

import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';

const mealsRepo = AppMealsRepo as MemoryMealsRepo;
const daysRepo = AppDaysRepo as MemoryDaysRepo;
const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;

import { TEST_USER_ID } from '@/../tests/mocks/nextjs';

import { createMockDayWithMeal } from '../../../../../tests/mocks/days';
import { createMockRecipes } from '../../../../../tests/mocks/recipes';
import { createServer } from '../../../../../tests/mocks/server';
import MealReminder from '../MealReminder';

async function setup() {
  const dayWithMeal = await createMockDayWithMeal();
  const meal = dayWithMeal.meals[0];

  render(<MealReminder meal={meal} dayId={dayWithMeal.id} />);

  const card = screen.getByText(meal.name).closest('div') as HTMLDivElement;

  return { meal, dayId: dayWithMeal.id, card };
}

describe('MealReminder', () => {
  afterEach(() => {
    mealsRepo.clearForTesting();
    daysRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
  });

  it('should toggle isEaten to true when clicking an uneaten meal', async () => {
    const { meal, card } = await setup();

    await userEvent.click(card);

    await waitFor(async () => {
      const saved = await mealsRepo.getMealByIdForUser(meal.id, TEST_USER_ID);
      expect(saved?.isEaten).toBe(true);
    });
  });

  it('should toggle isEaten back to false when clicking an already eaten meal', async () => {
    const { meal, card } = await setup();

    await userEvent.click(card);

    await waitFor(async () => {
      const saved = await mealsRepo.getMealByIdForUser(meal.id, TEST_USER_ID);
      expect(saved?.isEaten).toBe(true);
    });

    await userEvent.click(card);

    await waitFor(async () => {
      const saved = await mealsRepo.getMealByIdForUser(meal.id, TEST_USER_ID);
      expect(saved?.isEaten).toBe(false);
    });
  });
});

describe('MealReminder - food replacement', () => {
  let mockRecipesForApi: RecipeDTO[] = [];

  createServer([
    {
      path: '/api/recipe/getAll',
      method: 'get',
      response: () => ({ status: 'success', data: mockRecipesForApi }),
    },
  ]);

  afterEach(() => {
    mealsRepo.clearForTesting();
    daysRepo.clearForTesting();
    fakeMealsRepo.clearForTesting();
  });

  it('shows replacement type selection modal when replace button is clicked', async () => {
    const dayWithMeal = await createMockDayWithMeal();
    render(<MealReminder meal={dayWithMeal.meals[0]} dayId={dayWithMeal.id} />);

    await userEvent.click(screen.getByTestId('replace-food-button'));

    expect(screen.getByText(/elige una opción/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^comida/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /entrada rápida/i }),
    ).toBeInTheDocument();
  });

  it('replaces a meal with a meal from another recipe', async () => {
    const dayWithMeal = await createMockDayWithMeal();
    const originalMealId = dayWithMeal.meals[0].id;
    const { mockRecipes } = await createMockRecipes();
    mockRecipesForApi = mockRecipes;

    render(<MealReminder meal={dayWithMeal.meals[0]} dayId={dayWithMeal.id} />);

    await userEvent.click(screen.getByTestId('replace-food-button'));
    await userEvent.click(screen.getByRole('button', { name: /^comida/i }));

    await userEvent.click(
      await screen.findByRole('heading', { name: mockRecipes[0].name }),
    );
    await userEvent.click(
      screen.getByRole('button', { name: /añadir comidas/i }),
    );

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayByIdAndUserId(
        dayWithMeal.id,
        TEST_USER_ID,
      );
      expect(updatedDay?.mealIds).not.toContain(originalMealId);
      expect(updatedDay?.mealIds).toHaveLength(1);
    });
  });

  it('replaces a meal with a fake meal', async () => {
    const dayWithMeal = await createMockDayWithMeal();
    const originalMealId = dayWithMeal.meals[0].id;

    render(<MealReminder meal={dayWithMeal.meals[0]} dayId={dayWithMeal.id} />);

    await userEvent.click(screen.getByTestId('replace-food-button'));
    await userEvent.click(
      screen.getByRole('button', { name: /entrada rápida/i }),
    );

    await userEvent.type(
      screen.getByLabelText(/nombre de la comida/i),
      'Pizza',
    );
    await userEvent.type(screen.getByLabelText(/calorías/i), '800');
    await userEvent.type(screen.getByLabelText(/proteínas/i), '40');
    await userEvent.click(screen.getByRole('button', { name: /reemplazar/i }));

    await waitFor(async () => {
      const updatedDay = await daysRepo.getDayByIdAndUserId(
        dayWithMeal.id,
        TEST_USER_ID,
      );
      expect(updatedDay?.mealIds).not.toContain(originalMealId);
      expect(updatedDay?.mealIds).toHaveLength(0);
      expect(updatedDay?.fakeMealIds).toHaveLength(1);
    });
  });
});
