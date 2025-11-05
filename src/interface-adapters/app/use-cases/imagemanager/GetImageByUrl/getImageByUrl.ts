import { AppImageManager } from '@/interface-adapters/app/services/AppImageManager';
import { GetImageByUrlUsecase } from '@/application-layer/use-cases/imagemanager/GetImageByUrl/GetImageByUrl.usecase';

export const AppGetImageByUrlUsecase = new GetImageByUrlUsecase(
  AppImageManager
);
