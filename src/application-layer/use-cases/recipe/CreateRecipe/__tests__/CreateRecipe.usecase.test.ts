import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError, PermissionError } from '@/domain/common/errors';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryExternalIngredientsRefRepo } from '@/infra';
import { MemoryImagesRepo } from '@/infra/repos/memory/MemoryImagesRepo';
import { SharpImageProcessor } from '@/infra/services/ImageProcessor/SharpImageProcessor';
import { MemoryIngredientsRepo } from '@/infra/repos/memory/MemoryIngredientsRepo';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator';
import { createTestImage } from '../../../../../../tests/helpers/imageTestHelpers';
import { CreateRecipeUsecase } from '../CreateRecipe.usecase';
import { IngredientLineInfo } from '../../common/createIngredientsAndExternalIngredientsForIngredientLineNoSaveInRepo';

describe('CreateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let ingredientsRepo: MemoryIngredientsRepo;
  let externalIngredientsRefRepo: MemoryExternalIngredientsRefRepo;
  let imagesRepo: MemoryImagesRepo;
  let imageProcessor: SharpImageProcessor;
  let usersRepo: MemoryUsersRepo;
  let createRecipeUsecase: CreateRecipeUsecase;
  let testExternalIngredientRef: ExternalIngredientRef;
  let testIngredientLineInfo: IngredientLineInfo;
  let user: User;

  beforeEach(async () => {
    const idGenerator = new Uuidv4IdGenerator();
    recipesRepo = new MemoryRecipesRepo();
    ingredientsRepo = new MemoryIngredientsRepo();
    externalIngredientsRefRepo = new MemoryExternalIngredientsRefRepo();
    imagesRepo = new MemoryImagesRepo();
    imageProcessor = new SharpImageProcessor();
    usersRepo = new MemoryUsersRepo();

    createRecipeUsecase = new CreateRecipeUsecase(
      recipesRepo,
      ingredientsRepo,
      imagesRepo,
      usersRepo,
      idGenerator,
      externalIngredientsRefRepo,
      imageProcessor
    );

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);

    testExternalIngredientRef = ExternalIngredientRef.create({
      ...vp.validExternalIngredientRefProps,
    });

    testIngredientLineInfo = {
      externalIngredientId: testExternalIngredientRef.externalId,
      source: testExternalIngredientRef.source,
      name: 'Chicken Breast',
      caloriesPer100g: 165,
      proteinPer100g: 31,
      quantityInGrams: 200,
    };
  });

  describe('Creation', () => {
    it('should create and save a new recipe with no image', async () => {
      const request = {
        actorUserId: vp.userId,
        targetUserId: vp.userId,
        name: 'Grilled Chicken',
        ingredientLinesInfo: [testIngredientLineInfo],
      };

      const recipe = await createRecipeUsecase.execute(request);

      expect(recipe).toHaveProperty('id');
      expect(recipe.userId).toBe(vp.userId);
      expect(recipe.name).toBe(request.name);
      expect(recipe.imageUrl).not.toBeDefined();
      expect(recipe.ingredientLines).toHaveLength(1);

      const savedRecipe = await recipesRepo.getRecipeById(recipe.id);

      // @ts-expect-error savedRecipe won't be null here
      expect(toRecipeDTO(savedRecipe)).toEqual(recipe);
    });

    it('should create and save a new recipe WITH image', async () => {
      const testImage = createTestImage('small');
      const request = {
        actorUserId: vp.userId,
        targetUserId: vp.userId,
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
      expect(recipe).toHaveProperty('createdAt');
      expect(recipe).toHaveProperty('updatedAt');

      const savedRecipe = await recipesRepo.getRecipeById(recipe.id);

      // @ts-expect-error savedRecipe won't be null here
      expect(toRecipeDTO(savedRecipe)).toEqual(recipe);
    });

    it('should create recipe if ingredient already exists', async () => {
      const anotherExternalIngredientRef = ExternalIngredientRef.create({
        ...vp.validExternalIngredientRefProps,
        externalId: 'existing-external-ing-456',
        ingredientId: 'existing-ingredient-id',
      });

      await externalIngredientsRefRepo.save(anotherExternalIngredientRef);

      const testIngredient = Ingredient.create({
        ...vp.validIngredientProps,
        id: 'existing-ingredient-id',
        name: 'Chicken Breast',
        calories: 165,
        protein: 31,
      });

      await ingredientsRepo.saveIngredient(testIngredient);

      const ingredientsLineInfo: IngredientLineInfo = {
        externalIngredientId: anotherExternalIngredientRef.externalId,
        source: anotherExternalIngredientRef.source,
        name: 'Chicken Breast',
        caloriesPer100g: 165,
        proteinPer100g: 31,
        quantityInGrams: 250,
      };

      const ingredientsBefore = ingredientsRepo.countForTesting();

      const request = {
        actorUserId: vp.userId,
        targetUserId: vp.userId,
        name: 'Grilled Chicken',
        ingredientLinesInfo: [ingredientsLineInfo],
      };

      const recipe = await createRecipeUsecase.execute(request);

      const ingredientsAfter = ingredientsRepo.countForTesting();

      expect(ingredientsAfter).toBe(ingredientsBefore); // No new ingredient created

      expect(recipe).toHaveProperty('id');
      expect(recipe.userId).toBe(vp.userId);
      expect(recipe.name).toBe(request.name);
    });

    it('should save recipe ingredient lines', async () => {
      const request = {
        actorUserId: vp.userId,
        targetUserId: vp.userId,
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
        actorUserId: vp.userId,
        targetUserId: vp.userId,
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
        actorUserId: vp.userId,
        targetUserId: vp.userId,
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
        externalIngredientId: 'ingredient-2',
        source: testExternalIngredientRef.source,
        name: 'Rice',
        caloriesPer100g: 130,
        proteinPer100g: 2.7,
        quantityInGrams: 100,
      };

      const request = {
        actorUserId: vp.userId,
        targetUserId: vp.userId,
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
      const initialImageCount = imagesRepo.countForTesting();

      expect(initialImageCount).toBe(0);

      const testImage = createTestImage('small');
      const request = {
        actorUserId: vp.userId,
        targetUserId: vp.userId,
        name: 'Recipe with Image',
        ingredientLinesInfo: [testIngredientLineInfo],
        imageBuffer: testImage,
      };

      await createRecipeUsecase.execute(request);

      const finalImageCount = imagesRepo.countForTesting();
      expect(finalImageCount).toBe(1);
    });

    it("should create external ingredient ref if it didn't exist", async () => {
      const newExternalIngredientId = 'new-external-ing-123';

      const newIngredientLineInfo: IngredientLineInfo = {
        externalIngredientId: newExternalIngredientId,
        source: 'openfoodfacts',
        name: 'New Ingredient',
        caloriesPer100g: 50,
        proteinPer100g: 5,
        quantityInGrams: 100,
      };

      const request = {
        actorUserId: vp.userId,
        targetUserId: vp.userId,
        name: 'Recipe with New External Ingredient',
        ingredientLinesInfo: [newIngredientLineInfo],
      };

      const initialExternalIngredientRefs =
        externalIngredientsRefRepo.countForTesting();

      await createRecipeUsecase.execute(request);

      const fetchedRef =
        await externalIngredientsRefRepo.getByExternalIdAndSource(
          newExternalIngredientId,
          newIngredientLineInfo.source
        );

      const finalExternalIngredientRefs =
        externalIngredientsRefRepo.countForTesting();

      expect(finalExternalIngredientRefs).toBe(
        initialExternalIngredientRefs + 1
      );

      expect(fetchedRef!.externalId).toBe(newExternalIngredientId);
      expect(fetchedRef!.ingredientId).toBeDefined();
    });

    it("should create ingredient if it didn't exist", async () => {
      const newExternalIngredientId = 'another-new-external-ing-456';

      const newIngredientLineInfo: IngredientLineInfo = {
        externalIngredientId: newExternalIngredientId,
        source: 'openfoodfacts',
        name: 'Another New Ingredient',
        caloriesPer100g: 80,
        proteinPer100g: 8,
        quantityInGrams: 150,
      };

      const request = {
        actorUserId: vp.userId,
        targetUserId: vp.userId,
        name: 'Recipe with New Ingredient',
        ingredientLinesInfo: [newIngredientLineInfo],
      };

      const initialIngredientCount = ingredientsRepo.countForTesting();

      await createRecipeUsecase.execute(request);

      const finalIngredientCount = ingredientsRepo.countForTesting();

      expect(finalIngredientCount).toBe(initialIngredientCount + 1);

      const newIngredientId =
        (await externalIngredientsRefRepo.getByExternalIdAndSource(
          newExternalIngredientId,
          newIngredientLineInfo.source
        ))!.ingredientId;

      const fetchedIngredient = await ingredientsRepo.getIngredientById(
        newIngredientId
      );

      expect(fetchedIngredient).toBeDefined();
      expect(fetchedIngredient!.name).toBe(newIngredientLineInfo.name);
    });
  });

  describe('Error', () => {
    it('should throw error if user does not exist', async () => {
      const request = {
        actorUserId: 'non-existent',
        targetUserId: 'non-existent',
        name: 'Test Recipe',
        ingredientLinesInfo: [testIngredientLineInfo],
      };

      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );
      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        /CreateRecipeUsecase.*user.*not.*found/
      );
    });

    it('should throw error when trying to create recipe for another user', async () => {
      const request = {
        actorUserId: vp.userId,
        targetUserId: 'another-user-id',
        name: 'Test Recipe',
        ingredientLinesInfo: [testIngredientLineInfo],
      };

      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        PermissionError
      );
      await expect(createRecipeUsecase.execute(request)).rejects.toThrow(
        /CreateRecipeUsecase.*cannot create.*recipe.*another user/
      );
    });
  });
});
