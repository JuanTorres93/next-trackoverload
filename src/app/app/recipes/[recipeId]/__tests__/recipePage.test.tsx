import { mockIngredientsForIngredientFinder } from '@/../tests/mocks/ingredients';
import { createMockRecipes } from '@/../tests/mocks/recipes';
import { createServer } from '@/../tests/mocks/server';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { AppRecipesRepo } from '@/interface-adapters/app/repos/AppRecipesRepo';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// Mock before importing the component that uses next/cache
import '@/../tests/mocks/nextjs';

// Mock AppClientImageProcessor to avoid browser API incompatibilities in the test environment
vi.mock('@/interface-adapters/app/services/AppClientImageProcessor', () => ({
  AppClientImageProcessor: {
    compressToMaxMB: vi.fn((file: File) => Promise.resolve(file)),
  },
}));

import RecipePage from '../page';
import { createTestImage } from '../../../../../../tests/helpers/imageTestHelpers';
import { mockDecodeFromVideoDevice } from '../../../../../../tests/mocks/zxing';

const recipesRepo = AppRecipesRepo as MemoryRecipesRepo;
const usersRepo = AppUsersRepo as MemoryUsersRepo;
let mockRecipes: RecipeDTO[] = [];

createServer(
  [
    {
      path: '/api/ingredient/fuzzy/:term',
      method: 'get',
      response: ({ params }) => {
        const term = params.term as string;
        const ingredients = mockIngredientsForIngredientFinder;

        const filteredIngredients = ingredients.filter((ingredient) =>
          ingredient.ingredient.name.toLowerCase().includes(term.toLowerCase()),
        );

        return { status: 'success', data: filteredIngredients };
      },
    },
    {
      path: '/api/ingredient/barcode/:barcode',
      method: 'get',
      response: () => ({
        status: 'success',
        data: [
          {
            ingredient: {
              name: 'Avena Integral',
              nutritionalInfoPer100g: { calories: 370, protein: 13 },
              imageUrl: undefined,
            },
            externalRef: {
              externalId: '8414807558305',
              source: 'openfoodfacts',
            },
          },
        ],
      }),
    },
  ],
  {
    onUnhandledRequest: 'bypass',
  },
);

async function setup() {
  // Recreate mock recipes for each test to ensure a clean state
  const { mockRecipes: recipes } = await createMockRecipes();
  mockRecipes = recipes;

  const renderedRecipe = recipes[0];

  const ui = await RecipePage({
    // IMPORTANT DOC: params is a Promise due to Next.js implementation
    params: Promise.resolve({ recipeId: renderedRecipe.id }),
  });
  render(ui);

  const barcodeScannerButton = screen.getByTestId('open-scanner-button');

  return { renderedRecipe, barcodeScannerButton };
}

afterEach(() => {
  recipesRepo.clearForTesting();
  usersRepo.clearForTesting();
});

describe('RecipePage', () => {
  describe('Shown info', () => {
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
  });

  describe('Behavior', () => {
    it('allows updating ingredient quantity', async () => {
      await setup();

      const recipe = mockRecipes[0];

      const ingredientLines = recipe.ingredientLines;
      const lineToUpdate = ingredientLines[0];

      const newQuantity = '500';

      const quantityInput = screen.getByDisplayValue(
        lineToUpdate.quantityInGrams.toString(),
      );

      await userEvent.clear(quantityInput);
      await userEvent.type(quantityInput, newQuantity);

      expect(quantityInput).toHaveValue(500);

      await waitFor(async () => {
        const updatedIngredientLine = await recipesRepo
          .getRecipeById(recipe.id)
          .then((r) =>
            r?.ingredientLines.find(
              (line) => line.ingredient.id === lineToUpdate.ingredient.id,
            ),
          );

        expect(updatedIngredientLine?.quantityInGrams).toBe(
          parseInt(newQuantity),
        );
      });
    });

    it('fetches ingredients through barcode', async () => {
      mockDecodeFromVideoDevice.mockImplementation(
        (
          _deviceId: unknown,
          _videoEl: unknown,
          callback: (
            result: { getText: () => string } | null,
            err: null,
          ) => void,
        ) => {
          // Codebar for Consum Avena Integral ingredient
          callback({ getText: () => '8414807558305' }, null);
        },
      );

      const { barcodeScannerButton } = await setup();

      await userEvent.click(barcodeScannerButton);

      await waitFor(async () => {
        // Get list again to avoid stale reference
        const ingredientList = await screen.findByTestId('ingredient-list');

        expect(ingredientList.children.length).toBe(1);
      });

      const ingredientElement = screen.getByText(/avena/i);
      expect(ingredientElement).toBeInTheDocument();
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
        'ingredient-lines-container',
      );

      const ingredientLineElement = ingredientLinesContainer
        .children[0] as HTMLElement;
      const removeButton = within(ingredientLineElement).getByTestId(
        'nutritional-summary-delete-button',
      );

      await userEvent.click(removeButton);

      await waitFor(async () => {
        const updatedRecipe = await recipesRepo.getRecipeById(recipe.id);
        expect(updatedRecipe).not.toBeNull();
        expect(updatedRecipe!.ingredientLines.length).toBe(
          initialIngredientLinesCount - 1,
        );
      });
    });

    it('cannot leave a recipe with less than one ingredient', async () => {
      await setup();

      const recipe = mockRecipes[0];

      // Remove all ingredients except one
      const deleteIngredientButtons = await screen.findAllByTestId(
        'nutritional-summary-delete-button',
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

    it('can add new ingredient to recipe', async () => {
      const { renderedRecipe } = await setup();

      const existingLinesContainer = screen.getByTestId(
        'ingredient-lines-container',
      );
      const initialIngredientLinesCount =
        existingLinesContainer.childElementCount;

      const searchIngredientInput = screen.getByPlaceholderText(
        'Buscar ingredientes...',
      );

      const searchButton = screen.getByRole('button', { name: 'Buscar' });

      await userEvent.type(searchIngredientInput, 'celery');
      await userEvent.click(searchButton);

      const ingredientList = await screen.findByTestId('ingredient-list');

      await waitFor(() => {
        expect(ingredientList.childNodes.length).toBeGreaterThan(0);
      });

      const searchResultItem = await screen.findByText(/celery/i);
      await userEvent.click(searchResultItem);

      const addButton = screen.getByRole('button', { name: /añadir/i });
      await userEvent.click(addButton);

      await waitFor(() => {
        // Get recipe from repo to check ingredient lines count (tested in this way because NextJS revalidation does not work in test environment)
        recipesRepo.getRecipeById(renderedRecipe.id).then((updatedRecipe) => {
          expect(updatedRecipe).not.toBeNull();
          expect(updatedRecipe!.ingredientLines.length).toBe(
            initialIngredientLinesCount + 1,
          );
        });
      });
    });

    it('updates recipe name', async () => {
      const { renderedRecipe } = await setup();

      const titleInput = (await screen.findByDisplayValue(
        renderedRecipe.name,
      )) as HTMLInputElement;

      const newTitle = 'Updated Recipe Title';

      await userEvent.clear(titleInput);
      await userEvent.type(titleInput, newTitle);

      await waitFor(async () => {
        const updatedRecipe = await recipesRepo.getRecipeById(
          renderedRecipe.id,
        );

        expect(updatedRecipe).not.toBeNull();
        expect(updatedRecipe!.name).toBe(newTitle);
      });
    });

    it('updates recipe image when no previous image existed', async () => {
      const { renderedRecipe } = await setup();

      const updateImageInput = screen.getByTestId(
        'edit-recipe-image-button',
      ) as HTMLInputElement;

      const testImage = await createTestImage('small');

      const testImageFile = new File(
        [new Uint8Array(testImage)],
        'test-image.png',
        {
          type: 'image/png',
        },
      );

      // Mock arrayBuffer method for Node.js environment
      testImageFile.arrayBuffer = async () => {
        const uint8Array = new Uint8Array(testImage);
        return uint8Array.buffer as ArrayBuffer;
      };

      expect(renderedRecipe.imageUrl).toBeUndefined();

      await userEvent.upload(updateImageInput, testImageFile);

      await waitFor(async () => {
        const updatedRecipe = await recipesRepo.getRecipeById(
          renderedRecipe.id,
        );

        expect(updatedRecipe).not.toBeNull();
        expect(updatedRecipe!.imageUrl).toBeDefined();
      });
    });

    // TODO test updating recipe image when previous image existed
  });
});
