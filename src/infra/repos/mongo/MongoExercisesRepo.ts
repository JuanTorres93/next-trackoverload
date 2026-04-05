import { Exercise } from "@/domain/entities/exercise/Exercise";
import { ExerciseCreateProps } from "@/domain/entities/exercise/Exercise";
import { ExercisesRepo } from "@/domain/repos/ExercisesRepo.port";

import ExerciseMongo from "./models/ExerciseMongo";

export class MongoExercisesRepo implements ExercisesRepo {
  async saveExercise(exercise: Exercise): Promise<void> {
    const exerciseData: ExerciseCreateProps = exercise.toCreateProps();

    await ExerciseMongo.findOneAndUpdate({ id: exercise.id }, exerciseData, {
      upsert: true,
      new: true,
    });
  }

  async getAllExercises(): Promise<Exercise[]> {
    const exerciseDocs = await ExerciseMongo.find({}).lean();

    return exerciseDocs.map((doc) => Exercise.create(doc));
  }

  async getExerciseById(id: string): Promise<Exercise | null> {
    const doc = await ExerciseMongo.findOne({ id }).lean();

    if (!doc) {
      return null;
    }

    return Exercise.create(doc);
  }

  async getExercisesByIds(ids: string[]): Promise<Exercise[]> {
    const docs = await ExerciseMongo.find({ id: { $in: ids } }).lean();

    return docs.map((doc) => Exercise.create(doc));
  }

  async deleteExercise(id: string): Promise<void> {
    const result = await ExerciseMongo.deleteOne({ id });

    if (result.deletedCount === 0) {
      return Promise.reject(null);
    }
  }
}
