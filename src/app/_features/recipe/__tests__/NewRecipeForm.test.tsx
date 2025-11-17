import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createServer } from '../../../../../tests/mocks/server';

import NewRecipeForm from '../NewRecipeForm';

createServer([
  {
    path: '/api/ingredient/fuzzy/:term',
    method: 'get',
    response: (req, res, ctx) => {
      const { term } = req.params as { term: string };
      const ingredients = [
        {
          id: '1',
          name: 'Carrot',
          nutritionalInfoPer100g: { calories: 41, protein: 0.9 },
          imageUrl: 'https://example.com/carrot.jpg',
        },
        {
          id: '2',
          name: 'Cabbage',
          nutritionalInfoPer100g: { calories: 25, protein: 1.3 },
          imageUrl: 'https://example.com/cabbage.jpg',
        },
        {
          id: '3',
          name: 'Celery',

          nutritionalInfoPer100g: { calories: 16, protein: 0.7 },
          imageUrl: 'https://example.com/celery.jpg',
        },
      ];

      const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.name.toLowerCase().includes(term.toLowerCase())
      );

      return filteredIngredients;
    },
  },
]);

async function setup() {
  render(<NewRecipeForm />);

  const searchBar = screen.getByPlaceholderText(/ingred/i);

  await userEvent.type(searchBar, 'c');

  const ingredientList = await screen.findByTestId('ingredient-list');

  const ingredientLineList = screen.getByTestId('ingredient-line-list');

  const createButton = screen.getByRole('button', { name: /crear receta/i });

  return { ingredientList, ingredientLineList, searchBar, createButton };
}

describe('IngredientSearch', () => {
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
  });

  it("does not create recipe if at least one ingredient's quantity is zero", async () => {
    // TODO implement
  });
});
