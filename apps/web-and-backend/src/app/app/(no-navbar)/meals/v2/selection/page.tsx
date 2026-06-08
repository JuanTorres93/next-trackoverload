import { JSENDResponse, RecipeDTO } from "shared";

import DaySelector, {
  SelectedDays,
} from "@/app/_features/meal/redesign/DaySelector";
import { getAllRecipesForLoggedInUser } from "@/app/_features/recipe/actions";
import Screen from "@/app/_ui/Screen";
import ButtonAction from "@/app/_ui/buttons/ButtonAction";

import DateHeader from "./DateHeader";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Selecciona recetas",
  description: "Selecciona recetas para registrar",
};

export default async function SelectMealsPage() {
  const recipesResponse: JSENDResponse<RecipeDTO[]> =
    await getAllRecipesForLoggedInUser();

  const hasError = recipesResponse.status !== "success";

  const recipes =
    recipesResponse.status === "success" ? recipesResponse.data : [];

  return (
    <Screen title="Selecciona recetas para registrar" hasBackButton>
      <form
        className="grid grid-cols-1 grid-rows-[min-content_min-content_min-content_1fr] gap-3 h-full"
        action=""
      >
        <DateHeader />

        <section>
          <h2 className="text-[20px] font-semibold">
            Selecciona las comidas a registrar
          </h2>

          {hasError && (
            <span>
              Hubo un error al cargar tus recetas. Por favor, inténtalo de nuevo
              más tarde.
            </span>
          )}

          {!hasError && (
            <ul>
              {recipes.map((recipe) => (
                <li key={recipe.id} className="flex items-center gap-4">
                  <span>{recipe.name}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <ButtonAction className="self-end">Registrar comidas</ButtonAction>
      </form>
    </Screen>
  );
}
