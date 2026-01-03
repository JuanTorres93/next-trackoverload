import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  createMockIngredients,
  mockIngredientsForIngredientFinder,
} from '../../../../../tests/mocks/ingredients';
import { createServer } from '../../../../../tests/mocks/server';
import { createMockUser } from '../../../../../tests/mocks/user';

const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;

// Mock before importing the component that uses next/navigation
import '@/../tests/mocks/nextjs';

import NewRecipeForm from '../NewRecipeForm';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';

await createMockIngredients();
await createMockUser();

createServer([
  {
    path: '/api/ingredient/fuzzy/:term',
    method: 'get',
    response: ({ params }) => {
      const term = params.term as string;
      const results = mockIngredientsForIngredientFinder;

      const filteredIngredients: IngredientFinderResult[] = results.filter(
        (result) =>
          result.ingredient.name.toLowerCase().includes(term.toLowerCase())
      );

      return filteredIngredients;
    },
  },
]);

async function setup() {
  render(<NewRecipeForm />);

  const searchBar = screen.getByPlaceholderText(/ingred/i);
  const searchButton = screen.getByTestId('search-ingredient-button');

  await userEvent.type(searchBar, 'c');
  await userEvent.click(searchButton);

  const ingredientList = await screen.findByTestId('ingredient-list');

  const ingredientLineList = screen.getByTestId('ingredient-line-list');

  const createButton = screen.getByRole('button', { name: /crear receta/i });

  return { ingredientList, ingredientLineList, searchBar, createButton };
}

describe('NewRecipeForm', () => {
  it('fetches ingredients', async () => {
    const { ingredientList } = await setup();

    expect(ingredientList).toBeInTheDocument();

    // expect ingredientList to have 3 children (data in mock handler)
    expect(ingredientList.children.length).toBe(3);
  });

  it('does not show ingredient lines if not selected', async () => {
    const { ingredientLineList } = await setup();

    expect(ingredientLineList.children.length).toBe(0);
  });

  it('adds ingredient line on selection', async () => {
    const { ingredientList, ingredientLineList } = await setup();

    const firstIngredient = ingredientList.children[0];
    await userEvent.click(firstIngredient);

    expect(ingredientLineList.children.length).toBe(1);
  });

  it('adds multiple ingredient lines on selection', async () => {
    const { ingredientList, ingredientLineList } = await setup();

    const firstIngredient = ingredientList.children[0];
    const secondIngredient = ingredientList.children[1];
    await userEvent.click(firstIngredient);
    await userEvent.click(secondIngredient);

    expect(ingredientLineList.children.length).toBe(2);
  });

  it('removes already added ingredient lines on selection', async () => {
    const { ingredientList, ingredientLineList } = await setup();

    const firstIngredient = ingredientList.children[0];
    await userEvent.click(firstIngredient);
    await userEvent.click(firstIngredient);

    expect(ingredientLineList.children.length).toBe(0);
  });

  it('shows nutritional info summary when ingredients are added', async () => {
    const { ingredientList } = await setup();

    const firstIngredient = ingredientList.children[0];
    await userEvent.click(firstIngredient);

    const caloriesInfo = screen.getByText(/calorías totales/i);
    const proteinInfo = screen.getByText(/proteínas totales/i);

    expect(caloriesInfo).toBeInTheDocument();
    expect(proteinInfo).toBeInTheDocument();
  });

  it('does not show nutritional info summary when no ingredients are added', async () => {
    await setup();

    const caloriesInfo = screen.queryByText(/calorías totales/i);
    const proteinInfo = screen.queryByText(/proteínas totales/i);

    expect(caloriesInfo).not.toBeInTheDocument();
    expect(proteinInfo).not.toBeInTheDocument();
  });

  it('does not create recipe if no ingredients are selected', async () => {
    const { createButton } = await setup();

    expect(createButton).toBeDisabled();

    expect(recipesRepo.countForTesting()).toBe(0);

    await userEvent.click(createButton);

    expect(recipesRepo.countForTesting()).toBe(0);
  });

  it("does not create recipe if at least one ingredient's quantity is zero", async () => {
    const { ingredientList, createButton, ingredientLineList } = await setup();

    const firstIngredient = ingredientList.children[0];
    await userEvent.click(firstIngredient);

    const quantityInput = within(
      ingredientLineList.children[0] as HTMLElement
    ).getByRole('spinbutton');

    await userEvent.clear(quantityInput);

    expect(createButton).toBeDisabled();

    expect(recipesRepo.countForTesting()).toBe(0);

    await userEvent.click(createButton);

    expect(recipesRepo.countForTesting()).toBe(0);
  });

  it('ingredient has a default quantity of 100g', async () => {
    const { ingredientList, ingredientLineList } = await setup();

    const firstIngredient = ingredientList.children[0];
    await userEvent.click(firstIngredient);

    const quantityInput = within(
      ingredientLineList.children[0] as HTMLElement
    ).getByRole('spinbutton');

    expect((quantityInput as HTMLInputElement).value).toBe('100');
  });

  it('creates recipe if all ingredients have valid quantities', async () => {
    const { ingredientList, createButton, ingredientLineList } = await setup();

    const firstIngredient = ingredientList.children[0];
    await userEvent.click(firstIngredient);

    const quantityInput = within(
      ingredientLineList.children[0] as HTMLElement
    ).getByRole('spinbutton');

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, '150');

    expect(createButton).toBeEnabled();

    expect(recipesRepo.countForTesting()).toBe(0);

    await userEvent.click(createButton);

    expect(recipesRepo.countForTesting()).toBe(1);
  });
});
