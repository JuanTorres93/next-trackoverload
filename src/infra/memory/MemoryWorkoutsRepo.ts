import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { NotFoundError } from '@/domain/common/errors';

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

  async getWorkoutById(id: string): Promise<Workout | null> {
    const workout = this.workouts.find((w) => w.id === id);
    return workout || null;
  }

  async deleteWorkout(id: string): Promise<void> {
    const index = this.workouts.findIndex((w) => w.id === id);
    if (index === -1)
      throw new NotFoundError('MemoryWorkoutsRepo: Workout not found');

    this.workouts.splice(index, 1);
  }
}
