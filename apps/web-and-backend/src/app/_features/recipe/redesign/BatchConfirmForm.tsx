"use client";

import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";

import MealSelectionSection from "../../meal/redesign/MealSelectionList";
import { useRecipeSelection } from "./RecipeSelectionForm";
import RecipeSummary from "./RecipeSummary";

function BatchConfirmForm({
  hasError,
  recipes,
  ...props
}: {
  hasError: boolean;
  recipes: RecipeDTO[];
} & React.FormHTMLAttributes<HTMLFormElement>) {
  const { className, ...rest } = props;

  const { isRecipeSelected } = useRecipeSelection();

  const selectedRecipes = recipes.filter((recipe) =>
    isRecipeSelected(recipe.id),
  );

  return (
    <form
      className={twMerge(
        "grid grid-cols-1 grid-rows-[min-content_min-content_min-content_1fr] gap-6.5 h-full",
        className,
      )}
      {...rest}
      action=""
    >
      <AppSectionTitle className="text-[14px]">
        Estás a punto de registrar lo siguiente
      </AppSectionTitle>

      <MealSelectionSection
        sectionTitle="Confirma y registra"
        hasError={hasError}
      >
        {selectedRecipes.map((recipe) => (
          <li key={recipe.id}>
            <RecipeSummary
              className="bg-white rounded-xl p-3.75"
              recipe={recipe}
            />
          </li>
        ))}
      </MealSelectionSection>

      <ButtonAction className="self-end">
        Confirmar y registrar comidas
      </ButtonAction>
    </form>
  );
}

export default BatchConfirmForm;
