import { MemoryPaymentsService } from "@/infra/services/PaymentsService/MemoryPaymentsService/MemoryPaymentsService";
import { AppPaymentsService } from "@/interface-adapters/app/services/AppPaymentsService";

import { GET } from "../route";

describe("GET /api/subscription/plan", () => {
  let paymentsService: MemoryPaymentsService;

  beforeEach(() => {
    paymentsService = AppPaymentsService as MemoryPaymentsService;
  });

  it("returns JSEND format", async () => {
    const response = await GET();
    const data = await response.json();

    expect(data).toHaveProperty("status");
    expect(data).toHaveProperty("data");
  });

  it("should return plan info", async () => {
    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty("status", "success");
    expect(data.data).toHaveProperty("title");
    expect(data.data).toHaveProperty("description");
    expect(data.data).toHaveProperty("priceInEurCents");
  });

  it("should return the plan info from the payments service", async () => {
    const expectedPlanInfo = await paymentsService.getPlanInfo();

    const response = await GET();
    const data = await response.json();

    expect(data.data).toEqual(expectedPlanInfo);
  });
});
