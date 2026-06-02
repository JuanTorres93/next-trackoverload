export type WorkoutLineDTO = {
  id: string;
  workoutId: string;
  exerciseId: string;

  setNumber: number;
  reps: number;
  weightInKg: number;

  createdAt: string;
  updatedAt: string;
};
