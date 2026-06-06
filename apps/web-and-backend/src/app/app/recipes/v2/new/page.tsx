import Screen from "@/app/_ui/Screen";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";
import FormLabelInput from "@/app/_ui/user-input/FormLabelInput";
import SearchBar from "@/app/_ui/user-input/SearchBar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Crear Receta",
  description: "Crea una nueva receta",
};

export default async function CreateRecipePage() {
  return (
    <Screen title="Crear Receta">
      <form className="flex flex-col gap-6.5" action="">
        <FormLabelInput
          label="Nombre de la receta"
          id="name"
          placeholder="Nombre de la receta"
        />

        <div>
          <AppSectionTitle>Ingredientes:</AppSectionTitle>

          <SearchBar placeholder="Buscar ingredientes..." />
        </div>
      </form>
    </Screen>
  );
}
