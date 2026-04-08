import { getAllWorkoutTemplatesForLoggedInUser } from "@/app/_features/workouttemplate/actions";
import PageWrapper from "@/app/_ui/PageWrapper";
import { WorkoutTemplateDTO } from "@/application-layer/dtos/WorkoutTemplateDTO";

import TemplatesDisplay from "./TemplatesDisplay";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plantillas de entrenamiento",
  description: "Todas tus plantillas de entrenamiento",
};

export default async function TemplatesPage() {
  const templates: WorkoutTemplateDTO[] =
    await getAllWorkoutTemplatesForLoggedInUser();

  return (
    <PageWrapper className="max-w-5xl">
      <TemplatesDisplay templates={templates} />
    </PageWrapper>
  );
}
