import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { createMockRecipes } from '../../../../../tests/mocks/recipes';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';

const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';
import RecipeCard from '../RecipeCard';

const mockRecipes = await createMockRecipes();

async function setup() {
  render(<RecipeCard recipe={mockRecipes[0]} />);

  const deleteButton = screen.getByRole('button');

  return { deleteButton };
}

describe('RecipeCard', () => {
  it('renders recipe card with correct information', async () => {
    await setup();

    const recipeName = screen.getByText(mockRecipes[0].name);
    const caloriesInfo = screen.getByText(
      Math.round(mockRecipes[0].calories).toString()
    );
    const proteinInfo = screen.getByText(
      Math.round(mockRecipes[0].protein).toString()
    );
    const image = screen.getByRole('img') as HTMLImageElement;

    expect(recipeName).toBeInTheDocument();
    expect(caloriesInfo).toBeInTheDocument();
    expect(proteinInfo).toBeInTheDocument();
    expect(image.src).toMatch(/recipe-no-picture/i);
  });

  it('deletes recipe on delete button click', async () => {
    const { deleteButton } = await setup();

    expect(deleteButton).toBeInTheDocument();

    expect(recipesRepo.countForTesting()).toBeGreaterThan(0);
    const recipesBeforeDelete = await recipesRepo.countForTesting();
    await userEvent.click(deleteButton);

    expect(recipesRepo.countForTesting()).toBe(recipesBeforeDelete - 1);
  });
});
