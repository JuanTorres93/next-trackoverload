import { Workout } from '../entities/workout/Workout';

export interface WorkoutsRepo {
  getAllWorkouts(): Promise<Workout[]>;
  getWorkoutById(id: string): Promise<Workout | null>;
  saveWorkout(workout: Workout): Promise<void>;
  deleteWorkout(id: string): Promise<void>;
}
