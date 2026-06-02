import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AppAuthService } from "../../../../interface-adapters/app/services/AppAuthService";
import { AppCreateUserUsecase } from "../../../../interface-adapters/app/use-cases/user";
import { handleKnownErrors } from "../../_common/handleKnownErrors";
import { cookieSessionMaxAgeInSeconds, cookieSessionName } from "../cookie";

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { email, plainPassword, name } = body;

    const newUser = await AppCreateUserUsecase.execute({
      email,
      plainPassword,
      name,
    });

    const token = await AppAuthService.generateToken(newUser.id);

    const response = NextResponse.json(
      {
        status: "success" as const,
        data: newUser,
      },
      { status: 201 },
    );

    response.cookies.set(cookieSessionName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: cookieSessionMaxAgeInSeconds,
    });

    return response;
  } catch (error) {
    console.error("app/api/auth/register: Error creating user:", error);

    return handleKnownErrors(error as Error);
  }
}
