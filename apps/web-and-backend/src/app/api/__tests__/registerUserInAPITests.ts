import type { NextRequest } from "next/server";

import { POST } from "../auth/register/route";
import { testUserPassword } from "./common";

type RegisterPayload = {
  name: string;
  email: string;
  plainPassword: string;
};

export async function registerUserInAPITests(
  email: string,
  name: string,
): Promise<void> {
  const plainPassword: string = testUserPassword;

  const payload: RegisterPayload = { email, plainPassword, name };

  const request = new Request("http://localhost/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }) as NextRequest;

  await POST(request);
}
