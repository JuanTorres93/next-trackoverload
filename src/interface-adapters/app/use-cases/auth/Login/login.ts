import { LoginUsecase } from '@/application-layer/use-cases/auth/Login/Login.usecase';
import { AppUsersRepo } from '@/interface-adapters/app/repos/AppUsersRepo';
import { AppPasswordEncryptorService } from '@/interface-adapters/app/services/AppPasswordEncryptorService';

export const AppLoginUsecase = new LoginUsecase(
  AppUsersRepo,
  AppPasswordEncryptorService,
);
