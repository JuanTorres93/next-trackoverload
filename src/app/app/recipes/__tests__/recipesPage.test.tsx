import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMockUser } from '../../../../../tests/mocks/user';
import { createMockRecipes } from '@/../tests/mocks/recipes';

const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';
import RecipesPage from '../page';

async function setup() {
  // IMPORTANT DOC: RecipesPage is a server component and vitest has not idea about that concept. If we just plain render it, it tries to render it as a client component. The solution is to first execute it to get the UI and then render that UI.
  const ui = await RecipesPage();
  render(ui);
}

describe('RecipesPage', () => {
  it('Render New Recipe button', async () => {
    await setup();

    expect(
      screen.getByRole('link', { name: /nueva receta/i })
    ).toBeInTheDocument();
  });

  describe('With recipes', async () => {
    const { mockRecipes } = await createMockRecipes();

    it('Renders all recipes', async () => {
      await setup();

      for (const recipe of mockRecipes) {
        expect(
          screen.getByRole('heading', { name: recipe.name })
        ).toBeInTheDocument();
      }
    });

    it('Can delete recipe', async () => {
      await setup();

      const recipesContainer = screen.getByTestId('recipes-container');

      const deleteButtons = within(recipesContainer).getAllByRole('button');

      const recipesBefore = recipesRepo.countForTesting();
      expect(recipesBefore).toBeGreaterThan(0);

      await userEvent.click(deleteButtons[0]);

      const recipesAfter = recipesRepo.countForTesting();
      expect(recipesAfter).toBe(recipesBefore - 1);
    });
  });

  describe('Without recipes', () => {
    beforeAll(async () => {
      recipesRepo.clearForTesting();
      await createMockUser();
    });

    it('Renders no recipe text', async () => {
      await setup();

      expect(screen.getByText(/no hay recetas/i)).toBeInTheDocument();
    });
  });
});
