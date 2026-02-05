import { ExternalIngredientsRefRepo } from '@/domain/repos/ExternalIngredientsRefRepo.port';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import ExternalIngredientRefMongo from './models/ExternalIngredientRefMongo';
import { ExternalIngredientRefCreateProps } from '@/domain/entities/externalingredientref/ExternalIngredientRef';

export class MongoExternalIngredientsRefRepo implements ExternalIngredientsRefRepo {
  async save(externalIngredientRef: ExternalIngredientRef): Promise<void> {
    const data: ExternalIngredientRefCreateProps =
      externalIngredientRef.toCreateProps();

    await ExternalIngredientRefMongo.findOneAndUpdate(
      {
        externalId: externalIngredientRef.externalId,
        source: externalIngredientRef.source,
      },
      data,
      { upsert: true, new: true },
    );
  }

  async getByExternalIdAndSource(
    externalId: string,
    source: string,
  ): Promise<ExternalIngredientRef | null> {
    const doc = await ExternalIngredientRefMongo.findOne({
      externalId,
      source,
    }).lean();

    if (!doc) {
      return null;
    }

    return ExternalIngredientRef.create({
      externalId: doc.externalId,
      source: doc.source,
      ingredientId: doc.ingredientId,
      createdAt: doc.createdAt,
    });
  }

  async getByExternalIdsAndSource(
    externalIds: string[],
    source: string,
  ): Promise<ExternalIngredientRef[]> {
    const docs = await ExternalIngredientRefMongo.find({
      externalId: { $in: externalIds },
      source,
    }).lean();

    return docs.map((doc) =>
      ExternalIngredientRef.create({
        externalId: doc.externalId,
        source: doc.source,
        ingredientId: doc.ingredientId,
        createdAt: doc.createdAt,
      }),
    );
  }

  async delete(externalId: string): Promise<void> {
    const result = await ExternalIngredientRefMongo.deleteOne({ externalId });

    if (result.deletedCount === 0) {
      return Promise.reject(null);
    }
  }
}
