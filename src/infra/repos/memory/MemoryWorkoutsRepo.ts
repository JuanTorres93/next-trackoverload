import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';

export class MemoryWorkoutsRepo implements WorkoutsRepo {
  private workouts: Workout[] = [];

  async saveWorkout(workout: Workout): Promise<void> {
    const existingIndex = this.workouts.findIndex((w) => w.id === workout.id);

    if (existingIndex !== -1) {
      this.workouts[existingIndex] = workout;
    } else {
      this.workouts.push(workout);
    }
  }

  async getAllWorkouts(): Promise<Workout[]> {
    return [...this.workouts];
  }

  async getAllWorkoutsByUserId(userId: string): Promise<Workout[]> {
    return this.workouts.filter((w) => w.userId === userId);
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    const workout = this.workouts.find((w) => w.id === id);
    return workout || null;
  }

  async getWorkoutByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Workout | null> {
    const workout = this.workouts.find(
      (w) => w.id === id && w.userId === userId
    );
    return workout || null;
  }

  async getWorkoutsByTemplateId(templateId: string): Promise<Workout[]> {
    return this.workouts.filter((w) => w.workoutTemplateId === templateId);
  }

  async getWorkoutsByTemplateIdAndUserId(
    templateId: string,
    userId: string
  ): Promise<Workout[]> {
    return this.workouts.filter(
      (w) => w.workoutTemplateId === templateId && w.userId === userId
    );
  }

  async deleteWorkout(id: string): Promise<void> {
    const index = this.workouts.findIndex((w) => w.id === id);
    // NOTE: Throw error in use case in order not to have false positives in tests
    if (index === -1) return Promise.reject(null);

    this.workouts.splice(index, 1);
  }

  async deleteAllWorkoutsForUser(userId: string): Promise<void> {
    this.workouts = this.workouts.filter((w) => w.userId !== userId);
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  clearForTesting(): void {
    this.workouts = [];
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  countForTesting(): number {
    return this.workouts.length;
  }

  // IMPORTANT NOTE: Helper method for testing - not part of the interface
  getAllForTesting(): Workout[] {
    return [...this.workouts];
  }
}
