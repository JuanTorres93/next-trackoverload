import * as dto from '@/../tests/dtoProperties';
import { NotFoundError, ValidationError } from '@/domain/common/errors';
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
import { AddMultipleMealsToMultipleDaysUsecase } from '../AddMultipleMealsToMultipleDays.usecase';

describe('AddMultipleMealsToMultipleDaysUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let recipesRepo: MemoryRecipesRepo;

  let usecase: AddMultipleMealsToMultipleDaysUsecase;

  let day1: Day;
  let day2: Day;
  let recipe1: Recipe;
  let recipe2: Recipe;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    recipesRepo = new MemoryRecipesRepo();

    usecase = new AddMultipleMealsToMultipleDaysUsecase(
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
    day1 = dayTestProps.createEmptyTestDay({ day: 1 });
    day2 = dayTestProps.createEmptyTestDay({ day: 2 });

    await usersRepo.saveUser(user);
    await recipesRepo.saveRecipe(recipe1);
    await recipesRepo.saveRecipe(recipe2);
    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);
  });

  describe('Addition', () => {
    it('should add multiple meals to multiple days', async () => {
      const results = await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      expect(results).toHaveLength(2);
      expect(results[0].mealIds).toHaveLength(2);
      expect(results[1].mealIds).toHaveLength(2);
    });

    it('should add meals to a single day when one dayId is provided', async () => {
      const results = await usecase.execute({
        dayIds: [day1.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      expect(results).toHaveLength(1);
      expect(results[0].mealIds).toHaveLength(2);
      expect(results[0].id).toBe(day1.id);
    });

    it('should add a single recipe as a meal to each day', async () => {
      const results = await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id],
      });

      expect(results[0].mealIds).toHaveLength(1);
      expect(results[1].mealIds).toHaveLength(1);
    });

    it('should return DayDTO[]', async () => {
      const results = await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      expect(results).not.toBeInstanceOf(Day);
      for (const result of results) {
        for (const prop of dto.dayDTOProperties) {
          expect(result).toHaveProperty(prop);
        }
      }
    });

    it('meal IDs should be different from recipe IDs', async () => {
      const results = await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      for (const result of results) {
        for (const mealId of result.mealIds) {
          expect(mealId).not.toBe(recipe1.id);
          expect(mealId).not.toBe(recipe2.id);
        }
      }
    });

    it('each day should get its own independent set of meals', async () => {
      const results = await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id],
      });

      const day1MealIds = results[0].mealIds;
      const day2MealIds = results[1].mealIds;

      // Meals are distinct across days
      expect(day1MealIds[0]).not.toBe(day2MealIds[0]);
    });
  });

  describe('Side effects', () => {
    it('should create meals in the repo for each day-recipe combination', async () => {
      const initialMeals = await mealsRepo.getAllMeals();
      expect(initialMeals.length).toBe(0);

      await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      const allMeals = await mealsRepo.getAllMeals();
      // 2 days × 2 recipes = 4 meals
      expect(allMeals.length).toBe(4);
    });

    it('should create independent ingredient lines from each recipe for each day', async () => {
      const originalLine = [...recipe1.ingredientLines][0];

      const results = await usecase.execute({
        dayIds: [day1.id, day2.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, recipe2.id],
      });

      const day1Meal1 = await mealsRepo.getMealById(results[0].mealIds[0]);
      const day2Meal1 = await mealsRepo.getMealById(results[1].mealIds[0]);

      const day1Line = day1Meal1!.ingredientLines[0];
      const day2Line = day2Meal1!.ingredientLines[0];

      // Lines are independent copies
      expect(day1Line.id).not.toBe(originalLine.id);
      expect(day2Line.id).not.toBe(originalLine.id);
      expect(day1Line.id).not.toBe(day2Line.id);
      expect(day1Line.parentType).toBe('meal');
      expect(day2Line.parentType).toBe('meal');
      expect(day1Line.ingredient.id).toBe(originalLine.ingredient.id);
    });

    it('should create new days if they do not exist', async () => {
      const initialCount = daysRepo.countForTesting();

      await usecase.execute({
        dayIds: ['19990101', '19990102'],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id],
      });

      expect(daysRepo.countForTesting()).toBe(initialCount + 2);
    });

    it('should create a new day only for non-existent day IDs', async () => {
      const initialCount = daysRepo.countForTesting();

      await usecase.execute({
        dayIds: [day1.id, '19990115'],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id],
      });

      expect(daysRepo.countForTesting()).toBe(initialCount + 1);
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError if user does not exist', async () => {
      const request = {
        dayIds: [day1.id],
        userId: 'non-existent-user',
        recipeIds: [recipe1.id],
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /AddMultipleMealsToMultipleDaysUsecase.*user.*not.*found/,
      );
    });

    it('should throw NotFoundError if any recipe does not exist', async () => {
      const request = {
        dayIds: [day1.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, 'non-existent-recipe'],
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);
      await expect(usecase.execute(request)).rejects.toThrow(
        /AddMultipleMealsToMultipleDaysUsecase.*Recipe.*not.*found/,
      );
    });

    it('should not create any meals if one recipe is missing', async () => {
      const request = {
        dayIds: [day1.id, day2.id],
        userId: userTestProps.userId,
        recipeIds: [recipe1.id, 'non-existent-recipe'],
      };

      await expect(usecase.execute(request)).rejects.toThrow(NotFoundError);

      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals.length).toBe(0);
    });

    it(`should throw ValidationError when more than ${AddMultipleMealsToMultipleDaysUsecase.MAX_DAYS} days are provided`, async () => {
      const tooManyDayIds = Array.from(
        { length: AddMultipleMealsToMultipleDaysUsecase.MAX_DAYS + 1 },
        (_, i) => `2023100${String(i + 1).padStart(2, '0')}`,
      );

      await expect(
        usecase.execute({
          dayIds: tooManyDayIds,
          userId: userTestProps.userId,
          recipeIds: [recipe1.id],
        }),
      ).rejects.toThrow(ValidationError);

      await expect(
        usecase.execute({
          dayIds: tooManyDayIds,
          userId: userTestProps.userId,
          recipeIds: [recipe1.id],
        }),
      ).rejects.toThrow(/cannot process more than.*days/i);
    });

    it(`should allow exactly ${AddMultipleMealsToMultipleDaysUsecase.MAX_DAYS} days`, async () => {
      const maxDayIds = Array.from(
        { length: AddMultipleMealsToMultipleDaysUsecase.MAX_DAYS },
        (_, i) => `1999${String(i + 1).padStart(4, '01')}`,
      );

      await expect(
        usecase.execute({
          dayIds: maxDayIds,
          userId: userTestProps.userId,
          recipeIds: [recipe1.id],
        }),
      ).resolves.toHaveLength(AddMultipleMealsToMultipleDaysUsecase.MAX_DAYS);
    });
  });
});
