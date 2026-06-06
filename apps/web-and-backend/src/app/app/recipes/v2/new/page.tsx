import Screen from "@/app/_ui/Screen";
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
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Nombre de la receta</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="Nombre de la receta"
        />
      </div>

      <SearchBar placeholder="Buscar ingredientes..." />
    </Screen>
  );
}
