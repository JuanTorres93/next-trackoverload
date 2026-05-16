import { CreateUserUsecase } from '../../../../application-layer/use-cases/user/CreateUser/CreateUser.usecase';
import { AppUsersRepo } from '../../repos/AppUsersRepo';
import { AppUuidV4IdGenerator } from '../../services/AppUuidV4IdGenerator';
import { AppPasswordEncryptorService } from '../../services/AppPasswordEncryptorService';

export const AppCreateUserUsecase = new CreateUserUsecase(
  AppUsersRepo,
  AppUuidV4IdGenerator,
  AppPasswordEncryptorService,
);
