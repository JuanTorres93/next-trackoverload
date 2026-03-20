import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
  await createMockUser();

  const todayId = dateToDayId(new Date());
  const dayWithMeals = await createMockDayWithMeal(
    todayId.day,
    todayId.month,
    todayId.year,
  );

  const ui = await DashboardPage();
  render(ui);

  const weightInput = screen.getByTestId('input-weight');

  return { weightInput, dayWithMeals, todayId };
}

describe('DashboardPage', () => {
  afterEach(() => {
    mealsRepo.clearForTesting();
    daysRepo.clearForTesting();
  });

  describe("Today's meals", async () => {
    it('Renders meal names for the day', async () => {
      const { dayWithMeals } = await setup();
      const meal = dayWithMeals.meals[0];

      const mealNameElement = screen.getByText(meal.name);

      expect(mealNameElement).toBeInTheDocument();
    });
  });

  describe('WeightAnalisys', () => {
    it('Renders input for changing weight', async () => {
      const { weightInput } = await setup();

      expect(weightInput).toBeInTheDocument();
    });

    it("updates user's weight for current day", async () => {
      const { weightInput, todayId } = await setup();

      const newWeight = '70';

      const dayInRepo = await daysRepo.getDayById(todayId.value);
      expect(dayInRepo?.userWeightInKg).not.toBe(Number(newWeight));

      await userEvent.clear(weightInput);
      await userEvent.type(weightInput, '70');

      await waitFor(async () => {
        const updatedDayInRepo = await daysRepo.getDayById(todayId.value);
        expect(updatedDayInRepo?.userWeightInKg).toBe(Number(newWeight));
      });
    });
  });
});
