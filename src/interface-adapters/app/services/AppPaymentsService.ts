import { MemoryPaymentsService } from '@/infra/services/PaymentsService/MemoryPaymentsService/MemoryPaymentsService';
import { StripePaymentsService } from '@/infra/services/PaymentsService/StripePaymentsService/StripePaymentsService';

let AppPaymentsService: StripePaymentsService | MemoryPaymentsService;

if (process.env.NODE_ENV === 'test') {
  AppPaymentsService = new MemoryPaymentsService();
} else {
  AppPaymentsService = new StripePaymentsService();
}

export { AppPaymentsService };
