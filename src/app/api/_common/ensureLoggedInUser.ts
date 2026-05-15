import { NextResponse } from "next/server";

import { JSENDFailure } from "@/app/_types/JSEND";
import { getCurrentUserId } from "@/app/_utils/auth/getCurrentUserId";

export async function ensureLoggedInUser(): Promise<{
  currentUserId: string;
  notLoggedInResponse: NextResponse<JSENDFailure> | null;
}> {
  const currentUserId = await getCurrentUserId();
  let notLoggedInResponse: NextResponse<JSENDFailure> | null = null;

  if (!currentUserId) {
    const errorResponse: JSENDFailure = {
      status: "fail",
      data: { message: "Unauthorized: client ID is missing" },
    };

    notLoggedInResponse = NextResponse.json(errorResponse, { status: 401 });
  }

  return {
    currentUserId,
    notLoggedInResponse,
  };
}
