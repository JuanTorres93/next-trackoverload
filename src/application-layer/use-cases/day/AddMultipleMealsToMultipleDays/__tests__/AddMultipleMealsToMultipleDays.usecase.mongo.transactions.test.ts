import { Day } from '@/domain/entities/day/Day';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { mockForThrowingError } from '@/infra/repos/mongo/__tests__/mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from '@/infra/repos/mongo/__tests__/setupMongoTestDB';
import { MongoDaysRepo } from '@/infra/repos/mongo/MongoDaysRepo';
import { MongoIngredientsRepo } from '@/infra/repos/mongo/MongoIngredientsRepo';
import { MongoMealsRepo } from '@/infra/repos/mongo/MongoMealsRepo';
import { MongoRecipesRepo } from '@/infra/repos/mongo/MongoRecipesRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import * as dayTestProps from '../../../../../../tests/createProps/dayTestProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { AddMultipleMealsToMultipleDaysUsecase } from '../AddMultipleMealsToMultipleDays.usecase';

describe('AddMultipleMealsToMultipleDaysUsecase', () => {
  let daysRepo: MongoDaysRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let mealsRepo: MongoMealsRepo;
  let usersRepo: MongoUsersRepo;
  let recipesRepo: MongoRecipesRepo;

  let usecase: AddMultipleMealsToMultipleDaysUsecase;

  let day1: Day;
  let day2: Day;
  let ingredient: Ingredient;
  let recipe: Recipe;
  let user: User;

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    daysRepo = new MongoDaysRepo();
    ingredientsRepo = new MongoIngredientsRepo();
    mealsRepo = new MongoMealsRepo();
    usersRepo = new MongoUsersRepo();
    recipesRepo = new MongoRecipesRepo();

    usecase = new AddMultipleMealsToMultipleDaysUsecase(
      daysRepo,
      mealsRepo,
      usersRepo,
      recipesRepo,
      new Uuidv4IdGenerator(),
      new MongoTransactionContext(),
    );

    day1 = dayTestProps.createEmptyTestDay({ day: 1 });
    day2 = dayTestProps.createEmptyTestDay({ day: 2 });
    ingredient = ingredientTestProps.createTestIngredient();
    recipe = recipeTestProps.createTestRecipe();
    user = userTestProps.createTestUser();

    await daysRepo.saveDay(day1);
    await daysRepo.saveDay(day2);
    await usersRepo.saveUser(user);
    await ingredientsRepo.saveIngredient(ingredient);
    await recipesRepo.saveRecipe(recipe);

    initialExpectations = async () => {
      const allMeals = await mealsRepo.getAllMeals();
      expect(allMeals).toHaveLength(0);

      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(2);
      expect(allDays.every((d) => d.mealIds.length === 0)).toBe(true);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback all changes if saving meals fails', async () => {
      await initialExpectations();

      mockForThrowingError(mealsRepo, 'saveMultipleMeals');

      await expect(() =>
        usecase.execute({
          dayIds: [day1.id, day2.id],
          userId: user.id,
          recipeIds: [recipe.id],
        }),
      ).rejects.toThrow('Mocked error in saveMultipleMeals');

      await initialExpectations();
    });

    it('should rollback all changes if saving days fails', async () => {
      await initialExpectations();

      mockForThrowingError(daysRepo, 'saveMultipleDays');

      await expect(() =>
        usecase.execute({
          dayIds: [day1.id, day2.id],
          userId: user.id,
          recipeIds: [recipe.id],
        }),
      ).rejects.toThrow('Mocked error in saveMultipleDays');

      await initialExpectations();
    });
  });
});
