import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MemoryTransactionContext } from '@/infra/transaction-context/MemoryTransactionContext/MemoryTransactionContext';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { AddMultipleMealsToDayUsecase } from '../AddMultipleMealsToDay.usecase';

describe('AddMultipleMealsToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let recipesRepo: MemoryRecipesRepo;

  let addMultipleMealsToDayUsecase: AddMultipleMealsToDayUsecase;

  let day: Day;
  let recipe1: Recipe;
  let recipe2: Recipe;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    recipesRepo = new MemoryRecipesRepo();

    addMultipleMealsToDayUsecase = new AddMultipleMealsToDayUsecase(
      daysRepo,
      mealsRepo,
      usersRepo,
      recipesRepo,
      new Uuidv4IdGenerator(),
      new MemoryTransactionContext(),
    );

    user = userTestProps.createTestUser();

    recipe1 = recipeTestProps.createTestRecipe({ id: 'recipe1' }, 1);
    recipe2 = recipeTestProps.createTestRecipe({ id: 'recipe2' }, 2);

    day = dayTestProps.createEmptyTestDay();

    await daysRepo.saveDay(day);
    await usersRepo.saveUser(user);
    await recipesRepo.saveRecipe(recipe1);
    await recipesRepo.saveRecipe(recipe2);
  });

  describe('Addition', () => {
    it('should add multiple meals to existing day', async () => {
      const result = await addMultipleMealsToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      expect(result.mealIds).toHaveLength(2);
      expect(result.id).toBe(day.id);
    });

    it('should add a single meal when only one recipeId is provided', async () => {
      const result = await addMultipleMealsToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeIds: [recipe1.id],
      });

      expect(result.mealIds).toHaveLength(1);
      expect(result.id).toBe(day.id);
    });

    it('should return DayDTO', async () => {
      const result = await addMultipleMealsToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('meal ids should be different from recipe ids', async () => {
      const result = await addMultipleMealsToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      expect(result.mealIds[0]).not.toBe(recipe1.id);
      expect(result.mealIds[1]).not.toBe(recipe2.id);
    });
  });

  describe('Side effects', () => {
    it('should create new meals in the repo for each recipe', async () => {
      const initialMeals = await mealsRepo.getAllMeals();
      expect(initialMeals.length).toBe(0);

      await addMultipleMealsToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals.length).toBe(2);
    });

    it('should create independent ingredient lines from each recipe', async () => {
      const originalRecipe1Line = [...recipe1.ingredientLines][0];

      const result = await addMultipleMealsToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      const addedMeal1 = await mealsRepo.getMealById(result.mealIds[0]);

      expect(addedMeal1!.ingredientLines).toHaveLength(
        recipe1.ingredientLines.length,
      );

      const addedLine = addedMeal1!.ingredientLines[0];

      expect(addedLine.id).not.toBe(originalRecipe1Line.id);
      expect(addedLine.parentId).not.toBe(originalRecipe1Line.parentId);
      expect(addedLine.parentType).toBe('meal');
      expect(addedLine.ingredient.id).toBe(originalRecipe1Line.ingredient.id);
      expect(addedLine.quantityInGrams).toBe(
        originalRecipe1Line.quantityInGrams,
      );
    });

    it('created meals should share their respective recipe images', async () => {
      const existingRecipe1 = await recipesRepo.getRecipeById(recipe1.id);

      existingRecipe1!.updateImageUrl('http://example.com/image1.jpg');

      await recipesRepo.saveRecipe(existingRecipe1!);

      const result = await addMultipleMealsToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      const addedMeal1 = await mealsRepo.getMealById(result.mealIds[0]);
      expect(addedMeal1!.imageUrl).toBe(existingRecipe1!.imageUrl);
    });

    it('should create new day if it does not exist', async () => {
      const initialDaysCount = daysRepo.countForTesting();

      await addMultipleMealsToDayUsecase.execute({
        dayId: '19990101',
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      const finalDaysCount = daysRepo.countForTesting();
      expect(finalDaysCount).toBe(initialDaysCount + 1);
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: 'non-existent-user',
        recipeIds: [recipe1.id, recipe2.id],
      };

      await expect(
        addMultipleMealsToDayUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        addMultipleMealsToDayUsecase.execute(request),
      ).rejects.toThrow(/AddMultipleMealsToDayUsecase.*user.*not.*found/);
    });

    it('should throw error if any recipe does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, 'non-existent-recipe'],
      };

      await expect(
        addMultipleMealsToDayUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      await expect(
        addMultipleMealsToDayUsecase.execute(request),
      ).rejects.toThrow(/AddMultipleMealsToDayUsecase.*Recipe.*not.*found/);
    });

    it('should not create any meals if one recipe is missing', async () => {
      const request = {
        dayId: day.id,
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, 'non-existent-recipe'],
      };

      await expect(
        addMultipleMealsToDayUsecase.execute(request),
      ).rejects.toThrow(NotFoundError);

      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals.length).toBe(0);
    });
  });
});
