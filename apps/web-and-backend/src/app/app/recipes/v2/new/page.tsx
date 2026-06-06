import { IngredientLineDTO } from "shared";

import IngredientLine from "@/app/_features/recipe/redesign/IngredientLine";
import Screen from "@/app/_ui/Screen";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";
import AppSubsectionTitle from "@/app/_ui/typography/AppSubsectionTitle";
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

          <div className="pt-3">
            <AppSubsectionTitle>Ingredientes seleccionados:</AppSubsectionTitle>

            <div className="flex flex-col gap-2">
              {mockIngredientLines.map((line) => (
                <IngredientLine key={line.id} ingredientLine={line} />
              ))}
            </div>
          </div>
        </div>
      </form>
    </Screen>
  );
}

const mockIngredientLines: IngredientLineDTO[] = [
  {
    id: "1",
    ingredient: {
      id: "1",
      category: "Vegetales",
      name: "Tomate",
      nutritionalInfoPer100g: {
        calories: 18,
        protein: 0.9,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    calories: 18,
    protein: 0.9,
    parentId: "recipe",
    parentType: "recipe",
    quantityInGrams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    ingredient: {
      id: "2",
      category: "Vegetales",
      name: "Lechuga",
      nutritionalInfoPer100g: {
        calories: 15,
        protein: 1.4,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    calories: 15,
    protein: 1.4,
    parentId: "recipe",
    parentType: "recipe",
    quantityInGrams: 100,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
