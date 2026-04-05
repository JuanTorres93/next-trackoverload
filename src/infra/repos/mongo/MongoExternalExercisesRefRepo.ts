import {
  ExternalExerciseRef,
  ExternalExerciseRefCreateProps,
} from "@/domain/entities/externalexerciseref/ExternalExerciseRef";
import { ExternalExercisesRefRepo } from "@/domain/repos/ExternalExercisesRefRepo.port";

import { withTransaction } from "./common/withTransaction";
import ExternalExerciseRefMongo from "./models/ExternalExerciseRefMongo";

export class MongoExternalExercisesRefRepo implements ExternalExercisesRefRepo {
  async getAllExternalExercisesRef(): Promise<ExternalExerciseRef[]> {
    const docs = await ExternalExerciseRefMongo.find({}).lean();

    return docs.map((doc) => ExternalExerciseRef.create(doc));
  }

  async save(externalExerciseRef: ExternalExerciseRef): Promise<void> {
    return withTransaction(async (session) => {
      const data: ExternalExerciseRefCreateProps =
        externalExerciseRef.toCreateProps();

      await ExternalExerciseRefMongo.findOneAndUpdate(
        {
          externalId: externalExerciseRef.externalId,
          source: externalExerciseRef.source,
        },
        data,
        { upsert: true, new: true, session },
      );
    });
  }

  async getByExternalIdAndSource(
    externalId: string,
    source: string,
  ): Promise<ExternalExerciseRef | null> {
    const doc = await ExternalExerciseRefMongo.findOne({
      externalId,
      source,
    }).lean();

    if (!doc) {
      return null;
    }

    return ExternalExerciseRef.create(doc);
  }

  async getByExternalIdsAndSource(
    externalIds: string[],
    source: string,
  ): Promise<ExternalExerciseRef[]> {
    const docs = await ExternalExerciseRefMongo.find({
      externalId: { $in: externalIds },
      source,
    }).lean();

    return docs.map((doc) => ExternalExerciseRef.create(doc));
  }

  async delete(externalId: string): Promise<void> {
    return withTransaction(async (session) => {
      const result = await ExternalExerciseRefMongo.deleteOne(
        { externalId },
        { session },
      );

      if (result.deletedCount === 0) {
        return Promise.reject(null);
      }
    });
  }
}
