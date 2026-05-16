import { LoginUsecase } from '../../../../../application-layer/use-cases/auth/Login/Login.usecase';
import { AppUsersRepo } from '../../../repos/AppUsersRepo';
import { AppPasswordEncryptorService } from '../../../services/AppPasswordEncryptorService';

export const AppLoginUsecase = new LoginUsecase(
  AppUsersRepo,
  AppPasswordEncryptorService,
);
