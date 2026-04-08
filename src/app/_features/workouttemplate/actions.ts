"use server";

import { getCurrentUserId } from "@/app/_utils/auth/getCurrentUserId";
import { WorkoutTemplateDTO } from "@/application-layer/dtos/WorkoutTemplateDTO";
import { AppGetAllWorkoutTemplatesForUserUsecase } from "@/interface-adapters/app/use-cases/workouttemplate";

export async function getAllWorkoutTemplatesForLoggedInUser() {
  const userId = await getCurrentUserId();

  const templates: WorkoutTemplateDTO[] =
    await AppGetAllWorkoutTemplatesForUserUsecase.execute({
      actorUserId: userId,
      targetUserId: userId,
    });

  return templates;
}
