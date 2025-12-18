import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryImageManager } from '@/infra';
import { MemoryIngredientsRepo } from '@/infra/memory/MemoryIngredientsRepo';
import { MemoryRecipesRepo } from '@/infra/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/Uuidv4IdGenerator';
import { createTestImage } from '../../../../../../tests/helpers/imageTestHelpers';
import {
  CreateRecipeUsecase,
  IngredientLineInfo,
} from '../CreateRecipe.usecase';

describe('CreateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let imageManager: MemoryImageManager;
  let usersRepo: MemoryUsersRepo;
  let createRecipeUsecase: CreateRecipeUsecase;
  let testIngredient: Ingredient;
  let testIngredientLineInfo: IngredientLineInfo;
  let user: User;

  beforeEach(async () => {
    const idGenerator = new Uuidv4IdGenerator();
    recipesRepo = new MemoryRecipesRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    imageManager = new MemoryImageManager('/memory/images', idGenerator);
    usersRepo = new MemoryUsersRepo();

    createRecipeUsecase = new CreateRecipeUsecase(
      recipesRepo,
      ingredientsRepo,
      imageManager,
      usersRepo,
      idGenerator
    );

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);

    testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
      calories: 165,
      protein: 31,
    });

    ingredientsRepo.saveIngredient(testIngredient);

    testIngredientLineInfo = {
      ingredientId: testIngredient.id,
      quantityInGrams: 200,
    };
  });

  describe('Creation', () => {
    it('should create and save a new recipe with no image', async () => {
      const request = {
        userId: vp.userId,
        name: 'Grilled Chicken',
        ingredientLinesInfo: [testIngredientLineInfo],
      };

      const recipe = await createRecipeUsecase.execute(request);

      expect(recipe).toHaveProperty('id');
      expect(recipe.userId).toBe(vp.userId);
      expect(recipe.name).toBe(request.name);
      expect(recipe.imageUrl).not.toBeDefined();
      expect(recipe.ingredientLines).toHaveLength(1);
      expect(recipe.ingredientLines[0].ingredient.id).toEqual(
        testIngredientLineInfo.ingredientId
      );
      expect(recipe).toHaveProperty('createdAt');
      expect(recipe).toHaveProperty('updatedAt');

      const savedRecipe = await recipesRepo.getRecipeById(recipe.id);

      // @ts-expect-error savedRecipe won't be null here
      expect(toRecipeDTO(savedRecipe)).toEqual(recipe);
    });

    it('should create and save a new recipe WITH image', async () => {
      const testImage = createTestImage('small');
      const request = {
        userId: vp.userId,
        name: 'Grilled Chicken',
        ingredientLinesInfo: [testIngredientLineInfo],
        imageBuffer: testImage,
      };

      const recipe = await createRecipeUsecase.execute(request);

      expect(recipe).toHaveProperty('id');
      expect(recipe.userId).toBe(vp.userId);
      expect(recipe.name).toBe(request.name);
      expect(recipe.imageUrl).toBeDefined();
      expect(recipe.ingredientLines).toHaveLength(1);
      expect(recipe.ingredientLines[0].ingredient.id).toEqual(
        testIngredientLineInfo.ingredientId
      );
      expect(recipe).toHaveProperty('createdAt');
      expect(recipe).toHaveProperty('updatedAt');

      const savedRecipe = await recipesRepo.getRecipeById(recipe.id);

      // @ts-expect-error savedRecipe won't be null here
      expect(toRecipeDTO(savedRecipe)).toEqual(recipe);
    });

    it('should save recipe ingredient lines', async () => {
      const request = {
        userId: vp.userId,
        name: 'Grilled Chicken',
        ingredientLinesInfo: [testIngredientLineInfo],
      };

      const recipe = await createRecipeUsecase.execute(request);

      for (const line of recipe.ingredientLines) {
        expect(line).not.toBeNull();
        expect(line?.id).toBe(line.id);
      }
    });

    it('should calculate correct nutritional info', async () => {
      const request = {
        userId: vp.userId,
        name: 'Test Recipe',
        ingredientLinesInfo: [testIngredientLineInfo],
      };

      const recipe = await createRecipeUsecase.execute(request);

      // 200g of chicken breast (165 cal/100g, 31g protein/100g)
      expect(recipe.calories).toBe(330); // 165 * 2
      expect(recipe.protein).toBe(62); // 31 * 2
    });

    it('should return RecipeDTO', async () => {
      const request = {
        userId: vp.userId,
        name: 'Test Recipe',
        ingredientLinesInfo: [testIngredientLineInfo],
      };

      const result = await createRecipeUsecase.execute(request);

      expect(result).not.toBeInstanceOf(Recipe);
      // Check that the result has all expected DTO properties
      for (const prop of dto.recipeDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should create recipe with multiple ingredient lines', async () => {
      // Create a second test ingredient
      const testIngredient2 = Ingredient.create({
        ...vp.validIngredientProps,
        id: 'ingredient-2',
        name: 'Rice',
        calories: 130,
        protein: 2.7,
      });

      await ingredientsRepo.saveIngredient(testIngredient2);

      const testIngredientLineInfo2 = {
        ingredientId: testIngredient2.id,
        quantityInGrams: 100,
      };

      const request = {
        userId: vp.userId,
        name: 'Chicken and Rice',
        ingredientLinesInfo: [testIngredientLineInfo, testIngredientLineInfo2],
      };

      const recipe = await createRecipeUsecase.execute(request);

      expect(recipe.ingredientLines).toHaveLength(2);

      // Verify both ingredient lines were saved
      for (const line of recipe.ingredientLines) {
        expect(line).not.toBeNull();
        expect(line?.id).toBe(line.id);
      }
    });
  });

  describe('Side effects', () => {
    it('should store an image', async () => {
      const initialImageCount = imageManager.getImageCount();

      expect(initialImageCount).toBe(0);

      const testImage = createTestImage('small');
      const request = {
        userId: vp.userId,
        name: 'Recipe with Image',
        ingredientLinesInfo: [testIngredientLineInfo],
        imageBuffer: testImage,
      };

      await createRecipeUsecase.execute(request);

      const finalImageCount = imageManager.getImageCount();
      expect(finalImageCount).toBe(1);
    });
  });

  describe('Error', () => {
    it('should throw an error if ingredientLines is empty', async () => {
      const request = {
        userId: vp.userId,
        name: 'Test Recipe',
        ingredientLinesInfo: [],
      };

      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );
    });

    it('should throw error if user does not exist', async () => {
      await expect(
        createRecipeUsecase.execute({
          userId: 'non-existent',
          name: 'Test Recipe',
          ingredientLinesInfo: [testIngredientLineInfo],
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        createRecipeUsecase.execute({
          userId: 'non-existent',
          name: 'Test Recipe',
          ingredientLinesInfo: [testIngredientLineInfo],
        })
      ).rejects.toThrow(/CreateRecipeUsecase.*user.*not.*found/);
    });

    it('should throw error if at least one ingredient does no exist', async () => {
      const invalidIngredientLineInfo = {
        ingredientId: 'non-existent-ingredient',
        quantityInGrams: 100,
      };

      const request = {
        userId: vp.userId,
        name: 'Test Recipe',
        ingredientLinesInfo: [
          testIngredientLineInfo,
          invalidIngredientLineInfo,
        ],
      };

      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        ValidationError
      );

      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        /CreateRecipeUseCase.*Ingredient.*not found/
      );
    });
  });
});
