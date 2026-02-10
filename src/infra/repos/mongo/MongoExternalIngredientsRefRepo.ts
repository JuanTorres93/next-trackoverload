import { ExternalIngredientsRefRepo } from '@/domain/repos/ExternalIngredientsRefRepo.port';
import { ExternalIngredientRef } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import ExternalIngredientRefMongo from './models/ExternalIngredientRefMongo';
import { ExternalIngredientRefCreateProps } from '@/domain/entities/externalingredientref/ExternalIngredientRef';
import { withTransaction } from './common/withTransaction';

export class MongoExternalIngredientsRefRepo implements ExternalIngredientsRefRepo {
  async getAllExternalIngredientsRef(): Promise<ExternalIngredientRef[]> {
    const docs = await ExternalIngredientRefMongo.find({}).lean();

    return docs.map((doc) => ExternalIngredientRef.create(doc));
  }

  async save(externalIngredientRef: ExternalIngredientRef): Promise<void> {
    return withTransaction(async (session) => {
      const data: ExternalIngredientRefCreateProps =
        externalIngredientRef.toCreateProps();

      await ExternalIngredientRefMongo.findOneAndUpdate(
        {
          externalId: externalIngredientRef.externalId,
          source: externalIngredientRef.source,
        },
        data,
        { upsert: true, new: true, session },
      );
    });
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

    return ExternalIngredientRef.create(doc);
  }

  async getByExternalIdsAndSource(
    externalIds: string[],
    source: string,
  ): Promise<ExternalIngredientRef[]> {
    const docs = await ExternalIngredientRefMongo.find({
      externalId: { $in: externalIds },
      source,
    }).lean();

    return docs.map((doc) => ExternalIngredientRef.create(doc));
  }

  async delete(externalId: string): Promise<void> {
    return withTransaction(async (session) => {
      const result = await ExternalIngredientRefMongo.deleteOne(
        { externalId },
        { session },
      );

      if (result.deletedCount === 0) {
        return Promise.reject(null);
      }
    });
  }
}
