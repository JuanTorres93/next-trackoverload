import { MealsRepo } from '@/domain/repos/MealsRepo.port';
import { Meal } from '@/domain/entities/meal/Meal';
import { IngredientLine } from '@/domain/entities/ingredientline/IngredientLine';
import MealMongo from './models/MealMongo';
import MealLineMongo from './models/MealLineMongo';
import { Ingredient } from '@/domain/entities/ingredient/Ingredient';
import { IngredientCreateProps } from '@/domain/entities/ingredient/Ingredient';
import { IngredientLineCreateProps } from '@/domain/entities/ingredientline/IngredientLine';
import { MealCreateProps } from '@/domain/entities/meal/Meal';

// Type for meal line document populated with ingredient
type PopulatedMealLineDoc = Omit<IngredientLineCreateProps, 'ingredient'> & {
  ingredientId: string;
  ingredient?: IngredientCreateProps;
};

// Type for meal document populated with meal lines and ingredients
type PopulatedMealDoc = MealCreateProps & {
  mealLines?: PopulatedMealLineDoc[];
};

export class MongoMealsRepo implements MealsRepo {
  async saveMeal(meal: Meal): Promise<void> {
    const mealData = meal.toCreateProps();

    // TODO IMPORTANT: Transaction
    await MealMongo.findOneAndUpdate({ id: meal.id }, mealData, {
      upsert: true,
      new: true,
    });

    // Delete existing meal lines for this meal first
    await MealLineMongo.deleteMany({ parentId: meal.id });

    // Save new meal lines
    const mealLines = meal.ingredientLines.map((line) => ({
      id: line.id,
      parentId: meal.id,
      ingredientId: line.ingredient.id,
      quantityInGrams: line.quantityInGrams,
      createdAt: line.createdAt,
      updatedAt: line.updatedAt,
    }));

    if (mealLines.length > 0) {
      await MealLineMongo.insertMany(mealLines);
    }
  }

  async getAllMeals(): Promise<Meal[]> {
    const mealDocs = await MealMongo.find({})
      .populate({
        path: 'mealLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return this.toMealEntities(mealDocs);
  }

  async getMealById(id: string): Promise<Meal | null> {
    const doc = await MealMongo.findOne({ id })
      .populate({
        path: 'mealLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return doc ? this.toMealEntity(doc) : null;
  }

  async getMealByIds(ids: string[]): Promise<Meal[]> {
    const mealDocs = await MealMongo.find({ id: { $in: ids } })
      .populate({
        path: 'mealLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return this.toMealEntities(mealDocs);
  }

  async getAllMealsForUser(userId: string): Promise<Meal[]> {
    const mealDocs = await MealMongo.find({ userId })
      .populate({
        path: 'mealLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return this.toMealEntities(mealDocs);
  }

  async getMealByIdForUser(id: string, userId: string): Promise<Meal | null> {
    const doc = await MealMongo.findOne({ id, userId })
      .populate({
        path: 'mealLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return doc ? this.toMealEntity(doc) : null;
  }

  async getMealsByRecipeIdAndUserId(
    recipeId: string,
    userId: string,
  ): Promise<Meal[]> {
    const mealDocs = await MealMongo.find({
      createdFromRecipeId: recipeId,
      userId,
    })
      .populate({
        path: 'mealLines',
        populate: { path: 'ingredient', model: 'Ingredient' },
      })
      .lean({ virtuals: true });

    return this.toMealEntities(mealDocs);
  }

  async deleteMeal(id: string): Promise<void> {
    const session = await MealMongo.startSession();
    session.startTransaction();

    let deletedCount: number;

    try {
      const result = await MealMongo.deleteOne({ id }, { session });
      deletedCount = result.deletedCount || 0;

      await MealLineMongo.deleteMany({ parentId: id }, { session });

      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      await session.endSession();
    }

    if (deletedCount === 0) {
      return Promise.reject(null);
    }
  }

  async deleteMultipleMeals(ids: string[]): Promise<void> {
    // TODO IMPORTANT: Transaction
    await MealMongo.deleteMany({ id: { $in: ids } });
    // Delete associated meal lines
    await MealLineMongo.deleteMany({ parentId: { $in: ids } });
  }

  async deleteAllMealsForUser(userId: string): Promise<void> {
    // Find all meal IDs for this user first
    const mealDocs = await MealMongo.find({ userId }).select('id').lean();
    const mealIds = mealDocs.map((doc) => doc.id);

    // TODO IMPORTANT: Transaction
    // Delete meals
    await MealMongo.deleteMany({ userId });

    // Delete associated meal lines
    if (mealIds.length > 0) {
      await MealLineMongo.deleteMany({ parentId: { $in: mealIds } });
    }
  }

  private toMealEntity(doc: PopulatedMealDoc): Meal | null {
    if (!doc.mealLines || doc.mealLines.length === 0) {
      return null;
    }

    const ingredientLines = doc.mealLines
      .filter((line) => line.ingredient)
      .map((line) =>
        IngredientLine.create({
          id: line.id,
          parentId: line.parentId,
          parentType: 'meal',
          ingredient: Ingredient.create(line.ingredient!),
          quantityInGrams: line.quantityInGrams,
          createdAt: line.createdAt,
          updatedAt: line.updatedAt,
        }),
      );

    if (ingredientLines.length === 0) {
      return null;
    }

    return Meal.create({
      id: doc.id,
      userId: doc.userId,
      name: doc.name,
      ingredientLines,
      createdFromRecipeId: doc.createdFromRecipeId,
      imageUrl: doc.imageUrl,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private toMealEntities(docs: PopulatedMealDoc[]): Meal[] {
    return docs
      .map((doc) => this.toMealEntity(doc))
      .filter((meal): meal is Meal => meal !== null);
  }
}
