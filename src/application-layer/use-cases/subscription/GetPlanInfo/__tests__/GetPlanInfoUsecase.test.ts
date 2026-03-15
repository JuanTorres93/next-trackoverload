import { GetPlanInfoUsecase } from '../GetPlanInfoUsecase';
import { MemoryPaymentsService } from '@/infra/services/PaymentsService/MemoryPaymentsService/MemoryPaymentsService';

describe('GetPlanInfoUsecase', () => {
  let paymentsService: MemoryPaymentsService;
  let usecase: GetPlanInfoUsecase;

  beforeEach(() => {
    paymentsService = new MemoryPaymentsService();
    usecase = new GetPlanInfoUsecase(paymentsService);
  });

  describe('Execution', () => {
    it('should return plan info', async () => {
      const result = await usecase.execute();

      expect(typeof result.title).toBe('string');
      expect(typeof result.description).toBe('string');
      expect(typeof result.priceInEurCents).toBe('number');
    });
  });
});
