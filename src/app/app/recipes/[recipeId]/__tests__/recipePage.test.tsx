import { mockIngredientsForIngredientFinder } from '@/../tests/mocks/ingredients';
import { createMockRecipes } from '@/../tests/mocks/recipes';
import { createServer } from '@/../tests/mocks/server';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';
import RecipePage from '../page';

const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
const usersRepo = AppUsersRepo as MemoryUsersRepo;
let mockRecipes: RecipeDTO[] = [];

createServer([
  {
    path: '/api/ingredient/fuzzy/:term',
    method: 'get',
    response: ({ params }) => {
      const term = params.term as string;
      const ingredients = mockIngredientsForIngredientFinder;

      const filteredIngredients = ingredients.filter((ingredient) =>
        ingredient.ingredient.name.toLowerCase().includes(term.toLowerCase())
      );

      return filteredIngredients;
    },
  },
]);

async function setup() {
  // Recreate mock recipes for each test to ensure a clean state
  const { mockRecipes: recipes } = await createMockRecipes();
  mockRecipes = recipes;

  const ui = await RecipePage({
    // IMPORTANT DOC: params is a Promise due to Next.js implementation
    params: Promise.resolve({ recipeId: recipes[0].id }),
  });
  render(ui);
}

afterEach(() => {
  recipesRepo.clearForTesting();
  usersRepo.clearForTesting();
});

describe('RecipePage', () => {
  it('renders recipe title', async () => {
    await setup();

    const title = await screen.findByDisplayValue(mockRecipes[0].name);

    expect(title).toBeInTheDocument();
  });

  it('renders rounded calories', async () => {
    await setup();

    const calories = mockRecipes[0].calories;
    const roundedCalories = Math.round(calories).toString();

    const caloriesElement = screen.getByText(roundedCalories);

    expect(calories).toBeDefined();
    expect(calories).toBeGreaterThan(0);
    expect(caloriesElement).toBeInTheDocument();
  });

  it('renders rounded protein', async () => {
    await setup();

    const protein = mockRecipes[0].protein;
    const roundedProtein = Math.round(protein).toString();

    const proteinElement = screen.getByText(roundedProtein);

    expect(protein).toBeDefined();
    expect(protein).toBeGreaterThan(0);
    expect(proteinElement).toBeInTheDocument();
  });

  it('renders ingredient lines', async () => {
    await setup();

    const ingredientLines = mockRecipes[0].ingredientLines;

    for (const line of ingredientLines) {
      const ingredientLineElement = screen.getByText(line.ingredient.name);
      expect(ingredientLineElement).toBeInTheDocument();
    }
  });

  it('renders ingredient quantities', async () => {
    await setup();

    const ingredientLines = mockRecipes[0].ingredientLines;

    for (const line of ingredientLines) {
      const quantityText = `${line.quantityInGrams}`;
      const quantityElement = screen.getByDisplayValue(quantityText);
      expect(quantityElement).toBeInTheDocument();
    }
  });

  it('renders total rounded calories per ingredient', async () => {
    await setup();

    const ingredientLines = mockRecipes[0].ingredientLines;

    for (const line of ingredientLines) {
      const roundedCalories = Math.round(line.calories).toString();

      const caloriesElement = screen.getByText(roundedCalories);
      expect(caloriesElement).toBeInTheDocument();
    }
  });

  it('renders total rounded protein per ingredient', async () => {
    await setup();

    const ingredientLines = mockRecipes[0].ingredientLines;

    for (const line of ingredientLines) {
      const roundedProtein = Math.round(line.protein).toString();

      const proteinElement = screen.getByText(roundedProtein);
      expect(proteinElement).toBeInTheDocument();
    }
  });

  it('allows updating ingredient quantity', async () => {
    await setup();

    const recipe = mockRecipes[0];

    const ingredientLines = recipe.ingredientLines;
    const lineToUpdate = ingredientLines[0];

    const newQuantity = '500';

    const quantityInput = screen.getByDisplayValue(
      lineToUpdate.quantityInGrams.toString()
    );

    await userEvent.clear(quantityInput);
    await userEvent.type(quantityInput, newQuantity);

    expect(quantityInput).toHaveValue(500);

    await waitFor(async () => {
      const updatedIngredientLine = await recipesRepo
        .getRecipeById(recipe.id)
        .then((r) =>
          r?.ingredientLines.find(
            (line) => line.ingredient.id === lineToUpdate.ingredient.id
          )
        );

      expect(updatedIngredientLine?.quantityInGrams).toBe(
        parseInt(newQuantity)
      );
    });
  });

  it('duplicates recipe', async () => {
    await setup();

    const initialRecipes = recipesRepo.countForTesting();

    const duplicateButton = screen.getByTestId('duplicate-recipe-button');

    await userEvent.click(duplicateButton);

    await waitFor(() => {
      const allRecipes = recipesRepo.countForTesting();
      expect(allRecipes).toBe(initialRecipes + 1);
    });
  });

  it('deletes recipe', async () => {
    await setup();

    const initialRecipes = recipesRepo.countForTesting();

    const deleteButton = screen.getByTestId('delete-recipe-button');

    await userEvent.click(deleteButton);

    await waitFor(() => {
      const allRecipes = recipesRepo.countForTesting();
      expect(allRecipes).toBe(initialRecipes - 1);
    });
  });

  it('can remove ingredients from recipe', async () => {
    await setup();

    const recipe = mockRecipes[0];

    const initialIngredientLinesCount = recipe.ingredientLines.length;

    const ingredientLinesContainer = screen.getByTestId(
      'ingredient-lines-container'
    );

    const ingredientLineElement = ingredientLinesContainer
      .children[0] as HTMLElement;
    const removeButton = within(ingredientLineElement).getByTestId(
      'nutritional-summary-delete-button'
    );

    await userEvent.click(removeButton);

    await waitFor(async () => {
      const updatedRecipe = await recipesRepo.getRecipeById(recipe.id);
      expect(updatedRecipe).not.toBeNull();
      expect(updatedRecipe!.ingredientLines.length).toBe(
        initialIngredientLinesCount - 1
      );
    });
  });

  it('cannot leave a recipe with less than one ingredient', async () => {
    await setup();

    const recipe = mockRecipes[0];

    // Remove all ingredients except one
    const deleteIngredientButtons = await screen.findAllByTestId(
      'nutritional-summary-delete-button'
    );

    const [lastButton, ...restButtons] = deleteIngredientButtons;

    for (const button of restButtons) {
      await userEvent.click(button);
    }

    const updatedRecipe = await recipesRepo.getRecipeById(recipe.id);

    expect(updatedRecipe).not.toBeNull();
    expect(updatedRecipe!.ingredientLines.length).toBe(1);

    await userEvent.click(lastButton);

    const finalRecipe = await recipesRepo.getRecipeById(recipe.id);

    expect(finalRecipe).not.toBeNull();
    expect(finalRecipe!.ingredientLines.length).toBe(1);
  });

  // TODO test update recipe name
  // TODO test update recipe image
  // TODO test Add ingredient
});
