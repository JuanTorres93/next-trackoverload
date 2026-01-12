import { NotFoundError } from '@/domain/common/errors';
import { Meal } from '@/domain/entities/meal/Meal';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { MemoryImagesRepo } from '@/infra/repos/memory/MemoryImagesRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { CreateMealFromRecipeUsecase } from '../CreateMealFromRecipeUsecase';

import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { User } from '@/domain/entities/user/User';
import {
  createFakeMetadata,
  createTestImage,
} from '../../../../../../tests/helpers/imageTestHelpers';

describe('CreateMealFromRecipeUsecase', () => {
  let recipe: Recipe;

  let usersRepo: MemoryUsersRepo;
  let mealsRepo: MemoryMealsRepo;
  let recipesRepo: MemoryRecipesRepo;
  let imagesRepo: MemoryImagesRepo;
  let idGenerator: Uuidv4IdGenerator;

  let usecase: CreateMealFromRecipeUsecase;

  beforeEach(async () => {
    usersRepo = new MemoryUsersRepo();
    mealsRepo = new MemoryMealsRepo();
    recipesRepo = new MemoryRecipesRepo();
    imagesRepo = new MemoryImagesRepo();
    idGenerator = new Uuidv4IdGenerator();

    usecase = new CreateMealFromRecipeUsecase(
      usersRepo,
      recipesRepo,
      mealsRepo,
      imagesRepo,
      idGenerator
    );

    const user = User.create(vp.validUserProps);
    await usersRepo.saveUser(user);

    recipe = Recipe.create(vp.validRecipePropsWithIngredientLines());

    await recipesRepo.saveRecipe(recipe);
  });

  describe('Execution', () => {
    it('should return MealDTO', async () => {
      const result = await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
      });

      expect(result).not.toBeInstanceOf(Meal);
      for (const prop of dto.mealDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should create different meal lines but with same info as recipe lines', async () => {
      const recipeLinesIds = recipe.ingredientLines.map((line) => line.id);

      const result = await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
      });

      const createdMealLinesIds = result.ingredientLines.map((line) => line.id);

      for (const mealLine of createdMealLinesIds) {
        expect(recipeLinesIds).not.toContain(mealLine);
      }
    });
  });

  describe('Side effects', () => {
    it('should save meal to repo', async () => {
      const mealsBefore = mealsRepo.countForTesting();

      expect(mealsBefore).toBe(0);

      await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
      });

      const mealsAfter = mealsRepo.countForTesting();

      expect(mealsAfter).toBe(1);
    });

    it('should create new image if recipe has image and no previous meal has been created from recipe', async () => {
      const testImage = await createTestImage();
      const metadata = createFakeMetadata();
      imagesRepo.save({
        buffer: testImage,
        metadata,
      });
      recipe.updateImageUrl(metadata.url);
      await recipesRepo.saveRecipe(recipe);

      const imagesBefore = imagesRepo.countForTesting();

      expect(imagesBefore).toBe(1);

      await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
      });

      const imagesAfter = imagesRepo.countForTesting();

      expect(imagesAfter).toBe(2);
    });

    it('should reuse image if recipe has image and previous meal has been created from recipe', async () => {
      const testImage = await createTestImage();
      const metadata = createFakeMetadata();
      imagesRepo.save({
        buffer: testImage,
        metadata,
      });
      recipe.updateImageUrl(metadata.url);
      await recipesRepo.saveRecipe(recipe);

      // First meal creation
      await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
      });

      const imagesAfterFirstMeal = imagesRepo.countForTesting();

      expect(imagesAfterFirstMeal).toBe(2);

      // Second meal creation
      await usecase.execute({
        recipeId: recipe.id,
        userId: vp.userId,
      });

      const imagesAfterSecondMeal = imagesRepo.countForTesting();

      expect(imagesAfterSecondMeal).toBe(2);
    });
  });

  describe('Errors', () => {
    it('should throw error if recipe does not exist', async () => {
      const request = {
        recipeId: 'non-existent-recipe-id',
        userId: vp.userId,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateMealFromRecipeUsecase: Recipe.*not found/
      );
    });

    it('should throw error if recipe does not belong to user', async () => {
      const otherUser = User.create({
        ...vp.validUserProps,
        id: 'other-user-id',
      });
      await usersRepo.saveUser(otherUser);

      const request = {
        recipeId: recipe.id,
        userId: otherUser.id,
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateMealFromRecipeUsecase: Recipe.*not found/
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        recipeId: recipe.id,
        userId: 'non-existent-user-id',
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /CreateMealFromRecipeUsecase: User.*not found/
      );
    });
  });
});
