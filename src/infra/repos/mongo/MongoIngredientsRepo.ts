import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import IngredientMongo from './models/IngredientMongo';
import { IngredientCreateProps } from '@/domain/entities/ingredient/Ingredient';
import { withTransaction } from './common/withTransaction';

export class MongoIngredientsRepo implements IngredientsRepo {
  async saveIngredient(ingredient: Ingredient): Promise<void> {
    return withTransaction(async (session) => {
      const ingredientData: IngredientCreateProps = ingredient.toCreateProps();

      await IngredientMongo.findOneAndUpdate(
        { id: ingredient.id },
        ingredientData,
        { upsert: true, new: true, session },
      );
    });
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    const ingredientDocs = await IngredientMongo.find({}).lean();

    return ingredientDocs.map((doc) => Ingredient.create(doc));
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    const doc = await IngredientMongo.findOne({ id }).lean();

    if (!doc) {
      return null;
    }

    return Ingredient.create(doc);
  }

  async getIngredientsByIds(ids: string[]): Promise<Ingredient[]> {
    const ingredientDocs = await IngredientMongo.find({
      id: { $in: ids },
    }).lean();

    return ingredientDocs.map((doc) => Ingredient.create(doc));
  }

  async deleteIngredient(id: string): Promise<void> {
    return withTransaction(async (session) => {
      const result = await IngredientMongo.deleteOne({ id }, { session });

      if (result.deletedCount === 0) {
        return Promise.reject(null);
      }
    });
  }
}
