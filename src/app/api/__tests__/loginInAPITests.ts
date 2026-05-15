import type { NextRequest } from "next/server";

import { AdapterError } from "@/domain/common/errors";
import { MemoryAuthService } from "@/infra/services/AuthService/MemoryAuthService/MemoryAuthService";
import { AppAuthService } from "@/interface-adapters/app/services/AppAuthService";

import { setCurrentlyLoggedInUserIdForTests } from "../../../../tests/mocks/nextjs";
import { POST } from "../auth/login/route";
import { testUserPassword } from "./common";

export async function loginInAPITests(email: string): Promise<void> {
  const plainPassword = testUserPassword;

  const request = new Request("http://localhost/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, plainPassword }),
  }) as NextRequest;

  await POST(request);

  const authService = AppAuthService as MemoryAuthService;

  if (!(authService instanceof MemoryAuthService))
    throw new AdapterError(
      "loginInAPITests: authService is not an instance of MemoryAuthService",
    );

  const token = authService.getLastGeneratedTokenForTesting();
  if (!token)
    throw new AdapterError(
      "loginInAPITests: no token was generated after login",
    );

  const userId = await authService.getCurrentUserIdFromToken(token);

  setCurrentlyLoggedInUserIdForTests(userId);
}
