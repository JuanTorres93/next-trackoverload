import { ExerciseCreateProps } from '@/domain/entities/exercise/Exercise';
import {
  WorkoutLine,
  WorkoutLineCreateProps,
} from '@/domain/entities/workoutline/WorkoutLine';
import { Workout, WorkoutCreateProps } from '@/domain/entities/workout/Workout';
import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { withTransaction } from './common/withTransaction';
import WorkoutLineMongo from './models/WorkoutLineMongo';
import WorkoutMongo from './models/WorkoutMongo';

// Type for workout line document populated with exercise
type PopulatedWorkoutLineDoc = Omit<WorkoutLineCreateProps, 'exercise'> & {
  exerciseId: string;
  exercise?: ExerciseCreateProps;
};

// Type for workout document populated with workout lines and exercises
type PopulatedWorkoutDoc = Omit<WorkoutCreateProps, 'exercises'> & {
  workoutLines?: PopulatedWorkoutLineDoc[];
};

export class MongoWorkoutsRepo implements WorkoutsRepo {
  async saveWorkout(workout: Workout): Promise<void> {
    const workoutData = workout.toCreateProps();

    await withTransaction(async (session) => {
      await WorkoutMongo.findOneAndUpdate({ id: workout.id }, workoutData, {
        upsert: true,
        new: true,
        session,
      });

      // Delete existing workout lines for this workout first
      await WorkoutLineMongo.deleteMany({ workoutId: workout.id }, { session });

      // Save new workout lines
      const workoutLines = workout.exercises.map((line) => ({
        ...line.toCreateProps(),
        workoutId: workout.id,
      }));

      if (workoutLines.length > 0) {
        await WorkoutLineMongo.insertMany(workoutLines, { session });
      }
    });
  }

  async getAllWorkouts(): Promise<Workout[]> {
    const workoutDocs = await WorkoutMongo.find({})
      .populate({
        path: 'workoutLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return this.toWorkoutEntities(workoutDocs);
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    const doc = await WorkoutMongo.findOne({ id })
      .populate({
        path: 'workoutLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return doc ? this.toWorkoutEntity(doc) : null;
  }

  async getAllWorkoutsByUserId(userId: string): Promise<Workout[]> {
    const workoutDocs = await WorkoutMongo.find({ userId })
      .populate({
        path: 'workoutLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return this.toWorkoutEntities(workoutDocs);
  }

  async getWorkoutByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<Workout | null> {
    const doc = await WorkoutMongo.findOne({ id, userId })
      .populate({
        path: 'workoutLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return doc ? this.toWorkoutEntity(doc) : null;
  }

  async getWorkoutsByTemplateId(templateId: string): Promise<Workout[]> {
    const workoutDocs = await WorkoutMongo.find({
      workoutTemplateId: templateId,
    })
      .populate({
        path: 'workoutLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return this.toWorkoutEntities(workoutDocs);
  }

  async getWorkoutsByTemplateIdAndUserId(
    templateId: string,
    userId: string,
  ): Promise<Workout[]> {
    const workoutDocs = await WorkoutMongo.find({
      workoutTemplateId: templateId,
      userId,
    })
      .populate({
        path: 'workoutLines',
        populate: { path: 'exercise', model: 'Exercise' },
      })
      .lean({ virtuals: true });

    return this.toWorkoutEntities(workoutDocs);
  }

  async deleteWorkout(id: string): Promise<void> {
    let deletedCount: number = 0;

    await withTransaction(async (session) => {
      const result = await WorkoutMongo.deleteOne({ id }, { session });
      deletedCount = result.deletedCount || 0;

      await WorkoutLineMongo.deleteMany({ workoutId: id }, { session });
    });

    if (deletedCount === 0) {
      return Promise.reject(null);
    }
  }

  async deleteAllWorkoutsForUser(userId: string): Promise<void> {
    // Find all workout IDs for this user first
    const workoutDocs = await WorkoutMongo.find({ userId }).select('id').lean();
    const workoutIds = workoutDocs.map((doc) => doc.id);

    await withTransaction(async (session) => {
      // Delete workouts
      await WorkoutMongo.deleteMany({ userId }, { session });

      // Delete associated workout lines
      if (workoutIds.length > 0) {
        await WorkoutLineMongo.deleteMany(
          { workoutId: { $in: workoutIds } },
          { session },
        );
      }
    });
  }

  private toWorkoutEntity(doc: PopulatedWorkoutDoc): Workout | null {
    if (!doc.workoutLines || doc.workoutLines.length === 0) {
      return null;
    }

    const exercises = doc.workoutLines
      .filter((line) => line.exercise)
      .map((line) => WorkoutLine.create(line));

    if (exercises.length === 0) {
      return null;
    }

    return Workout.create({
      id: doc.id,
      userId: doc.userId,
      name: doc.name,
      workoutTemplateId: doc.workoutTemplateId,
      exercises,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    });
  }

  private toWorkoutEntities(docs: PopulatedWorkoutDoc[]): Workout[] {
    return docs
      .map((doc) => this.toWorkoutEntity(doc))
      .filter((workout): workout is Workout => workout !== null);
  }
}
