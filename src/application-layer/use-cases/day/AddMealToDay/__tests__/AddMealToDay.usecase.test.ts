import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Day } from '@/domain/entities/day/Day';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryDaysRepo } from '@/infra/repos/memory/MemoryDaysRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { AddMealToDayUsecase } from '../AddMealToDay.usecase';

describe('AddMealToDayUsecase', () => {
  let daysRepo: MemoryDaysRepo;
  let mealsRepo: MemoryMealsRepo;
  let usersRepo: MemoryUsersRepo;
  let recipesRepo: MemoryRecipesRepo;

  let addMealToDayUsecase: AddMealToDayUsecase;

  let day: Day;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
  let recipe: Recipe;
  let user: User;

  beforeEach(async () => {
    daysRepo = new MemoryDaysRepo();
    mealsRepo = new MemoryMealsRepo();
    usersRepo = new MemoryUsersRepo();
    recipesRepo = new MemoryRecipesRepo();
    addMealToDayUsecase = new AddMealToDayUsecase(
      daysRepo,
      mealsRepo,
      usersRepo,
      recipesRepo,
      new Uuidv4IdGenerator(),
    );
    day = Day.create({
      ...dayTestProps.validDayProps(),
    });
    ingredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
    });
    ingredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient,
    });

    recipe = Recipe.create({
      ...recipeTestProps.recipePropsNoIngredientLines,
      ingredientLines: [ingredientLine],
    });

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await daysRepo.saveDay(day);
    await usersRepo.saveUser(user);
    await recipesRepo.saveRecipe(recipe);
  });

  describe('Addition', () => {
    it('should add meal to existing day', async () => {
      const result = await addMealToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeId: recipe.id,
      });

      expect(result.mealIds).toHaveLength(1);

      expect(result.id).not.toBeUndefined();
      expect(result.id).not.toBe(recipe.id);
      expect(result.id).toBe(day.id);
    });

    it('should return DayDTO', async () => {
      const result = await addMealToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeId: recipe.id,
      });

      expect(result).not.toBeInstanceOf(Day);
      for (const prop of dto.dayDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });
  });

  describe('Side effects', () => {
    it('should create new independent ingredient lines from recipe', async () => {
      const result = await addMealToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeId: recipe.id,
      });

      const addedMeal = await mealsRepo.getMealById(result.mealIds[0]);

      expect(addedMeal!.ingredientLines).toHaveLength(
        recipe.ingredientLines.length,
      );
      expect(addedMeal!.ingredientLines).toHaveLength(1);

      const addedIngredientLine = addedMeal!.ingredientLines[0];

      expect(addedIngredientLine.id).not.toBe(ingredientLine.id);
      expect(addedIngredientLine.parentId).not.toBe(ingredientLine.parentId);
      expect(addedIngredientLine.parentType).toBe('meal');
      expect(addedIngredientLine.ingredient.id).toBe(
        ingredientLine.ingredient.id,
      );
      expect(addedIngredientLine.quantityInGrams).toBe(
        ingredientLine.quantityInGrams,
      );
      expect(addedIngredientLine.calories).toBe(ingredientLine.calories);
      expect(addedIngredientLine.protein).toBe(ingredientLine.protein);
    });

    it('should create new meal', async () => {
      const initialMeals = await mealsRepo.getAllMeals();
      expect(initialMeals.length).toBe(0);

      await addMealToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeId: recipe.id,
      });

      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals.length).toBe(1);
    });

    it('created meal should share recipe image', async () => {
      const existingRecipe = await recipesRepo.getRecipeById(recipe.id);

      existingRecipe!.updateImageUrl('http://example.com/image.jpg');

      await recipesRepo.saveRecipe(existingRecipe!);

      const result = await addMealToDayUsecase.execute({
        dayId: day.id,
        userId: userTestProps.userId,
        recipeId: recipe.id,
      });

      const addedMeal = await mealsRepo.getMealById(result.mealIds[0]);

      expect(addedMeal!.imageUrl).toBeDefined();
      expect(addedMeal!.imageUrl).toBe(existingRecipe!.imageUrl);
    });

    it('should create new day if it does not exist', async () => {
      const initialDaysCount = daysRepo.countForTesting();

      await addMealToDayUsecase.execute({
        dayId: '19990101',
        userId: userTestProps.userId,
        recipeId: recipe.id,
      });

      const finalDaysCount = daysRepo.countForTesting();

      expect(finalDaysCount).toBe(initialDaysCount + 1);
    });
  });

  describe('Errors', () => {
    it('should throw error if user does not exist', async () => {
      const date = '20231001';
      const nonExistentUserId = 'non-existent-user';

      const request = {
        dayId: date,
        userId: nonExistentUserId,
        recipeId: recipe.id,
      };

      await expect(addMealToDayUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(addMealToDayUsecase.execute(request)).rejects.toThrow(
        /AddMealToDayUsecase.*user.*not.*found/,
      );
    });

    it('should throw error if recipe does not exist', async () => {
      const request = {
        dayId: day.id,
        userId: userTestProps.userId,
        recipeId: 'non-existent-recipe',
      };

      await expect(addMealToDayUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(addMealToDayUsecase.execute(request)).rejects.toThrow(
        /AddMealToDayUsecase.*Recipe.*not.*found/,
      );
    });
  });
});
