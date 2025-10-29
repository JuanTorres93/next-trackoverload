import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { DeleteUserUsecase } from '@/application-layer/use-cases/user/DeleteUser/DeleteUser.usecase';

export const AppDeleteUserUsecase = new DeleteUserUsecase(AppUsersRepo);
