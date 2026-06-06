import PageTitle from "@/app/_ui/typography/PageTitle";

import NewTemplateForm from "../../../../_features/workouttemplate/NewTemplateForm";
import PageWrapper from "../../../../_ui/PageWrapper";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nueva plantilla de entrenamiento",
  description: "Crea una nueva plantilla de entrenamiento",
};

export default async function NewTemplatePage() {
  return (
    <PageWrapper className="max-w-5xl">
      <PageTitle
        title="Nueva plantilla de entrenamiento"
        subtitle="Crea una nueva plantilla de entrenamiento"
        className="mb-6"
      />

      <NewTemplateForm />
    </PageWrapper>
  );
}
