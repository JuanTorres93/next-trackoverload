import NewTemplateForm from "@/app/_features/workouttemplate/NewTemplateForm";
import PageWrapper from "@/app/_ui/PageWrapper";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Nueva plantilla de entrenamiento",
  description: "Crea una nueva plantilla de entrenamiento",
};

export default async function NewTemplatePage() {
  return (
    <PageWrapper className="max-w-5xl">
      <NewTemplateForm />
    </PageWrapper>
  );
}
