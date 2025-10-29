import { AppWorkoutsRepo } from '@/interface-adapters/app/repos/AppWorkoutsRepo';
import { GetWorkoutsByTemplateForUserUsecase } from '@/application-layer/use-cases/workout/GetWorkoutsByTemplateForUser/GetWorkoutsByTemplateForUser.usecase';

export const AppGetWorkoutsByTemplateForUserUsecase =
  new GetWorkoutsByTemplateForUserUsecase(AppWorkoutsRepo);
