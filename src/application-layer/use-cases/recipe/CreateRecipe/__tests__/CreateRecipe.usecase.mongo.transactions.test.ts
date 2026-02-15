import { User } from '@/domain/entities/user/User';
import { mockForThrowingError } from '@/infra/repos/mongo/__tests__/mockForThrowingError';
import {
  clearMongoTestDB,
  setupMongoTestDB,
  teardownMongoTestDB,
} from '@/infra/repos/mongo/__tests__/setupMongoTestDB';
import { MongoExternalIngredientsRefRepo } from '@/infra/repos/mongo/MongoExternalIngredientsRefRepo';
import { MemoryImagesRepo } from '@/infra/repos/memory/MemoryImagesRepo';
import { MongoIngredientsRepo } from '@/infra/repos/mongo/MongoIngredientsRepo';
import { MongoRecipesRepo } from '@/infra/repos/mongo/MongoRecipesRepo';
import { MongoUsersRepo } from '@/infra/repos/mongo/MongoUsersRepo';
import { SharpServerImageProcessor } from '@/infra/services/ImageProcessor/ServerImageProcessor/SharpServerImageProcessor/SharpServerImageProcessor';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { MongoTransactionContext } from '@/infra/transaction-context/MongoTransactionContext/MongoTransactionContext';
import { beforeEach, describe } from 'vitest';
import * as userTestProps from '../../../../../../tests/createProps/userTestProps';
import { CreateIngredientLineData } from '../../common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';
import { CreateRecipeUsecase } from '../CreateRecipe.usecase';

describe('CreateRecipeUsecase', () => {
  let recipesRepo: MongoRecipesRepo;
  let ingredientsRepo: MongoIngredientsRepo;
  let externalIngredientsRefRepo: MongoExternalIngredientsRefRepo;
  let imagesRepo: MemoryImagesRepo;
  let imageProcessor: SharpServerImageProcessor;
  let usersRepo: MongoUsersRepo;

  let createRecipeUsecase: CreateRecipeUsecase;
  let user: User;
  let testIngredientLineInfo: CreateIngredientLineData;

  let initialExpectations: () => Promise<void>;

  beforeAll(async () => {
    await setupMongoTestDB();
  });

  beforeEach(async () => {
    await clearMongoTestDB();

    recipesRepo = new MongoRecipesRepo();
    ingredientsRepo = new MongoIngredientsRepo();
    externalIngredientsRefRepo = new MongoExternalIngredientsRefRepo();
    imagesRepo = new MemoryImagesRepo();
    imageProcessor = new SharpServerImageProcessor();
    usersRepo = new MongoUsersRepo();

    createRecipeUsecase = new CreateRecipeUsecase(
      recipesRepo,
      ingredientsRepo,
      imagesRepo,
      usersRepo,
      new Uuidv4IdGenerator(),
      externalIngredientsRefRepo,
      imageProcessor,
      new MongoTransactionContext(),
    );

    user = userTestProps.createTestUser();

    await usersRepo.saveUser(user);

    testIngredientLineInfo = {
      externalIngredientId: 'external-id-1',
      source: 'openfoodfacts',
      name: 'Chicken Breast',
      caloriesPer100g: 165,
      proteinPer100g: 31,
      quantityInGrams: 200,
    };

    initialExpectations = async () => {
      const allRecipes = await recipesRepo.getAllRecipes();
      expect(allRecipes).toHaveLength(0);

      const allIngredients = await ingredientsRepo.getAllIngredients();
      expect(allIngredients).toHaveLength(0);

      const allExternalIngredientRefs =
        await externalIngredientsRefRepo.getAllExternalIngredientsRef();
      expect(allExternalIngredientRefs).toHaveLength(0);
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
        createRecipeUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
          name: 'Grilled Chicken',
          ingredientLinesInfo: [testIngredientLineInfo],
        }),
      ).rejects.toThrow('Mocked error in save');

      await initialExpectations();
    });

    it('should rollback if saveIngredient fails', async () => {
      await initialExpectations();

      mockForThrowingError(ingredientsRepo, 'saveIngredient');

      await expect(
        createRecipeUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
          name: 'Grilled Chicken',
          ingredientLinesInfo: [testIngredientLineInfo],
        }),
      ).rejects.toThrow('Mocked error in saveIngredient');

      await initialExpectations();
    });

    it('should rollback if saveRecipe fails', async () => {
      await initialExpectations();

      mockForThrowingError(recipesRepo, 'saveRecipe');

      await expect(
        createRecipeUsecase.execute({
          actorUserId: user.id,
          targetUserId: user.id,
          name: 'Grilled Chicken',
          ingredientLinesInfo: [testIngredientLineInfo],
        }),
      ).rejects.toThrow('Mocked error in saveRecipe');

      await initialExpectations();
    });
  });
});
