import * as vp from '@/../tests/createProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import * as dto from '@/../tests/dtoProperties';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Meal } from '@/domain/entities/meal/Meal';
import { User } from '@/domain/entities/user/User';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';
import { MemoryMealsRepo } from '@/infra/repos/memory/MemoryMealsRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import {
  AddIngredientToMealUsecase,
  AddIngredientToMealUsecaseRequest,
} from '../AddIngredientToMeal.usecase';

describe('AddIngredientToMealUsecase', () => {
  let mealsRepo: MemoryMealsRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let usersRepo: MemoryUsersRepo;
  let addIngredientToMealUsecase: AddIngredientToMealUsecase;
  let user: User;
  let testMeal: Meal;
  let newIngredientLineInfo: Omit<
    AddIngredientToMealUsecaseRequest,
    'mealId' | 'userId'
  >;

  beforeEach(async () => {
    mealsRepo = new MemoryMealsRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    usersRepo = new MemoryUsersRepo();
    addIngredientToMealUsecase = new AddIngredientToMealUsecase(
      mealsRepo,
      ingredientsRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
    );

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await usersRepo.saveUser(user);

    const testIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
      name: 'Chicken Breast',
      calories: 165,
      protein: 31,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
      quantityInGrams: 200,
    });

    testMeal = Meal.create({
      ...vp.mealPropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });
    await mealsRepo.saveMeal(testMeal);

    const newIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
      id: 'ing-new',
      name: 'Rice',
      calories: 130,
      protein: 2.7,
    });

    await ingredientsRepo.saveIngredient(newIngredient);

    newIngredientLineInfo = {
      ingredientId: newIngredient.id,
      quantityInGrams: 150,
    };
  });

  describe('Addition', () => {
    it('should add ingredient to meal successfully', async () => {
      const originalIngredientCount = testMeal.ingredientLines.length;

      const request = {
        mealId: testMeal.id,
        userId: userTestProps.userId,
        ...newIngredientLineInfo,
      };

      const result = await addIngredientToMealUsecase.execute(request);

      expect(result.ingredientLines).toHaveLength(originalIngredientCount + 1);

      const ingredientIds = result.ingredientLines.map(
        (line) => line.ingredient.id,
      );
      expect(ingredientIds).toContain(newIngredientLineInfo.ingredientId);
    });

    it('should save updated meal in repo', async () => {
      const originalIngredientCount = testMeal.ingredientLines.length;

      const request = {
        mealId: testMeal.id,
        userId: userTestProps.userId,
        ...newIngredientLineInfo,
      };

      await addIngredientToMealUsecase.execute(request);

      const savedMeal = await mealsRepo.getMealById(testMeal.id);
      expect(savedMeal).toBeDefined();
      expect(savedMeal!.ingredientLines).toHaveLength(
        originalIngredientCount + 1,
      );
    });

    it('should return MealDTO', async () => {
      const request = {
        mealId: testMeal.id,
        userId: userTestProps.userId,
        ...newIngredientLineInfo,
      };

      const result = await addIngredientToMealUsecase.execute(request);

      expect(result).not.toBeInstanceOf(Meal);

      for (const prop of dto.mealDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it("should update meal's updatedAt timestamp", async () => {
      const originalUpdatedAt = testMeal.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 2));

      const request = {
        userId: userTestProps.userId,
        mealId: testMeal.id,
        ...newIngredientLineInfo,
      };

      const result = await addIngredientToMealUsecase.execute(request);

      expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime(),
      );
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when meal does not exist', async () => {
      const request = {
        mealId: 'non-existent-id',
        userId: userTestProps.userId,
        ...newIngredientLineInfo,
      };

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        /AddIngredientToMealUsecase.*Meal.*not.*found/,
      );
    });

    it("should throw error when adding ingredient to another user's meal", async () => {
      const anotherUser = User.create({
        ...userTestProps.validUserProps,
        id: 'another-user-id',
      });
      await usersRepo.saveUser(anotherUser);

      const request = {
        userId: 'another-user-id',
        mealId: testMeal.id,
        ...newIngredientLineInfo,
      };

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        /AddIngredientToMealUsecase.*Meal.*not.*found/,
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        userId: 'non-existent',
        mealId: 'some-id',
        ingredientId: 'some-ingredient-id',
        quantityInGrams: 100,
      };

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );
      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        /AddIngredientToMealUsecase.*user.*not.*found/,
      );
    });

    it('should throw NotFoundError when ingredient does not exist', async () => {
      const request = {
        mealId: testMeal.id,
        userId: userTestProps.userId,
        ingredientId: 'non-existent-ingredient-id',
        quantityInGrams: 100,
      };

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        NotFoundError,
      );

      await expect(addIngredientToMealUsecase.execute(request)).rejects.toThrow(
        /AddIngredientToMealUsecase.*Ingredient.*not.*found/,
      );
    });
  });
});
