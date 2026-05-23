"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { WorkoutTemplateDTO } from "../../../application-layer/dtos/WorkoutTemplateDTO";
import { CreateWorkoutTemplateUsecaseRequest } from "../../../application-layer/use-cases/workouttemplate/CreateWorkoutTemplate/CreateWorkoutTemplate.usecase";
import { AppGetAllWorkoutTemplatesForUserUsecase } from "../../../interface-adapters/app/use-cases/workouttemplate";
import { AppCreateWorkoutTemplateUsecase } from "../../../interface-adapters/app/use-cases/workouttemplate";
import { getCurrentUserId } from "../../_utils/auth/getCurrentUserId";

export async function getAllWorkoutTemplatesForLoggedInUser() {
  const userId = await getCurrentUserId();

  const templates: WorkoutTemplateDTO[] =
    await AppGetAllWorkoutTemplatesForUserUsecase.execute({
      actorUserId: userId,
      targetUserId: userId,
    });

  return templates;
}

export async function createWorkoutTemplateForLoggedInUser(
  request: Omit<
    CreateWorkoutTemplateUsecaseRequest,
    "actorUserId" | "targetUserId"
  >,
) {
  const userId = await getCurrentUserId();

  await AppCreateWorkoutTemplateUsecase.execute({
    actorUserId: userId,
    targetUserId: userId,
    ...request,
  });

  // TODO Change to redirect to the created template's page when that page is implemented
  revalidatePath("/app/templates");
  redirect("/app/templates");
}
