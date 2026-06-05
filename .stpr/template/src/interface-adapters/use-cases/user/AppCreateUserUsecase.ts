import { CreateUserUsecase } from '@/application-layer/use-cases/CreateUserUsecase/CreateUserUsecase';
import { AppUsersRepo } from '@/interface-adapters/repos/AppUsersRepo';
import { AppIdGenerator } from '@/interface-adapters/services/AppIdGenerator';
import { AppPasswordHasher } from '@/interface-adapters/services/AppPasswordHasher';

export const AppCreateUserUsecase = new CreateUserUsecase(
  AppUsersRepo,
  AppIdGenerator,
  AppPasswordHasher,
);
