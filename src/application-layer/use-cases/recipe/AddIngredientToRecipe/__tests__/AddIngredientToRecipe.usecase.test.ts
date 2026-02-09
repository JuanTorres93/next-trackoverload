import * as externalIngredientRefTestProps from '../../../../../../tests/createProps/externalIngredientRefTestProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { MemoryExternalIngredientsRefRepo } from '@/infra';
import { MemoryUnitOfWork } from '@/infra/unit-of-work/MemoryUnitOfWork/MemoryUnitOfWork';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';

import { AddIngredientToRecipeUsecase } from '../AddIngredientToRecipe.usecase';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';

describe('AddIngredientToRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let usersRepo: MemoryUsersRepo;
  let externalIngredientsRefRepo: MemoryExternalIngredientsRefRepo;
  let idGenerator: Uuidv4IdGenerator;
  let unitOfWork: MemoryUnitOfWork;

  let addIngredientToRecipeUsecase: AddIngredientToRecipeUsecase;
  let testRecipe: Recipe;
  let newExternalIngredientRef: ExternalIngredientRef;
  let newIngredient: Ingredient;
  let user: User;

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    usersRepo = new MemoryUsersRepo();
    externalIngredientsRefRepo = new MemoryExternalIngredientsRefRepo();
    idGenerator = new Uuidv4IdGenerator();
    unitOfWork = new MemoryUnitOfWork();

    addIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
      recipesRepo,
      ingredientsRepo,
      usersRepo,
      externalIngredientsRefRepo,
      idGenerator,
      unitOfWork,
    );

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await usersRepo.saveUser(user);

    // Create ingredient for initial recipe
    const testIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(testIngredient);

    const testIngredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    testRecipe = Recipe.create({
      ...recipeTestProps.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });
    await recipesRepo.saveRecipe(testRecipe);

    // Create ingredient for adding to recipe
    newExternalIngredientRef = ExternalIngredientRef.create({
      ...externalIngredientRefTestProps.validExternalIngredientRefProps,
      ingredientId: 'new-ingredient-id',
    });
    await externalIngredientsRefRepo.save(newExternalIngredientRef);

    newIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
      id: 'new-ingredient-id',
    });
    await ingredientsRepo.saveIngredient(newIngredient);
  });

  describe('Addition', () => {
    it('should add ingredient to recipe successfully', async () => {
      const originalIngredientCount = testRecipe.ingredientLines.length;

      const request = {
        recipeId: testRecipe.id,
        userId: userTestProps.userId,
        externalIngredientId: newExternalIngredientRef.externalId,
        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,
        name: ingredientTestProps.validIngredientProps.name,
        caloriesPer100g: ingredientTestProps.validIngredientProps.calories,
        proteinPer100g: ingredientTestProps.validIngredientProps.protein,
        quantityInGrams: 150,
      };

      const result = await addIngredientToRecipeUsecase.execute(request);

      expect(result.ingredientLines).toHaveLength(originalIngredientCount + 1);
    });

    it('should return RecipeDTO', async () => {
      const request = {
        recipeId: testRecipe.id,
        userId: userTestProps.userId,
        externalIngredientId: newExternalIngredientRef.externalId,
        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,
        name: ingredientTestProps.validIngredientProps.name,
        caloriesPer100g: ingredientTestProps.validIngredientProps.calories,
        proteinPer100g: ingredientTestProps.validIngredientProps.protein,
        quantityInGrams: 150,
      };

      const result = await addIngredientToRecipeUsecase.execute(request);

      expect(result).not.toBeInstanceOf(Recipe);
      for (const prop of dto.recipeDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should update recipe updatedAt timestamp', async () => {
      const originalUpdatedAt = testRecipe.updatedAt;

      // Wait a moment to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 10));

      const request = {
        userId: userTestProps.userId,
        recipeId: testRecipe.id,
        externalIngredientId: newExternalIngredientRef.externalId,
        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,
        name: ingredientTestProps.validIngredientProps.name,
        caloriesPer100g: ingredientTestProps.validIngredientProps.calories,
        proteinPer100g: ingredientTestProps.validIngredientProps.protein,
        quantityInGrams: 150,
      };

      const result = await addIngredientToRecipeUsecase.execute(request);

      expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('Side effects', () => {
    it('should create new external ingredient if it did not exist', async () => {
      const request = {
        recipeId: testRecipe.id,
        userId: userTestProps.userId,
        externalIngredientId: 'non-existent-external-ingredient-id',
        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,
        name: ingredientTestProps.validIngredientProps.name,
        caloriesPer100g: ingredientTestProps.validIngredientProps.calories,
        proteinPer100g: ingredientTestProps.validIngredientProps.protein,
        quantityInGrams: 200,
      };

      const existingExternalIngredientBefore =
        externalIngredientsRefRepo.countForTesting();

      await addIngredientToRecipeUsecase.execute(request);

      const existingExternalIngredientAfter =
        externalIngredientsRefRepo.countForTesting();

      expect(existingExternalIngredientAfter).toBe(
        existingExternalIngredientBefore + 1,
      );
    });

    it('should create new ingredient if it did not exist', async () => {
      const request = {
        recipeId: testRecipe.id,
        userId: userTestProps.userId,
        externalIngredientId: 'non-existent-new-external-ingredient-id',
        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,
        name: 'Brand New Ingredient',
        caloriesPer100g: 50,
        proteinPer100g: 5,
        quantityInGrams: 300,
      };

      const existingIngredientsBefore = ingredientsRepo.countForTesting();

      await addIngredientToRecipeUsecase.execute(request);

      const existingIngredientsAfter = ingredientsRepo.countForTesting();

      expect(existingIngredientsAfter).toBe(existingIngredientsBefore + 1);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when recipe does not exist', async () => {
      const request = {
        recipeId: 'non-existent-id',
        userId: userTestProps.userId,
        externalIngredientId: newExternalIngredientRef.externalId,
        name: ingredientTestProps.validIngredientProps.name,
        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,
        caloriesPer100g: ingredientTestProps.validIngredientProps.calories,
        proteinPer100g: ingredientTestProps.validIngredientProps.protein,
        quantityInGrams: 150,
      };

      await expect(
        addIngredientToRecipeUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        addIngredientToRecipeUsecase.execute(request),
      ).rejects.toThrow(/AddIngredientToRecipeUsecase.*Recipe.*not.*found/);
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        recipeId: 'some-id',
        userId: 'non-existent',
        externalIngredientId: newExternalIngredientRef.externalId,
        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,
        name: ingredientTestProps.validIngredientProps.name,
        caloriesPer100g: ingredientTestProps.validIngredientProps.calories,
        proteinPer100g: ingredientTestProps.validIngredientProps.protein,
        quantityInGrams: 100,
      };

      await expect(
        addIngredientToRecipeUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);
      await expect(
        addIngredientToRecipeUsecase.execute(request),
      ).rejects.toThrow(/AddIngredientToRecipeUsecase.*user.*not.*found/);
    });

    it("should throw error when trying to add ingredient another user's recipe", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        recipeId: testRecipe.id,
        userId: anotherUser.id,
        externalIngredientId: newExternalIngredientRef.externalId,
        source:
          externalIngredientRefTestProps.validExternalIngredientRefProps.source,
        name: ingredientTestProps.validIngredientProps.name,
        caloriesPer100g: ingredientTestProps.validIngredientProps.calories,
        proteinPer100g: ingredientTestProps.validIngredientProps.protein,
        quantityInGrams: 150,
      };

      await expect(
        addIngredientToRecipeUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        addIngredientToRecipeUsecase.execute(request),
      ).rejects.toThrow(/AddIngredientToRecipeUsecase.*Recipe.*not.*found/);
    });
  });
});
