import * as vp from '@/../tests/createProps';
import * as dto from '@/../tests/dtoProperties';
import { toRecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { NotFoundError } from '@/domain/common/errors';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe } from '@/domain/entities/recipe/Recipe';
import { User } from '@/domain/entities/user/User';
import { MemoryRecipesRepo } from '@/infra/repos/memory/MemoryRecipesRepo';
import { MemoryUsersRepo } from '@/infra/repos/memory/MemoryUsersRepo';
import { Uuidv4IdGenerator } from '@/infra/services/IdGenerator/Uuidv4IdGenerator/Uuidv4IdGenerator';
import { DuplicateRecipeUsecase } from '../DuplicateRecipe.usecase';

describe('DuplicateRecipeUsecase', () => {
  let recipesRepo: MemoryRecipesRepo;
  let usersRepo: MemoryUsersRepo;
  let duplicateRecipeUsecase: DuplicateRecipeUsecase;
  let testRecipe: Recipe;
  let user: User;
  let originalIngredientIds: string[];

  beforeEach(async () => {
    recipesRepo = new MemoryRecipesRepo();
    usersRepo = new MemoryUsersRepo();
    duplicateRecipeUsecase = new DuplicateRecipeUsecase(
      recipesRepo,
      usersRepo,
      new Uuidv4IdGenerator()
    );

    user = User.create({
      ...vp.validUserProps,
    });

    await usersRepo.saveUser(user);

    const testIngredient = Ingredient.create({
      ...vp.validIngredientProps,
    });

    const testIngredientLine = IngredientLine.create({
      ...vp.ingredientLineRecipePropsNoIngredient,
      ingredient: testIngredient,
    });

    testRecipe = Recipe.create({
      ...vp.recipePropsNoIngredientLines,
      ingredientLines: [testIngredientLine],
    });

    originalIngredientIds = testRecipe.ingredientLines.map(
      (il) => il.ingredient.id
    );

    await recipesRepo.saveRecipe(testRecipe);
  });

  describe('Duplicate', () => {
    it('should duplicate recipe with default name', async () => {
      const request = {
        recipeId: testRecipe.id,
        userId: vp.userId,
      };

      const result = await duplicateRecipeUsecase.execute(request);

      expect(result).toHaveProperty('id');
      expect(result.id).not.toBe(testRecipe.id);
      expect(result.name).toBe(`${testRecipe.name} (Copy)`);
      expect(result.calories).toBe(testRecipe.calories);
      expect(result.protein).toBe(testRecipe.protein);

      const duplicatedIngredientIds = result.ingredientLines.map(
        (il) => il.ingredient.id
      );

      for (const dupId of duplicatedIngredientIds) {
        expect(originalIngredientIds).toContain(dupId);
      }

      const savedRecipe = await recipesRepo.getRecipeById(result.id);
      expect(toRecipeDTO(savedRecipe!)).toEqual(result);
    });

    it('should duplicate recipe with custom name', async () => {
      const request = {
        recipeId: testRecipe.id,
        newName: 'My Custom Recipe Copy',
        userId: vp.userId,
      };

      const result = await duplicateRecipeUsecase.execute(request);

      expect(result.name).toBe('My Custom Recipe Copy');

      const duplicatedIngredientIds = result.ingredientLines.map(
        (il) => il.ingredient.id
      );

      for (const dupId of duplicatedIngredientIds) {
        expect(originalIngredientIds).toContain(dupId);
      }
    });

    it('should preserve all ingredients from original recipe', async () => {
      const secondIngredient = Ingredient.create({
        ...vp.validIngredientProps,
        id: 'second-ingredient-id',
      });

      const secondIngredientLine = IngredientLine.create({
        ...vp.ingredientLineRecipePropsNoIngredient,
        id: 'second-ingredient-line-id',
        ingredient: secondIngredient,
      });

      testRecipe.addIngredientLine(secondIngredientLine);

      const request = {
        userId: vp.userId,
        recipeId: testRecipe.id,
      };

      const result = await duplicateRecipeUsecase.execute(request);

      expect(result.ingredientLines).toHaveLength(2);
      const duplicatedIngredientIds = result.ingredientLines.map(
        (il) => il.ingredient.id
      );

      // Verify all original ingredients are present
      for (const origId of originalIngredientIds) {
        expect(duplicatedIngredientIds).toContain(origId);
      }

      // Verify second ingredient (of this particular test) is also present
      expect(duplicatedIngredientIds).toContain(secondIngredient.id);
    });

    it('should create independent recipe copy with different id', async () => {
      const request = {
        recipeId: testRecipe.id,
        userId: vp.userId,
      };

      const duplicatedRecipe = await duplicateRecipeUsecase.execute(request);

      // Duplicated recipe should have different id but same content
      expect(duplicatedRecipe.id).not.toBe(testRecipe.id);
      expect(duplicatedRecipe.name).toBe(`${testRecipe.name} (Copy)`);

      const originalIngredientLinesIds = testRecipe.ingredientLines.map(
        (il) => il.id
      );

      const duplicatedIngredientLinesIds = duplicatedRecipe.ingredientLines.map(
        (il) => il.id
      );

      // Ingredient lines should be different instances
      for (const dupIlId of duplicatedIngredientLinesIds) {
        expect(originalIngredientLinesIds).not.toContain(dupIlId);
      }

      // Original recipe should be unchanged in the repo
      const originalRecipe = await recipesRepo.getRecipeById(testRecipe.id);
      expect(originalRecipe).toBeDefined();
      expect(originalRecipe!.name).toBe(testRecipe.name);
    });

    it('should have different creation timestamps', async () => {
      // Wait a moment to ensure different timestamps
      await new Promise((resolve) => setTimeout(resolve, 1));

      const request = {
        recipeId: testRecipe.id,
        userId: vp.userId,
      };

      const result = await duplicateRecipeUsecase.execute(request);

      expect(new Date(result.createdAt).getTime()).toBeGreaterThan(
        testRecipe.createdAt.getTime()
      );
      expect(new Date(result.updatedAt).getTime()).toBeGreaterThan(
        testRecipe.updatedAt.getTime()
      );
    });

    it('should return RecipeDTO', async () => {
      const request = {
        recipeId: testRecipe.id,
        userId: vp.userId,
      };

      const result = await duplicateRecipeUsecase.execute(request);

      expect(result).not.toBeInstanceOf(Recipe);
      for (const prop of dto.recipeDTOProperties) {
        expect(result).toHaveProperty(prop);
      }
    });

    it('should create new ingredientLines for duplicated recipe', async () => {
      const request = {
        recipeId: testRecipe.id,
        userId: vp.userId,
      };

      const result = await duplicateRecipeUsecase.execute(request);

      expect(result.ingredientLines).toHaveLength(
        testRecipe.ingredientLines.length
      );

      for (let i = 0; i < result.ingredientLines.length; i++) {
        expect(result.ingredientLines[i].id).not.toBe(
          testRecipe.ingredientLines[i].id
        );
      }
    });
  });

  describe('Errors', () => {
    it('should throw NotFoundError when recipe does not exist', async () => {
      const request = {
        recipeId: 'non-existent-id',
        userId: vp.userId,
      };

      await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );

      await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
        /DuplicateRecipeUsecase:.*Recipe.* not found/
      );
    });

    it('should throw error if user does not exist', async () => {
      const request = {
        recipeId: 'some-id',
        userId: 'non-existent',
      };

      await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );
      await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
        /DuplicateRecipeUsecase.*user.*not.*found/
      );
    });

    it("should throw error when trying to duplicate another user's recipe", async () => {
      const anotherUser = User.create({
        ...vp.validUserProps,
        id: 'another-user-id',
        email: 'anotheruser@example.com',
      });

      await usersRepo.saveUser(anotherUser);

      const request = {
        recipeId: testRecipe.id,
        userId: anotherUser.id,
      };

      await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
        NotFoundError
      );
      await expect(duplicateRecipeUsecase.execute(request)).rejects.toThrow(
        /DuplicateRecipeUsecase:.*Recipe.* not found/
      );
    });
  });
});
