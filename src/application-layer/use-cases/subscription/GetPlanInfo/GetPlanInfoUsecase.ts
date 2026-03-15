import {
  PaymentsService,
  PlanInfo,
} from '@/domain/services/PaymentsService.port';

export class GetPlanInfoUsecase {
  constructor(private paymentsService: PaymentsService) {}

  async execute(): Promise<PlanInfo> {
    return await this.paymentsService.getPlanInfo();
  }
}
