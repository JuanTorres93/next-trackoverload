import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { GetAllUsersUsecase } from '@/application-layer/use-cases/user/GetAllUsers/GetAllUsers.usecase';

export const AppGetAllUsersUsecase = new GetAllUsersUsecase(AppUsersRepo);
