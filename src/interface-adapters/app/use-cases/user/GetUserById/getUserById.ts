import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetUserByIdUsecase } from '@/application-layer/use-cases/user/GetUserById/GetUserById.usecase';

export const AppGetUserByIdUsecase = new GetUserByIdUsecase(AppUsersRepo);
