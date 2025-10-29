import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { CreateUserUsecase } from '@/application-layer/use-cases/user/CreateUser/CreateUser.usecase';

export const AppCreateUserUsecase = new CreateUserUsecase(AppUsersRepo);
