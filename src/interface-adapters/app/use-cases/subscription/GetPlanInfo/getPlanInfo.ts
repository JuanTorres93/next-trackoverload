import { GetPlanInfoUsecase } from '@/application-layer/use-cases/subscription/GetPlanInfo/GetPlanInfoUsecase';
import { AppPaymentsService } from '@/interface-adapters/app/services/AppPaymentsService';

export const AppGetPlanInfoUsecase = new GetPlanInfoUsecase(AppPaymentsService);
