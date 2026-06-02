import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { JSENDResponse } from "shared";

import { AppAuthService } from "../../../../interface-adapters/app/services/AppAuthService";
import { AppLoginUsecase } from "../../../../interface-adapters/app/use-cases/auth/Login/login";
import { handleKnownErrors } from "../../_common/handleKnownErrors";
import { cookieSessionMaxAgeInSeconds, cookieSessionName } from "../cookie";

export async function POST(
  _req: NextRequest,
): Promise<NextResponse<JSENDResponse<string>>> {
  try {
    const body = await _req.json();
    const { email, plainPassword } = body;

    const newUser = await AppLoginUsecase.execute({
      email,
      plainPassword,
    });

    const token = await AppAuthService.generateToken(newUser.id);

    const response = NextResponse.json(
      {
        status: "success" as const,
        data: "User logged in successfully",
      },
      { status: 200 },
    );

    response.cookies.set(cookieSessionName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: cookieSessionMaxAgeInSeconds,
    });

    return response;
  } catch (error) {
    console.error("app/api/auth/login: Error logging in user:", error);

    return handleKnownErrors(error as Error);
  }
}
