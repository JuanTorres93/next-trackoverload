import { CreateUserUsecase } from '@/application-layer/use-cases/user/CreateUser/CreateUser.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '@/interface-adapters/app/services/AppUuidV4IdGenerator';
import { AppPasswordEncryptorService } from '@/interface-adapters/app/services/AppPasswordEncryptorService';

export const AppCreateUserUsecase = new CreateUserUsecase(
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppPasswordEncryptorService,
);
