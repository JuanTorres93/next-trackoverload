import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import * as ingredientTestProps from '../../../../../tests/createProps/ingredientTestProps';
import * as recipeTestProps from '../../../../../tests/createProps/recipeTestProps';
import { MongoIngredientsRepo } from '../MongoIngredientsRepo';
import { MongoRecipesRepo } from '../MongoRecipesRepo';
import RecipeLineMongo from '../models/RecipeLineMongo';
import RecipeMongo from '../models/RecipeMongo';
import { mockForThrowingError } from './mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from './setupMongoTestDB';

describe('MongoRecipesRepo', () => {
  let repo: MongoRecipesRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let recipe: Recipe;
  let ingredient: Ingredient;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    ingredientsRepo = new MongoIngredientsRepo();
    repo = new MongoRecipesRepo();

    // Create and save ingredients first (needed for recipe lines)
    ingredient = Ingredient.create(ingredientTestProps.validIngredientProps);
    await ingredientsRepo.saveIngredient(ingredient);

    const ingredient2 = Ingredient.create({
      id: 'ing2',
      name: 'Rice',
      calories: 130,
      protein: 3,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await ingredientsRepo.saveIngredient(ingredient2);

    // Create a recipe with ingredient lines
    recipe = Recipe.create(
      recipeTestProps.validRecipePropsWithIngredientLines(),
    );
    await repo.saveRecipe(recipe);
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('saveRecipe', () => {
    it('should save a recipe with its ingredient lines', async () => {
      const allRecipesBefore = await repo.getAllRecipes();
      expect(allRecipesBefore.length).toBe(1);

      const newIngredient = Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: 'ingredient-2',
        name: 'Rice',
      });
      await ingredientsRepo.saveIngredient(newIngredient);

      const ingredientLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'line-3',
        parentId: 'recipe2',
        parentType: 'recipe',
        ingredient: newIngredient,
        quantityInGrams: 200,
      });

      const newRecipe = Recipe.create({
        ...recipeTestProps.recipePropsNoIngredientLines,
        id: 'recipe2',
        name: 'Rice Bowl',
        ingredientLines: [ingredientLine],
        updatedAt: new Date('2023-01-02'),
      });
      await repo.saveRecipe(newRecipe);

      const allRecipes = await repo.getAllRecipes();
      expect(allRecipes.length).toBe(2);
      expect(allRecipes[1].name).toBe('Rice Bowl');
      expect(allRecipes[1].ingredientLines).toHaveLength(1);
      expect(allRecipes[1].ingredientLines[0].ingredient.name).toBe('Rice');
    });

    it('should update an existing recipe', async () => {
      const existingRecipe = await repo.getRecipeById(
        recipeTestProps.recipePropsNoIngredientLines.id,
      );
      existingRecipe!.rename('Updated Recipe Name');
      await repo.saveRecipe(existingRecipe!);

      const allRecipes = await repo.getAllRecipes();
      expect(allRecipes.length).toBe(1);
      expect(allRecipes[0].name).toBe('Updated Recipe Name');
    });

    it('should update recipe ingredient lines when saving', async () => {
      const existingRecipe = await repo.getRecipeById(
        recipeTestProps.recipePropsNoIngredientLines.id,
      );
      expect(existingRecipe!.ingredientLines).toHaveLength(2);

      const anotherIngredient = Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: 'ingredient-3',
        name: 'Tomato',
      });
      await ingredientsRepo.saveIngredient(anotherIngredient);

      const newLine = IngredientLine.create({
        ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
        id: 'line-new',
        parentId: existingRecipe!.id,
        parentType: 'recipe',
        ingredient: anotherIngredient,
        quantityInGrams: 50,
      });

      existingRecipe!.addIngredientLine(newLine);
      await repo.saveRecipe(existingRecipe!);

      const updatedRecipe = await repo.getRecipeById(existingRecipe!.id);
      expect(updatedRecipe!.ingredientLines).toHaveLength(3);
      expect(updatedRecipe!.ingredientLines[2].ingredient.name).toBe('Tomato');
    });
  });

  describe('getAllRecipes', () => {
    it('should retrieve all recipes', async () => {
      const recipes = await repo.getAllRecipes();
      expect(recipes.length).toBe(1);
      expect(recipes[0].id).toBe(
        recipeTestProps.recipePropsNoIngredientLines.id,
      );
    });

    it('should populate ingredient lines with ingredients', async () => {
      const recipes = await repo.getAllRecipes();
      expect(recipes[0].ingredientLines).toHaveLength(2);
      expect(recipes[0].ingredientLines[0].ingredient.name).toBe(
        ingredientTestProps.validIngredientProps.name,
      );
    });
  });

  describe('getRecipeById', () => {
    it('should retrieve a recipe by id', async () => {
      const foundRecipe = await repo.getRecipeById(
        recipeTestProps.recipePropsNoIngredientLines.id,
      );
      expect(foundRecipe).not.toBeNull();
      expect(foundRecipe!.id).toBe(
        recipeTestProps.recipePropsNoIngredientLines.id,
      );
    });

    it('should return null for non-existent id', async () => {
      const foundRecipe = await repo.getRecipeById('non-existent-id');
      expect(foundRecipe).toBeNull();
    });

    it('should populate ingredient lines with ingredients', async () => {
      const foundRecipe = await repo.getRecipeById(
        recipeTestProps.recipePropsNoIngredientLines.id,
      );
      expect(foundRecipe!.ingredientLines).toHaveLength(2);
      expect(foundRecipe!.ingredientLines[0].ingredient).toBeDefined();
    });
  });

  describe('getAllRecipesByUserId', () => {
    it('should retrieve all recipes for a specific user', async () => {
      const recipes = await repo.getAllRecipesByUserId(
        recipeTestProps.recipePropsNoIngredientLines.userId,
      );
      expect(recipes.length).toBe(1);
      expect(recipes[0].userId).toBe(
        recipeTestProps.recipePropsNoIngredientLines.userId,
      );
    });

    it('should return empty array for user with no recipes', async () => {
      const recipes = await repo.getAllRecipesByUserId('other-user-id');
      expect(recipes).toHaveLength(0);
    });

    it('should only return recipes for the specified user', async () => {
      const anotherIngredient = Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: 'ingredient-other',
        name: 'Other Ingredient',
      });
      await ingredientsRepo.saveIngredient(anotherIngredient);

      const otherUserRecipe = Recipe.create({
        ...recipeTestProps.recipePropsNoIngredientLines,
        id: 'recipe-other-user',
        userId: 'other-user-id',
        ingredientLines: [
          IngredientLine.create({
            ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
            id: 'line-other',
            parentId: 'recipe-other-user',
            parentType: 'recipe',
            ingredient: anotherIngredient,
            quantityInGrams: 150,
          }),
        ],
      });
      await repo.saveRecipe(otherUserRecipe);

      const userRecipes = await repo.getAllRecipesByUserId(
        recipeTestProps.recipePropsNoIngredientLines.userId,
      );
      expect(userRecipes).toHaveLength(1);
      expect(userRecipes[0].userId).toBe(
        recipeTestProps.recipePropsNoIngredientLines.userId,
      );
    });
  });

  describe('getRecipeByIdAndUserId', () => {
    it('should retrieve a recipe by id and userId', async () => {
      const foundRecipe = await repo.getRecipeByIdAndUserId(
        recipeTestProps.recipePropsNoIngredientLines.id,
        recipeTestProps.recipePropsNoIngredientLines.userId,
      );
      expect(foundRecipe).not.toBeNull();
      expect(foundRecipe!.id).toBe(
        recipeTestProps.recipePropsNoIngredientLines.id,
      );
      expect(foundRecipe!.userId).toBe(
        recipeTestProps.recipePropsNoIngredientLines.userId,
      );
    });

    it('should return null if userId does not match', async () => {
      const foundRecipe = await repo.getRecipeByIdAndUserId(
        recipeTestProps.recipePropsNoIngredientLines.id,
        'wrong-user-id',
      );
      expect(foundRecipe).toBeNull();
    });

    it('should return null if id does not exist', async () => {
      const foundRecipe = await repo.getRecipeByIdAndUserId(
        'non-existent-id',
        recipeTestProps.recipePropsNoIngredientLines.userId,
      );
      expect(foundRecipe).toBeNull();
    });
  });

  describe('deleteRecipe', () => {
    it('should delete a recipe and its ingredient lines', async () => {
      const allRecipesBefore = await repo.getAllRecipes();
      expect(allRecipesBefore.length).toBe(1);
      const allRecipeLinesBefore = await RecipeLineMongo.find({
        parentId: recipeTestProps.recipePropsNoIngredientLines.id,
      });
      expect(allRecipeLinesBefore.length).toBe(2);

      await repo.deleteRecipe(recipeTestProps.recipePropsNoIngredientLines.id);

      const recipesAfterDelete = await repo.getAllRecipes();
      expect(recipesAfterDelete.length).toBe(0);

      // Verify that recipe lines are also deleted
      const recipeLines = await RecipeLineMongo.find({
        parentId: recipeTestProps.recipePropsNoIngredientLines.id,
      });
      expect(recipeLines.length).toBe(0);
    });

    it('should reject when recipe does not exist', async () => {
      await expect(repo.deleteRecipe('non-existent-id')).rejects.toEqual(null);
    });
  });

  describe('deleteIngredientLineInRecipe', () => {
    it('should delete a single ingredient line', async () => {
      const existingRecipe = await repo.getRecipeById(
        recipeTestProps.recipePropsNoIngredientLines.id,
      );
      expect(existingRecipe!.ingredientLines).toHaveLength(2);
      const lineIdToDelete = existingRecipe!.ingredientLines[0].id;

      await repo.deleteIngredientLineInRecipe(
        recipeTestProps.recipePropsNoIngredientLines.id,
        lineIdToDelete,
      );

      // Verify the line is deleted from the database
      const recipeLines = await RecipeLineMongo.find({
        parentId: recipeTestProps.recipePropsNoIngredientLines.id,
      });
      expect(recipeLines.length).toBe(1);
      expect(recipeLines[0].id).not.toBe(lineIdToDelete);
    });
  });

  describe('deleteMultipleIngredientLinesInRecipe', () => {
    it('should delete multiple ingredient lines', async () => {
      const anotherIngredient = Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: 'ingredient-another',
        name: 'Another Ingredient',
      });
      await ingredientsRepo.saveIngredient(anotherIngredient);

      const recipe2 = Recipe.create({
        ...recipeTestProps.recipePropsNoIngredientLines,
        id: 'recipe-2',
        ingredientLines: [
          IngredientLine.create({
            ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
            id: 'line-recipe2-1',
            parentId: 'recipe-2',
            parentType: 'recipe',
            ingredient: ingredient,
            quantityInGrams: 100,
          }),
          IngredientLine.create({
            ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
            id: 'line-recipe2-2',
            parentId: 'recipe-2',
            parentType: 'recipe',
            ingredient: anotherIngredient,
            quantityInGrams: 200,
          }),
        ],
      });
      await repo.saveRecipe(recipe2);

      const existingRecipe = await repo.getRecipeById(
        recipeTestProps.recipePropsNoIngredientLines.id,
      );
      const lineIdRecipe1 = existingRecipe!.ingredientLines[0].id;

      const recipe2Loaded = await repo.getRecipeById('recipe-2');
      const lineIdRecipe2 = recipe2Loaded!.ingredientLines[0].id;

      await repo.deleteMultipleIngredientLinesInRecipe(
        [recipeTestProps.recipePropsNoIngredientLines.id, 'recipe-2'],
        [lineIdRecipe1, lineIdRecipe2],
      );

      // Verify lines are deleted
      const recipe1Lines = await RecipeLineMongo.find({
        parentId: recipeTestProps.recipePropsNoIngredientLines.id,
      });
      expect(recipe1Lines.length).toBe(1);
      expect(recipe1Lines[0].id).not.toBe(lineIdRecipe1);

      const recipe2Lines = await RecipeLineMongo.find({
        parentId: 'recipe-2',
      });
      expect(recipe2Lines.length).toBe(1);
      expect(recipe2Lines[0].id).not.toBe(lineIdRecipe2);
    });
  });

  describe('deleteAllRecipesForUser', () => {
    it('should delete all recipes for a user', async () => {
      const anotherIngredient = Ingredient.create({
        ...ingredientTestProps.validIngredientProps,
        id: 'ingredient-2',
        name: 'Another Ingredient',
      });
      await ingredientsRepo.saveIngredient(anotherIngredient);

      const recipe2 = Recipe.create({
        ...recipeTestProps.recipePropsNoIngredientLines,
        id: 'recipe-2',
        userId: recipeTestProps.recipePropsNoIngredientLines.userId,
        ingredientLines: [
          IngredientLine.create({
            ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
            id: 'line-3',
            parentId: 'recipe-2',
            parentType: 'recipe',
            ingredient: anotherIngredient,
            quantityInGrams: 105,
          }),
        ],
      });

      const recipeOtherUser = Recipe.create({
        ...recipeTestProps.recipePropsNoIngredientLines,
        id: 'recipe-3',
        userId: 'other-user',
        ingredientLines: [
          IngredientLine.create({
            ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
            id: 'line-4',
            parentId: 'recipe-3',
            parentType: 'recipe',
            ingredient,
            quantityInGrams: 105,
          }),
        ],
      });

      await repo.saveRecipe(recipe2);
      await repo.saveRecipe(recipeOtherUser);

      const allRecipesBefore = await repo.getAllRecipes();
      expect(allRecipesBefore).toHaveLength(3);

      await repo.deleteAllRecipesForUser(
        recipeTestProps.recipePropsNoIngredientLines.userId,
      );

      const allRecipes = await repo.getAllRecipes();
      expect(allRecipes).toHaveLength(1);
      expect(allRecipes[0].userId).toBe('other-user');

      // Verify recipe lines for deleted recipes are also deleted
      const recipeLinesForDeletedUser = await RecipeLineMongo.find({
        parentId: {
          $in: [recipeTestProps.recipePropsNoIngredientLines.id, 'recipe-2'],
        },
      });
      expect(recipeLinesForDeletedUser.length).toBe(0);
    });
  });

  describe('transactions', () => {
    describe('saveRecipe', () => {
      it('should rollback changes if error in findOneAndUpdate', async () => {
        mockForThrowingError(RecipeMongo, 'findOneAndUpdate');

        const existingRecipe = await repo.getRecipeById(
          recipeTestProps.recipePropsNoIngredientLines.id,
        );
        existingRecipe!.rename('Updated Recipe Name');

        // Try to save recipe - should throw error
        await expect(repo.saveRecipe(existingRecipe!)).rejects.toThrow(
          /Mocked error.*findOneAndUpdate/i,
        );

        const notUpdatedRecipe = await repo.getRecipeById(
          recipeTestProps.recipePropsNoIngredientLines.id,
        );
        expect(notUpdatedRecipe!.name).toBe(
          recipeTestProps.recipePropsNoIngredientLines.name,
        );
      });

      it('should rollback changes if error in deleteMany recipe lines', async () => {
        mockForThrowingError(RecipeLineMongo, 'deleteMany');

        const existingRecipe = await repo.getRecipeById(
          recipeTestProps.recipePropsNoIngredientLines.id,
        );
        existingRecipe!.rename('Updated Recipe Name');

        const anotherIngredient = Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: 'ingredient-2',
          name: 'Tomato',
        });
        await ingredientsRepo.saveIngredient(anotherIngredient);

        const newLine = IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-new',
          parentId: existingRecipe!.id,
          parentType: 'recipe',
          ingredient: anotherIngredient,
          quantityInGrams: 50,
        });

        existingRecipe!.addIngredientLine(newLine);

        // Try to save recipe
        await expect(repo.saveRecipe(existingRecipe!)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        const notUpdatedRecipe = await repo.getRecipeById(
          recipeTestProps.recipePropsNoIngredientLines.id,
        );
        expect(notUpdatedRecipe!.name).toBe(
          recipeTestProps.recipePropsNoIngredientLines.name,
        );
        expect(notUpdatedRecipe!.ingredientLines).toHaveLength(2);
      });

      it('should rollback changes if error in insertMany recipe lines', async () => {
        mockForThrowingError(RecipeLineMongo, 'insertMany');

        const existingRecipe = await repo.getRecipeById(
          recipeTestProps.recipePropsNoIngredientLines.id,
        );
        existingRecipe!.rename('Updated Recipe Name');

        const anotherIngredient = Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: 'ingredient-2',
          name: 'Tomato',
        });
        await ingredientsRepo.saveIngredient(anotherIngredient);

        const newLine = IngredientLine.create({
          ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
          id: 'line-new',
          parentId: existingRecipe!.id,
          parentType: 'recipe',
          ingredient: anotherIngredient,
          quantityInGrams: 50,
        });

        existingRecipe!.addIngredientLine(newLine);

        // Try to save recipe
        await expect(repo.saveRecipe(existingRecipe!)).rejects.toThrow(
          /Mocked error.*insertMany/i,
        );

        const notUpdatedRecipe = await repo.getRecipeById(
          recipeTestProps.recipePropsNoIngredientLines.id,
        );
        expect(notUpdatedRecipe!.name).toBe(
          recipeTestProps.recipePropsNoIngredientLines.name,
        );
        expect(notUpdatedRecipe!.ingredientLines).toHaveLength(2);
      });
    });

    describe('deleteRecipe', () => {
      it('should rollback changes if error occurs when deleting recipe', async () => {
        mockForThrowingError(RecipeMongo, 'deleteOne');

        const recipeId = recipeTestProps.recipePropsNoIngredientLines.id;

        const initialRecipeCount = await repo.getAllRecipes();
        expect(initialRecipeCount.length).toBe(1);

        const initialRecipe = await repo.getRecipeById(recipeId);
        expect(initialRecipe).not.toBeNull();
        expect(initialRecipe!.ingredientLines).toHaveLength(2);
        const initialRecipeLineId = initialRecipe!.ingredientLines[0].id;

        // Try to delete recipe
        await expect(repo.deleteRecipe(recipeId)).rejects.toThrow(
          /Mocked error.*deleteOne/i,
        );

        // Verify that rollback worked: the recipe still exists
        const recipesAfterFailedDelete = await repo.getAllRecipes();
        expect(recipesAfterFailedDelete.length).toBe(1);

        const recipeAfterFailedDelete = await repo.getRecipeById(recipeId);
        expect(recipeAfterFailedDelete).not.toBeNull();
        expect(recipeAfterFailedDelete!.id).toBe(recipeId);

        // Verify that the recipe lines still exist
        expect(recipeAfterFailedDelete!.ingredientLines).toHaveLength(2);
        expect(recipeAfterFailedDelete!.ingredientLines[0].id).toBe(
          initialRecipeLineId,
        );
      });

      it('should rollback changes if error occurs when deleting recipe lines', async () => {
        mockForThrowingError(RecipeLineMongo, 'deleteMany');

        const recipeId = recipeTestProps.recipePropsNoIngredientLines.id;

        const initialRecipeCount = await repo.getAllRecipes();
        expect(initialRecipeCount.length).toBe(1);

        const initialRecipe = await repo.getRecipeById(recipeId);
        expect(initialRecipe).not.toBeNull();
        expect(initialRecipe!.ingredientLines).toHaveLength(2);
        const initialRecipeLineId = initialRecipe!.ingredientLines[0].id;

        // Try to delete recipe
        await expect(repo.deleteRecipe(recipeId)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        // Verify that rollback worked: the recipe still exists
        const recipesAfterFailedDelete = await repo.getAllRecipes();
        expect(recipesAfterFailedDelete.length).toBe(1);

        const recipeAfterFailedDelete = await repo.getRecipeById(recipeId);
        expect(recipeAfterFailedDelete).not.toBeNull();
        expect(recipeAfterFailedDelete!.id).toBe(recipeId);

        // Verify that the recipe lines still exist
        expect(recipeAfterFailedDelete!.ingredientLines).toHaveLength(2);
        expect(recipeAfterFailedDelete!.ingredientLines[0].id).toBe(
          initialRecipeLineId,
        );
      });
    });

    describe('deleteIngredientLineInRecipe', () => {
      it('should rollback changes if error occurs when deleting ingredient line', async () => {
        mockForThrowingError(RecipeLineMongo, 'deleteOne');

        const recipeId = recipeTestProps.recipePropsNoIngredientLines.id;
        const initialRecipe = await repo.getRecipeById(recipeId);
        expect(initialRecipe!.ingredientLines).toHaveLength(2);
        const lineIdToDelete = initialRecipe!.ingredientLines[0].id;

        // Try to delete ingredient line
        await expect(
          repo.deleteIngredientLineInRecipe(recipeId, lineIdToDelete),
        ).rejects.toThrow(/Mocked error.*deleteOne/i);

        // Verify that rollback worked: the line still exists
        const recipeLinesAfterFailed = await RecipeLineMongo.find({
          parentId: recipeId,
        });
        expect(recipeLinesAfterFailed.length).toBe(2);
        expect(
          recipeLinesAfterFailed.some((line) => line.id === lineIdToDelete),
        ).toBe(true);
      });
    });

    describe('deleteMultipleIngredientLinesInRecipe', () => {
      it('should rollback changes if error occurs when deleting multiple ingredient lines', async () => {
        const anotherIngredient = Ingredient.create({
          ...ingredientTestProps.validIngredientProps,
          id: 'ingredient-another',
          name: 'Another Ingredient',
        });
        await ingredientsRepo.saveIngredient(anotherIngredient);

        const recipe2 = Recipe.create({
          ...recipeTestProps.recipePropsNoIngredientLines,
          id: 'recipe-2',
          ingredientLines: [
            IngredientLine.create({
              ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
              id: 'line-recipe2-1',
              parentId: 'recipe-2',
              parentType: 'recipe',
              ingredient: ingredient,
              quantityInGrams: 100,
            }),
          ],
        });
        await repo.saveRecipe(recipe2);

        const existingRecipe = await repo.getRecipeById(
          recipeTestProps.recipePropsNoIngredientLines.id,
        );
        const lineIdRecipe1 = existingRecipe!.ingredientLines[0].id;

        const recipe2Loaded = await repo.getRecipeById('recipe-2');
        const lineIdRecipe2 = recipe2Loaded!.ingredientLines[0].id;

        // Set up the mock AFTER saving the recipes
        mockForThrowingError(RecipeLineMongo, 'deleteMany');

        // Try to delete multiple ingredient lines
        await expect(
          repo.deleteMultipleIngredientLinesInRecipe(
            [recipeTestProps.recipePropsNoIngredientLines.id, 'recipe-2'],
            [lineIdRecipe1, lineIdRecipe2],
          ),
        ).rejects.toThrow(/Mocked error.*deleteMany/i);

        // Verify that rollback worked: the lines still exist
        const recipe1Lines = await RecipeLineMongo.find({
          parentId: recipeTestProps.recipePropsNoIngredientLines.id,
        });
        expect(recipe1Lines.length).toBe(2);
        expect(recipe1Lines.some((line) => line.id === lineIdRecipe1)).toBe(
          true,
        );

        const recipe2Lines = await RecipeLineMongo.find({
          parentId: 'recipe-2',
        });
        expect(recipe2Lines.length).toBe(1);
        expect(recipe2Lines.some((line) => line.id === lineIdRecipe2)).toBe(
          true,
        );
      });
    });

    describe('deleteAllRecipesForUser', () => {
      it('should rollback changes if error occurs when deleting recipes', async () => {
        mockForThrowingError(RecipeMongo, 'deleteMany');

        const userId = recipeTestProps.recipePropsNoIngredientLines.userId;

        const initialRecipes = await repo.getAllRecipesByUserId(userId);
        expect(initialRecipes).toHaveLength(1);

        const initialRecipeLineId = initialRecipes[0].ingredientLines[0].id;

        // Try to delete recipes for user
        await expect(repo.deleteAllRecipesForUser(userId)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        // Verify that rollback worked: the recipe still exists
        const recipesAfterFailedDelete =
          await repo.getAllRecipesByUserId(userId);
        expect(recipesAfterFailedDelete).toHaveLength(1);

        const recipeAfterFailedDelete = recipesAfterFailedDelete[0];
        expect(recipeAfterFailedDelete.id).toBe(
          recipeTestProps.recipePropsNoIngredientLines.id,
        );

        // Verify that the recipe lines still exist
        expect(recipeAfterFailedDelete.ingredientLines).toHaveLength(2);
        expect(recipeAfterFailedDelete.ingredientLines[0].id).toBe(
          initialRecipeLineId,
        );
      });

      it('should rollback changes if error occurs when deleting recipe lines', async () => {
        mockForThrowingError(RecipeLineMongo, 'deleteMany');

        const userId = recipeTestProps.recipePropsNoIngredientLines.userId;

        const initialRecipes = await repo.getAllRecipesByUserId(userId);
        expect(initialRecipes).toHaveLength(1);

        const initialRecipeLineId = initialRecipes[0].ingredientLines[0].id;

        // Try to delete recipes for user
        await expect(repo.deleteAllRecipesForUser(userId)).rejects.toThrow(
          /Mocked error.*deleteMany/i,
        );

        // Verify that rollback worked: the recipe still exists
        const recipesAfterFailedDelete =
          await repo.getAllRecipesByUserId(userId);
        expect(recipesAfterFailedDelete).toHaveLength(1);

        const recipeAfterFailedDelete = recipesAfterFailedDelete[0];
        expect(recipeAfterFailedDelete.id).toBe(
          recipeTestProps.recipePropsNoIngredientLines.id,
        );

        // Verify that the recipe lines still exist
        expect(recipeAfterFailedDelete.ingredientLines).toHaveLength(2);
        expect(recipeAfterFailedDelete.ingredientLines[0].id).toBe(
          initialRecipeLineId,
        );
      });
    });
  });
});
