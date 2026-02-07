import {
  Ingredient,
  IngredientCreateProps,
} from '@/domain/entities/ingredient/Ingredient';
import {
  IngredientLine,
  IngredientLineCreateProps,
} from '@/domain/entities/ingredientline/IngredientLine';
import { Recipe, RecipeCreateProps } from '@/domain/entities/recipe/Recipe';
import { RecipesRepo } from '@/domain/repos/RecipesRepo.port';
import { inMongoTransaction } from './common/inMongoTransaction';
import RecipeLineMongo from './models/RecipeLineMongo';
import RecipeMongo from './models/RecipeMongo';

// Type for recipe line document populated with ingredient
type PopulatedRecipeLineDoc = Omit<IngredientLineCreateProps, 'ingredient'> & {
  ingredientId: string;
  ingredient?: IngredientCreateProps;
};

// Type for recipe document populated with recipe lines and ingredients
type PopulatedRecipeDoc = RecipeCreateProps & {
  recipeLines?: PopulatedRecipeLineDoc[];
};

export class MongoRecipesRepo implements RecipesRepo {
  async saveRecipe(recipe: Recipe): Promise<void> {
    const recipeData = recipe.toCreateProps();

    const session = await RecipeMongo.startSession();
    session.startTransaction();

    await inMongoTransaction(session, async () => {
      await RecipeMongo.findOneAndUpdate({ id: recipe.id }, recipeData, {
        upsert: true,
        new: true,
        session,
      });

      // Delete existing recipe lines for this recipe first
      await RecipeLineMongo.deleteMany({ parentId: recipe.id }, { session });

      // Save new recipe lines
      const recipeLines = recipe.ingredientLines.map((line) => ({
        id: line.id,
        parentId: recipe.id,
        ingredientId: line.ingredient.id,
        quantityInGrams: line.quantityInGrams,
        createdAt: line.createdAt,
        updatedAt: line.updatedAt,
      }));

      if (recipeLines.length > 0) {
        await RecipeLineMongo.insertMany(recipeLines, { session });
      }
    });
  }

  async getAllRecipes(): Promise<Recipe[]> {
    const recipeDocs = await RecipeMongo.find({})
      .populate({
        path: 'recipeLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return this.toRecipeEntities(recipeDocs);
  }

  async getRecipeById(id: string): Promise<Recipe | null> {
    const doc = await RecipeMongo.findOne({ id })
      .populate({
        path: 'recipeLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return doc ? this.toRecipeEntity(doc) : null;
  }

  async getAllRecipesByUserId(userId: string): Promise<Recipe[]> {
    const recipeDocs = await RecipeMongo.find({ userId })
      .populate({
        path: 'recipeLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return this.toRecipeEntities(recipeDocs);
  }

  async getRecipeByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Recipe | null> {
    const doc = await RecipeMongo.findOne({ id, userId })
      .populate({
        path: 'recipeLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return doc ? this.toRecipeEntity(doc) : null;
  }

  async deleteRecipe(id: string): Promise<void> {
    const session = await RecipeMongo.startSession();
    session.startTransaction();

    let deletedCount: number = 0;

    await inMongoTransaction(session, async () => {
      const result = await RecipeMongo.deleteOne({ id }, { session });
      deletedCount = result.deletedCount || 0;

      await RecipeLineMongo.deleteMany({ parentId: id }, { session });
    });

    if (deletedCount === 0) {
      return Promise.reject(null);
    }
  }

  async deleteIngredientLineInRecipe(
    id: string,
    ingredientLineId: string,
  ): Promise<void> {
    await RecipeLineMongo.deleteOne({ id: ingredientLineId, parentId: id });
  }

  async deleteMultipleIngredientLinesInRecipe(
    ids: string[],
    ingredientLineIds: string[],
  ): Promise<void> {
    // Build array of conditions for each recipe + line pair
    const deleteConditions = ids.map((recipeId, index) => ({
      id: ingredientLineIds[index],
      parentId: recipeId,
    }));

    await RecipeLineMongo.deleteMany({ $or: deleteConditions });
  }

  async deleteAllRecipesForUser(userId: string): Promise<void> {
    const recipeDocs = await RecipeMongo.find({ userId }).select('id').lean();
    const recipeIds = recipeDocs.map((doc) => doc.id);

    const session = await RecipeMongo.startSession();
    session.startTransaction();

    await inMongoTransaction(session, async () => {
      await RecipeMongo.deleteMany({ userId }, { session });

      // Delete associated recipe lines
      if (recipeIds.length > 0) {
        await RecipeLineMongo.deleteMany(
          { parentId: { $in: recipeIds } },
          { session },
        );
      }
    });
  }

  private toRecipeEntity(doc: PopulatedRecipeDoc): Recipe | null {
    if (!doc.recipeLines || doc.recipeLines.length === 0) {
      return null;
    }

    const ingredientLines = doc.recipeLines
      .filter((line) => line.ingredient)
      .map((line) =>
        IngredientLine.create({
          ...line,
          parentType: 'recipe',
          ingredient: Ingredient.create(line.ingredient!),
        }),
      );

    if (ingredientLines.length === 0) {
      return null;
    }

    return Recipe.create({
      ...doc,
      ingredientLines,
    });
  }

  private toRecipeEntities(docs: PopulatedRecipeDoc[]): Recipe[] {
    return docs
      .map((doc) => this.toRecipeEntity(doc))
      .filter((recipe): recipe is Recipe => recipe !== null);
  }
}
