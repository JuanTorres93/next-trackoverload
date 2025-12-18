import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { CreateUserUsecase } from '@/application-layer/use-cases/user/CreateUser/CreateUser.usecase';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';

export const AppCreateUserUsecase = new CreateUserUsecase(
  AppUsersRepo,
  AppUuidV4IdGenerator
);
