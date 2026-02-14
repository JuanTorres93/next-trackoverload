import { Day } from '@/domain/entities/day/Day';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
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
import { AddMealToDayUsecase } from '../AddMealToDay.usecase';

describe('AddMealToDayUsecase', () => {
  let daysRepo: MongoDaysRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let mealsRepo: MongoMealsRepo;
  let usersRepo: MongoUsersRepo;
  let recipesRepo: MongoRecipesRepo;

  let addMealToDayUsecase: AddMealToDayUsecase;

  let day: Day;
  let ingredient: Ingredient;
  let ingredientLine: IngredientLine;
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

    addMealToDayUsecase = new AddMealToDayUsecase(
      daysRepo,
      mealsRepo,
      usersRepo,
      recipesRepo,
      new Uuidv4IdGenerator(),
      new MongoTransactionContext(),
    );
    day = Day.create({
      ...dayTestProps.validDayProps(),
    });

    ingredient = ingredientTestProps.createTestIngredient();

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
    await ingredientsRepo.saveIngredient(ingredient);
    await recipesRepo.saveRecipe(recipe);

    initialExpectations = async () => {
      const allMealsBefore = await mealsRepo.getAllMeals();
      expect(allMealsBefore).toHaveLength(0);
      expect(day.mealIds).toHaveLength(0);

      const allDays = await daysRepo.getAllDays();
      expect(allDays).toHaveLength(1);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback if saving meal fails', async () => {
      await initialExpectations();

      mockForThrowingError(mealsRepo, 'saveMeal');

      await expect(() =>
        addMealToDayUsecase.execute({
          dayId: day.id,
          userId: user.id,
          recipeId: recipe.id,
        }),
      ).rejects.toThrow('Mocked error in saveMeal');

      await initialExpectations();
    });

    it('should rollback if saving day fails', async () => {
      await initialExpectations();

      mockForThrowingError(daysRepo, 'saveDay');

      await expect(() =>
        addMealToDayUsecase.execute({
          dayId: day.id,
          userId: user.id,
          recipeId: recipe.id,
        }),
      ).rejects.toThrow('Mocked error in saveDay');

      await initialExpectations();
    });
  });
});
