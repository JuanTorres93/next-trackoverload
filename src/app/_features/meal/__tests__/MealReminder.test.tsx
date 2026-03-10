import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';

import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';

const mealsRepo = AppMealsRepo as MemoryMealsRepo;
const daysRepo = AppDaysRepo as MemoryDaysRepo;

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';
import { TEST_USER_ID } from '@/../tests/mocks/nextjs';

import { createMockDayWithMeal } from '../../../../../tests/mocks/days';
import MealReminder from '../MealReminder';

async function setup() {
  const dayWithMeal = await createMockDayWithMeal();
  const meal = dayWithMeal.meals[0];

  render(<MealReminder meal={meal} />);

  const card = screen.getByText(meal.name).closest('div') as HTMLDivElement;

  return { meal, card };
}

describe('MealReminder', () => {
  afterEach(() => {
    mealsRepo.clearForTesting();
    daysRepo.clearForTesting();
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
