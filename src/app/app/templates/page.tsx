import Exercise from "@/app/_features/exercise/Exercise";
import PageWrapper from "@/app/_ui/PageWrapper";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Plantillas de entrenamiento",
  description: "Todas tus plantillas de entrenamiento",
};

export default async function TemplatesPage() {
  return (
    <PageWrapper className="max-w-5xl">
      <Exercise
        exercise={{
          name: "Bench Press",
          id: "1",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }}
      />
    </PageWrapper>
  );
}
