import { Workout } from '../entities/workout/Workout';

export interface WorkoutsRepo {
  getAllWorkouts(): Promise<Workout[]>;
  getAllWorkoutsByUserId(userId: string): Promise<Workout[]>;
  getWorkoutById(id: string): Promise<Workout | null>;
  getWorkoutByIdAndUserId(id: string, userId: string): Promise<Workout | null>;
  getWorkoutsByTemplateId(templateId: string): Promise<Workout[]>;
  getWorkoutsByTemplateIdAndUserId(
    templateId: string,
    userId: string
  ): Promise<Workout[]>;
  saveWorkout(workout: Workout): Promise<void>;
  deleteWorkout(id: string): Promise<void>;
  deleteAllWorkoutsForUser(userId: string): Promise<void>;
}
