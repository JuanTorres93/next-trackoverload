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
import { MongoExternalIngredientsRefRepo } from '@/infra/repos/mongo/MongoExternalIngredientsRefRepo';
import { MongoIngredientsRepo } from '@/infra/repos/mongo/MongoIngredientsRepo';
import { MongoRecipesRepo } from '@/infra/repos/mongo/MongoRecipesRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import { beforeEach, describe } from 'vitest';
import * as externalIngredientRefTestProps from '../../../../../../tests/createProps/externalIngredientRefTestProps';
import * as ingredientTestProps from '../../../../../../tests/createProps/ingredientTestProps';
import * as recipeTestProps from '../../../../../../tests/createProps/recipeTestProps';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { AddIngredientToRecipeUsecase } from '../AddIngredientToRecipe.usecase';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';

describe('AddIngredientToRecipeUsecase', () => {
  let recipesRepo: MongoRecipesRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let usersRepo: MongoUsersRepo;
  let externalIngredientsRefRepo: MongoExternalIngredientsRefRepo;

  let addIngredientToRecipeUsecase: AddIngredientToRecipeUsecase;
  let testRecipe: Recipe;
  let user: User;

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    recipesRepo = new MongoRecipesRepo();
    ingredientsRepo = new MongoIngredientsRepo();
    usersRepo = new MongoUsersRepo();
    externalIngredientsRefRepo = new MongoExternalIngredientsRefRepo();

    addIngredientToRecipeUsecase = new AddIngredientToRecipeUsecase(
      recipesRepo,
      ingredientsRepo,
      usersRepo,
      externalIngredientsRefRepo,
      new Uuidv4IdGenerator(),
      new MongoTransactionContext(),
    );

    user = User.create({
      ...userTestProps.validUserProps,
    });

    await usersRepo.saveUser(user);

    // Create ingredient for initial recipe
    const testExternalIngredientRef = ExternalIngredientRef.create({
      ...externalIngredientRefTestProps.validExternalIngredientRefProps,
    });

    const testIngredient = Ingredient.create({
      ...ingredientTestProps.validIngredientProps,
    });

    await ingredientsRepo.saveIngredient(testIngredient);
    await externalIngredientsRefRepo.save(testExternalIngredientRef);

    const testIngredientLine = IngredientLine.create({
      ...recipeTestProps.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    testRecipe = Recipe.create({
      ...recipeTestProps.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });
    await recipesRepo.saveRecipe(testRecipe);

    initialExpectations = async () => {
      const allRecipes = await recipesRepo.getAllRecipes();
      expect(allRecipes).toHaveLength(1);

      expect(allRecipes[0].ingredientLines).toHaveLength(1);
      const allIngredients = await ingredientsRepo.getAllIngredients();
      expect(allIngredients).toHaveLength(1);

      const allExternalIngredientRefs =
        await externalIngredientsRefRepo.getAllExternalIngredientsRef();
      expect(allExternalIngredientRefs).toHaveLength(1);
    };
  });

  afterAll(async () => {
    await teardownMongoTestDB();
  });

  describe('Transactions', () => {
    it('should rollback if save external ingredient ref fails', async () => {
      await initialExpectations();

      mockForThrowingError(externalIngredientsRefRepo, 'save');

      await expect(
        addIngredientToRecipeUsecase.execute({
          recipeId: testRecipe.id,
          userId: user.id,
          externalIngredientId: 'new-external-id',
          source: 'openfoodfacts',
          name: 'New Ingredient',
          caloriesPer100g: 200,
          proteinPer100g: 10,
          quantityInGrams: 100,
        }),
      ).rejects.toThrow('Mocked error in save');

      await initialExpectations();
    });

    it('should rollback if saveIngredient fails', async () => {
      await initialExpectations();

      mockForThrowingError(ingredientsRepo, 'saveIngredient');

      await expect(
        addIngredientToRecipeUsecase.execute({
          recipeId: testRecipe.id,
          userId: user.id,
          externalIngredientId: 'new-external-id',
          source: 'openfoodfacts',
          name: 'New Ingredient',
          caloriesPer100g: 200,
          proteinPer100g: 10,
          quantityInGrams: 100,
        }),
      ).rejects.toThrow('Mocked error in saveIngredient');

      await initialExpectations();
    });

    it('should rollback if saveRecipe fails', async () => {
      await initialExpectations();

      mockForThrowingError(recipesRepo, 'saveRecipe');

      await expect(
        addIngredientToRecipeUsecase.execute({
          recipeId: testRecipe.id,
          userId: user.id,
          externalIngredientId: 'new-external-id',
          source: 'openfoodfacts',
          name: 'New Ingredient',
          caloriesPer100g: 200,
          proteinPer100g: 10,
          quantityInGrams: 100,
        }),
      ).rejects.toThrow('Mocked error in saveRecipe');

      await initialExpectations();
    });
  });
});
