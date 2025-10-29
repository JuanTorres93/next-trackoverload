import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { UpdateUserUsecase } from '@/application-layer/use-cases/user/UpdateUser/UpdateUser.usecase';

export const AppUpdateUserUsecase = new UpdateUserUsecase(AppUsersRepo);
