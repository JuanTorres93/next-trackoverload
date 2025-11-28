import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';
import { WorkoutDTO, toWorkoutDTO } from '@/application-layer/dtos/WorkoutDTO';
import { Id } from '@/domain/value-objects/Id/Id';
import { BaseFileSystemRepo } from './BaseFileSystemRepo';

export class FileSystemWorkoutsRepo
  extends BaseFileSystemRepo<Workout>
  implements WorkoutsRepo
{
  constructor() {
    super('workouts.json');
  }

  protected getItemId(item: Workout): string {
    return item.id;
  }

  protected serializeItems(items: Workout[]): WorkoutDTO[] {
    return items.map(toWorkoutDTO);
  }

  protected deserializeItems(data: unknown[]): Workout[] {
    return (data as WorkoutDTO[]).map((item) =>
      Workout.create({
        ...item,
        id: Id.create(item.id),
        userId: Id.create(item.userId),
        workoutTemplateId: Id.create(item.workoutTemplateId),
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt),
      })
    );
  }

  async saveWorkout(workout: Workout): Promise<void> {
    return this.saveItem(workout);
  }

  async getAllWorkouts(): Promise<Workout[]> {
    return this.getAllItems();
  }

  async getAllWorkoutsByUserId(userId: string): Promise<Workout[]> {
    const workouts = await this.getAllItems();
    return workouts.filter((workout) => workout.userId === userId);
  }

  async getWorkoutById(id: string): Promise<Workout | null> {
    return this.getItemById(id);
  }

  async getWorkoutByIdAndUserId(
    id: string,
    userId: string
  ): Promise<Workout | null> {
    const workout = await this.getItemById(id);
    return workout && workout.userId === userId ? workout : null;
  }

  async getWorkoutsByTemplateId(templateId: string): Promise<Workout[]> {
    const workouts = await this.getAllItems();
    return workouts.filter(
      (workout) => workout.workoutTemplateId === templateId
    );
  }

  async getWorkoutsByTemplateIdAndUserId(
    templateId: string,
    userId: string
  ): Promise<Workout[]> {
    const workouts = await this.getAllItems();
    return workouts.filter(
      (workout) =>
        workout.workoutTemplateId === templateId && workout.userId === userId
    );
  }

  async deleteWorkout(id: string): Promise<void> {
    return this.deleteItemById(id);
  }
}
