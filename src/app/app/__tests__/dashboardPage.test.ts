import { render, screen } from '@testing-library/react';

import DashboardPage from '../page';

import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppMealsRepo } from '@/interface-adapters/app/repos/AppMealsRepo';

import { dateToDayId } from '@/domain/value-objects/DayId/DayId';
import { createMockDayWithMeal } from '../../../../tests/mocks/days';
import { createMockUser } from '../../../../tests/mocks/user';

const mealsRepo = AppMealsRepo as MemoryMealsRepo;
const daysRepo = AppDaysRepo as MemoryDaysRepo;

async function setup() {
  const ui = await DashboardPage();
  render(ui);
}

describe('DashboardPage', () => {
  describe("Today's meals", async () => {
    await createMockUser();

    const todayId = dateToDayId(new Date());
    const dayWithMeals = await createMockDayWithMeal(
      todayId.day,
      todayId.month,
      todayId.year,
    );

    it('Renders meal names for the day', async () => {
      await setup();
      const meal = dayWithMeals.meals[0];

      const mealNameElement = screen.getByText(meal.name);

      expect(mealNameElement).toBeInTheDocument();
    });
  });
});
