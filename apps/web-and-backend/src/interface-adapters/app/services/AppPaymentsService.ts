import { MemoryPaymentsService } from "../../../infra/services/PaymentsService/MemoryPaymentsService/MemoryPaymentsService";
import { StripePaymentsService } from "../../../infra/services/PaymentsService/StripePaymentsService/StripePaymentsService";
import { injectFor_ProductionDevelopment_Test } from "../../common/injectFor_ProductionDevelopment_Test";

const AppPaymentsService: StripePaymentsService | MemoryPaymentsService =
  await injectFor_ProductionDevelopment_Test(
    StripePaymentsService,
    MemoryPaymentsService,
  );

export { AppPaymentsService };
