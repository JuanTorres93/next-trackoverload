"use client";

import { SiMealie } from "react-icons/si";
import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";

import SelectedDays from "../../day/redesign/SelectedDays";
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
        "grid grid-cols-1 grid-rows-[min-content_1fr_min-content] gap-5.5 h-full",
        className,
      )}
      {...rest}
      action=""
    >
      <section className="flex flex-col gap-3">
        <AppSectionTitle className="text-[14px] pb-0">
          Estás a punto de registrar lo siguiente
        </AppSectionTitle>

        <SelectedDays iconContainerClassName="text-secondary-app" />

        <SelectedRecipes />
      </section>

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

function SelectedRecipes({
  iconContainerClassName,
  ...props
}: { iconContainerClassName?: string } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const { selectedRecipesCount } = useRecipeSelection();

  return (
    <aside
      className={twMerge(
        "grid grid-cols-[max-content_1fr_max-content] items-center gap-2.5 p-2.5 bg-white rounded-xl",
        className,
      )}
      {...rest}
    >
      <div
        className={twMerge(
          "flex items-center justify-center p-2.5 bg-background-app rounded-full",
          iconContainerClassName,
        )}
      >
        <SiMealie className="text-secondary-app" size={22} />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-text-minor-emphasis-app font-medium text-[12px]">
          Comidas a registrar
        </span>

        <span className="font-semibold text-[16px]">
          {selectedRecipesCount} comida{selectedRecipesCount !== 1 ? "s" : ""}
        </span>
      </div>
    </aside>
  );
}

export default BatchConfirmForm;
