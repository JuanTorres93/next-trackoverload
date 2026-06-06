import Screen from "@/app/_ui/Screen";
import FormLabelInput from "@/app/_ui/user-input/FormLabelInput";
import Input from "@/app/_ui/user-input/Input";
import Label from "@/app/_ui/user-input/Label";
import SearchBar from "@/app/_ui/user-input/SearchBar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Crear Receta",
  description: "Crea una nueva receta",
};

export default async function CreateRecipePage() {
  return (
    <Screen title="Crear Receta">
      <FormLabelInput
        label="Nombre de la receta"
        id="name"
        placeholder="Nombre de la receta"
      />

      <SearchBar placeholder="Buscar ingredientes..." />
    </Screen>
  );
}
