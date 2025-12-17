import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutLine } from '@/domain/entities/workoutline/WorkoutLine';
import fs from 'fs/promises';
import path from 'path';

type WorkoutLineData = {
  id: string;
  workoutId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight: number;
  createdAt: string;
  updatedAt: string;
};

type WorkoutData = {
  id: string;
  userId: string;
  name: string;
  workoutTemplateId: string;
  exercises: WorkoutLineData[];
  createdAt: string;
  updatedAt: string;
};

export class FileSystemWorkoutsRepo implements WorkoutsRepo {
  private readonly workoutsDir: string;
  private readonly workoutLinesDir: string;

  constructor(
    workoutsBaseDir: string = './data/workouts',
    workoutLinesBaseDir: string = './data/workoutlines'
  ) {
    this.workoutsDir = workoutsBaseDir;
    this.workoutLinesDir = workoutLinesBaseDir;
  }

  private async ensureDataDirs(): Promise<void> {
    try {
      await fs.mkdir(this.workoutsDir, { recursive: true });
      await fs.mkdir(this.workoutLinesDir, { recursive: true });
    } catch {
      // Directories might already exist
    }
  }

  private getWorkoutFilePath(id: string): string {
    return path.join(this.workoutsDir, `${id}.json`);
  }

  private getWorkoutLineFilePath(id: string): string {
    return path.join(this.workoutLinesDir, `${id}.json`);
  }

  private serializeWorkoutLine(
    line: WorkoutLine,
    workoutId: string
  ): WorkoutLineData {
    return {
      id: line.id,
      workoutId: workoutId,
      exerciseId: line.exerciseId,
      setNumber: line.setNumber,
      reps: line.reps,
      weight: line.weight,
      createdAt: line.createdAt.toISOString(),
      updatedAt: line.updatedAt.toISOString(),
    };
  }

  private deserializeWorkoutLine(data: WorkoutLineData): WorkoutLine {
    return WorkoutLine.create({
      id: data.id,
      workoutId: data.workoutId,
      exerciseId: data.exerciseId,
      setNumber: data.setNumber,
      reps: data.reps,
      weight: data.weight,
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  private serializeWorkout(workout: Workout): WorkoutData {
    return {
      id: workout.id,
      userId: workout.userId,
      name: workout.name,
      workoutTemplateId: workout.workoutTemplateId,
      exercises: workout.exercises.map((line) =>
        this.serializeWorkoutLine(line, workout.id)
      ),
      createdAt: workout.createdAt.toISOString(),
      updatedAt: workout.updatedAt.toISOString(),
    };
  }

  private deserializeWorkout(data: WorkoutData): Workout {
    return Workout.create({
      id: data.id,
      userId: data.userId,
      name: data.name,
      workoutTemplateId: data.workoutTemplateId,
      exercises: data.exercises.map((lineData) =>
        this.deserializeWorkoutLine(lineData)
      ),
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    });
  }

  async saveWorkout(workout: Workout): Promise<void> {
    await this.ensureDataDirs();
    const data = this.serializeWorkout(workout);
    const filePath = this.getWorkoutFilePath(workout.id);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));

    // Save workout lines separately
    for (const line of workout.exercises) {
      const lineData = this.serializeWorkoutLine(line, workout.id);
      const lineFilePath = this.getWorkoutLineFilePath(line.id);
      await fs.writeFile(lineFilePath, JSON.stringify(lineData, null, 2));
    }
  }

  async getAllWorkouts(): Promise<Workout[]> {
    await this.ensureDataDirs();

    try {
      const files = await fs.readdir(this.workoutsDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json'));

      const workouts = await Promise.all(
        jsonFiles.map(async (file) => {
          const filePath = path.join(this.workoutsDir, file);
          const content = await fs.readFile(filePath, 'utf-8');
          const data = JSON.parse(content) as WorkoutData;
          return this.deserializeWorkout(data);
        })
      );

      return workouts;
    } catch {
      return [];
    }
  }

  async getAllWorkoutsByUserId(userId: string): Promise<Workout[]> {
    const allWorkouts = await this.getAllWorkouts();
    return allWorkouts.filter((workout) => workout.userId === userId);
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    const filePath = this.getWorkoutFilePath(id);

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content) as WorkoutData;
      return this.deserializeWorkout(data);
    } catch {
      return null;
    }
  }

  async getWorkoutByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Workout | null> {
    const workout = await this.getWorkoutById(id);
    if (workout && workout.userId === userId) {
      return workout;
    }
    return null;
  }

  async getWorkoutsByTemplateId(templateId: string): Promise<Workout[]> {
    const allWorkouts = await this.getAllWorkouts();
    return allWorkouts.filter(
      (workout) => workout.workoutTemplateId === templateId
    );
  }

  async getWorkoutsByTemplateIdAndUserId(
    templateId: string,
    userId: string
  ): Promise<Workout[]> {
    const allWorkouts = await this.getAllWorkouts();
    return allWorkouts.filter(
      (workout) =>
        workout.workoutTemplateId === templateId && workout.userId === userId
    );
  }

  async deleteWorkout(id: string): Promise<void> {
    const filePath = this.getWorkoutFilePath(id);

    try {
      // Get the workout to find its workout lines
      const workout = await this.getWorkoutById(id);

      // Delete the workout file
      await fs.unlink(filePath);

      // Delete associated workout lines
      if (workout) {
        for (const line of workout.exercises) {
          const lineFilePath = this.getWorkoutLineFilePath(line.id);
          try {
            await fs.unlink(lineFilePath);
          } catch {
            // Line file might not exist
          }
        }
      }
    } catch {
      // File might not exist, consistent with memory repo
    }
  }

  async deleteAllWorkoutsForUser(userId: string): Promise<void> {
    const allWorkouts = await this.getAllWorkouts();
    const userWorkouts = allWorkouts.filter((w) => w.userId === userId);

    await Promise.all(
      userWorkouts.map(async (workout) => {
        const filePath = this.getWorkoutFilePath(workout.id);
        try {
          await fs.unlink(filePath);
          // Delete associated workout lines
          for (const line of workout.exercises) {
            const lineFilePath = this.getWorkoutLineFilePath(line.id);
            try {
              await fs.unlink(lineFilePath);
            } catch {
              // Line file might not exist
            }
          }
        } catch {
          // Workout file might not exist
        }
      })
    );
  }
}
