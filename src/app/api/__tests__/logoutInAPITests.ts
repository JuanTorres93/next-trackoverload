import { AdapterError } from "@/domain/common/errors";
import { MemoryAuthService } from "@/infra/services/AuthService/MemoryAuthService/MemoryAuthService";
import { AppAuthService } from "@/interface-adapters/app/services/AppAuthService";

import { setCurrentlyLoggedInUserIdForTests } from "../../../../tests/mocks/nextjs";
import { POST } from "../auth/logout/route";

const authService = AppAuthService as MemoryAuthService;

export async function logoutInAPITests(): Promise<void> {
  if (!(authService instanceof MemoryAuthService))
    throw new AdapterError(
      "logoutInAPITests: authService is not an instance of MemoryAuthService",
    );

  const token = authService.getLastGeneratedTokenForTesting();
  if (token) {
    authService.revokeToken(token);
  }

  await POST();

  setCurrentlyLoggedInUserIdForTests(null);
}
