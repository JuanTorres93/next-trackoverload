import { AppDaysRepo } from '@/interface-adapters/app/repos/AppDaysRepo';
import { GetDayByIdUsecase } from '@/application-layer/use-cases/day/GetDayById/GetDayById.usecase';

export const AppGetDayByIdUsecase = new GetDayByIdUsecase(AppDaysRepo);
