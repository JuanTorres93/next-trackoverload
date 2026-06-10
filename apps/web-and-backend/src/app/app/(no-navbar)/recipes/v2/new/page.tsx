import { IngredientLineDTO } from "shared";

import IngredientLine from "@/app/_features/recipe/redesign/IngredientLine";
import ListFoundIngredient from "@/app/_features/recipe/redesign/ListFoundIngredient";
import MacroSummary from "@/app/_features/recipe/redesign/MacroSummary";
import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import FormLabelInput from "@/app/_ui/form/redesign/FormLabelInput";
import Screen from "@/app/_ui/screen/Screen";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";
import AppSubsectionTitle from "@/app/_ui/typography/AppSubsectionTitle";
import Input from "@/app/_ui/user-input/Input";
import SearchBar from "@/app/_ui/user-input/SearchBar";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Crear Receta",
  description: "Crea una nueva receta",
};

export default async function CreateRecipePage() {
  const calories = formatToInteger(
    mockIngredientLines.reduce((sum, line) => sum + line.calories, 0),
  );
  const protein = formatToInteger(
    mockIngredientLines.reduce((sum, line) => sum + line.protein, 0),
  );

  return (
    <Screen title="Crear Receta" hasBackButton>
      <form
        className="grid grid-cols-1 grid-rows-[min-content_min-content_min-content_1fr] gap-6.5 h-full"
        action=""
      >
        <FormLabelInput htmlFor="name" label="Nombre de la receta">
          <Input id="name" placeholder="Nombre de la receta" type="text" />
        </FormLabelInput>

        <div>
          <AppSectionTitle>Ingredientes:</AppSectionTitle>

          <SearchBar placeholder="Buscar ingredientes..." />

          <ListFoundIngredient
            ingredients={[
              mockIngredient,
              { ...mockIngredient, id: "2", name: "Lechuga" },
            ]}
          />

          <div className="pt-3">
            <AppSubsectionTitle>Ingredientes seleccionados:</AppSubsectionTitle>

            <div className="flex flex-col gap-2">
              {mockIngredientLines.map((line) => (
                <IngredientLine key={line.id} ingredientLine={line} />
              ))}
            </div>
          </div>
        </div>

        <MacroSummary calories={calories} protein={protein} />

        <ButtonAction className="self-end">Guardar Receta</ButtonAction>
      </form>
    </Screen>
  );
}

const mockIngredient = {
  id: "1",
  category: "Vegetales",
  name: "Tomate",
  nutritionalInfoPer100g: {
    calories: 18,
    protein: 0.9,
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

const mockIngredientLines: IngredientLineDTO[] = [
  {
    id: "1",
    ingredient: {
      ...mockIngredient,
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
