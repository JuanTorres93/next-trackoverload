import { IngredientsRepo } from '@/domain/repos/IngredientsRepo.port';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import IngredientMongo from './models/IngredientMongo';
import { IngredientCreateProps } from '@/domain/entities/ingredient/Ingredient';

export class MongoIngredientsRepo implements IngredientsRepo {
  async saveIngredient(ingredient: Ingredient): Promise<void> {
    const ingredientData: IngredientCreateProps = {
      id: ingredient.id,
      name: ingredient.name,
      calories: ingredient.nutritionalInfoPer100g.calories,
      protein: ingredient.nutritionalInfoPer100g.protein,
      imageUrl: ingredient.imageUrl,
      createdAt: ingredient.createdAt,
      updatedAt: ingredient.updatedAt,
    };

    await IngredientMongo.findOneAndUpdate(
      { id: ingredient.id },
      ingredientData,
      { upsert: true, new: true },
    );
  }

  async getAllIngredients(): Promise<Ingredient[]> {
    const ingredientDocs = await IngredientMongo.find({}).lean();

    return ingredientDocs.map((doc) =>
      Ingredient.create({
        id: doc.id,
        name: doc.name,
        calories: doc.calories,
        protein: doc.protein,
        imageUrl: doc.imageUrl,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }

  async getIngredientById(id: string): Promise<Ingredient | null> {
    const doc = await IngredientMongo.findOne({ id }).lean();

    if (!doc) {
      return null;
    }

    return Ingredient.create({
      id: doc.id,
      name: doc.name,
      calories: doc.calories,
      protein: doc.protein,
      imageUrl: doc.imageUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  async getIngredientsByIds(ids: string[]): Promise<Ingredient[]> {
    const ingredientDocs = await IngredientMongo.find({
      id: { $in: ids },
    }).lean();

    return ingredientDocs.map((doc) =>
      Ingredient.create({
        id: doc.id,
        name: doc.name,
        calories: doc.calories,
        protein: doc.protein,
        imageUrl: doc.imageUrl,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }

  async deleteIngredient(id: string): Promise<void> {
    const result = await IngredientMongo.deleteOne({ id });

    if (result.deletedCount === 0) {
      return Promise.reject(null);
    }
  }

  async getByFuzzyName(name: string): Promise<Ingredient[]> {
    const searchTerm = name.toLowerCase().trim();

    if (!searchTerm) {
      return [];
    }

    const ingredientDocs = await IngredientMongo.find({
      name: { $regex: searchTerm, $options: 'i' },
    }).lean();

    return ingredientDocs.map((doc) =>
      Ingredient.create({
        id: doc.id,
        name: doc.name,
        calories: doc.calories,
        protein: doc.protein,
        imageUrl: doc.imageUrl,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    );
  }
}
