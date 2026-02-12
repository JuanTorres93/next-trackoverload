import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { createMockUser } from '../../../../../tests/mocks/user';

import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { AppFakeMealsRepo } from '@/interface-adapters/app/repos/AppFakeMealsRepo';
import { MemoryFakeMealsRepo } from '@/infra/repos/memory/MemoryFakeMealsRepo';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';

const fakeMealsRepo = AppFakeMealsRepo as MemoryFakeMealsRepo;
const daysRepo = AppDaysRepo as MemoryDaysRepo;

// Mock before importing the component that uses next/navigation
import '@/../tests/mocks/nextjs';

import AddFakeMealForm from '../AddFakeMealForm';
import { Day } from '@/domain/entities/day/Day';
import { validDayProps } from '../../../../../tests/createProps/dayTestProps';

await createMockUser();

async function setup() {
  daysRepo.clearForTesting();
  fakeMealsRepo.clearForTesting();

  const day = Day.create({
    ...validDayProps(),
    userId: 'dev-user',
  });
  await daysRepo.saveDay(day);

  render(<AddFakeMealForm dayId={day.id} />);

  const nameInput = screen.getByLabelText(/comida/i);
  const caloriesInput = screen.getByLabelText(/calorías/i);
  const proteinsInput = screen.getByLabelText(/proteínas/i);
  const submitButton = screen.getByRole('button', { name: /añadir comida/i });

  return { nameInput, caloriesInput, proteinsInput, submitButton };
}

describe('AddFakeMealForm', () => {
  it('creates fake meal on submit', async () => {
    const { nameInput, caloriesInput, proteinsInput, submitButton } =
      await setup();

    await userEvent.type(nameInput, 'Fake Meal Test');
    await userEvent.type(caloriesInput, '500');
    await userEvent.type(proteinsInput, '30');
    await userEvent.click(submitButton);

    let createdFakeMeal;

    await waitFor(async () => {
      const createdFakeMeals = await fakeMealsRepo.getAllFakeMeals();

      createdFakeMeal = createdFakeMeals[0];

      expect(createdFakeMeal).toBeDefined();
      expect(createdFakeMeal?.calories).toBe(500);
      expect(createdFakeMeal?.protein).toBe(30);
    });
  });
});
