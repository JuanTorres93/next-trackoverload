import { WorkoutsRepo } from '@/domain/repos/WorkoutsRepo.port';
import { Workout } from '@/domain/entities/workout/Workout';

export class GetAllWorkoutsUsecase {
  constructor(private workoutsRepo: WorkoutsRepo) {}

  async execute(): Promise<Workout[]> {
    const workouts = await this.workoutsRepo.getAllWorkouts();
    return workouts || [];
  }
}
