import ErrorBox from "@/app/_ui/ErrorBox";

import { getAllWorkoutTemplatesForLoggedInUser } from "../../../_features/workouttemplate/actions";
import PageWrapper from "../../../_ui/PageWrapper";
import TemplatesDisplay from "./TemplatesDisplay";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plantillas de entrenamiento",
  description: "Todas tus plantillas de entrenamiento",
};

export default async function TemplatesPage() {
  const templatesJSEND = await getAllWorkoutTemplatesForLoggedInUser();

  const hasError = templatesJSEND.status !== "success";

  return (
    <PageWrapper className="max-w-5xl">
      {hasError && (
        <ErrorBox>
          Ocurrió un error al cargar tus plantillas de entrenamiento. Por favor,
          intenta recargar la página.
        </ErrorBox>
      )}

      {!hasError && <TemplatesDisplay templates={templatesJSEND.data} />}
    </PageWrapper>
  );
}
