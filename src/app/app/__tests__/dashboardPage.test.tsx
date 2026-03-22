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
      // Actual behaviour is tested in the component itself
      const { weightInput } = await setup();

      expect(weightInput).toBeInTheDocument();
    });

    it('Renders calories goal input for today', async () => {
      await setup();

      const caloriesGoalInput = screen.getByTestId('input-calories-goal');

      expect(caloriesGoalInput).toBeInTheDocument();
    });
  });
});
