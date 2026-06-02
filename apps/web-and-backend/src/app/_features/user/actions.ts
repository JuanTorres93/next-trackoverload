"use server";

import { UserDTO } from "shared";
import { JSENDResponse } from "shared";

import { AppGetUserByIdUsecase } from "../../../interface-adapters/app/use-cases/user";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";
import { handleActionErrors } from "../common/handleActionErrors";

export async function getLoggedInUser(): Promise<
  JSENDResponse<UserDTO | null>
> {
  try {
    const userId = await getCurrentUserId();

    const user = await AppGetUserByIdUsecase.execute({
      actorUserId: userId,
      targetUserId: userId,
    });

    return {
      status: "success",
      data: user,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}
