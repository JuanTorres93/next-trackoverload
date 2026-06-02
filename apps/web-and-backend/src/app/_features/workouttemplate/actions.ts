"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { WorkoutTemplateDTO } from "shared";
import { JSENDResponse } from "shared";

import { CreateWorkoutTemplateUsecaseRequest } from "../../../application-layer/use-cases/workouttemplate/CreateWorkoutTemplate/CreateWorkoutTemplate.usecase";
import { AppGetAllWorkoutTemplatesForUserUsecase } from "../../../interface-adapters/app/use-cases/workouttemplate";
import { AppCreateWorkoutTemplateUsecase } from "../../../interface-adapters/app/use-cases/workouttemplate";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";
import { handleActionErrors } from "../common/handleActionErrors";
import { isNextRedirectError } from "../common/handleNextRedirectError";

export async function getAllWorkoutTemplatesForLoggedInUser(): Promise<
  JSENDResponse<WorkoutTemplateDTO[]>
> {
  try {
    const userId = await getCurrentUserId();

    const templates: WorkoutTemplateDTO[] =
      await AppGetAllWorkoutTemplatesForUserUsecase.execute({
        actorUserId: userId,
        targetUserId: userId,
      });

    return {
      status: "success",
      data: templates,
    };
  } catch (error) {
    return handleActionErrors(error as Error);
  }
}

export async function createWorkoutTemplateForLoggedInUser(
  request: Omit<
    CreateWorkoutTemplateUsecaseRequest,
    "actorUserId" | "targetUserId"
  >,
): Promise<JSENDResponse<void>> {
  try {
    const userId = await getCurrentUserId();

    await AppCreateWorkoutTemplateUsecase.execute({
      actorUserId: userId,
      targetUserId: userId,
      ...request,
    });

    // TODO Change to redirect to the created template's page when that page is implemented
    revalidatePath("/app/templates");
    redirect("/app/templates");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;

    return handleActionErrors(error as Error);
  }
}
