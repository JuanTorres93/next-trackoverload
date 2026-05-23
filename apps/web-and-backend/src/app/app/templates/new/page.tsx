import NewTemplateForm from "../../../_features/workouttemplate/NewTemplateForm";
import PageWrapper from "../../../_ui/PageWrapper";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nueva plantilla de entrenamiento",
  description: "Crea una nueva plantilla de entrenamiento",
};

export default async function NewTemplatePage() {
  return (
    <PageWrapper className="max-w-5xl">
      <div className="mb-6">
        <h1 className="mb-1 text-2xl font-bold text-text">Nueva receta</h1>

        <p className="text-sm text-text-minor-emphasis">
          Busca ingredientes y ajusta las cantidades
        </p>
      </div>

      <NewTemplateForm />
    </PageWrapper>
  );
}
