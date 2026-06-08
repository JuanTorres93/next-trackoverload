"use client";

import { useState } from "react";

import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import DateHeader from "@/app/app/(with-navbar)/meals/v2/DateHeader";

import RecipeSelector from "./RecipeSelector";

function RecipeSelectionForm({
  hasError,
  recipes,
  ...props
}: {
  hasError: boolean;
  recipes: RecipeDTO[];
} & React.FormHTMLAttributes<HTMLFormElement>) {
  const { className, ...rest } = props;

  const [selectedRecipesIds, setSelectedRecipesIds] = useState<string[]>([]);

  const selectedRecipesCount = selectedRecipesIds.length;

  function toggleRecipeSelection(recipeId: string) {
    setSelectedRecipesIds((prevIds) => {
      if (prevIds.includes(recipeId)) {
        return prevIds.filter((id) => id !== recipeId);
      } else {
        return [...prevIds, recipeId];
      }
    });
  }

  function isRecipeSelected(recipeId: string) {
    return selectedRecipesIds.includes(recipeId);
  }

  return (
    <form
      className={twMerge(
        "grid grid-cols-1 grid-rows-[min-content_1fr_min-content] gap-3 h-full",
        className,
      )}
      {...rest}
    >
      <DateHeader />

      <section className="grid grid-cols-1 grid-rows-[min-content_1fr] gap-4.5 overflow-hidden">
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
          <ul className="flex flex-col items-stretch gap-3 overflow-y-scroll">
            {recipes.map((recipe) => (
              <li key={recipe.id}>
                <RecipeSelector
                  recipe={recipe}
                  checked={isRecipeSelected(recipe.id)}
                  onChange={() => toggleRecipeSelection(recipe.id)}
                  onSelect={() => toggleRecipeSelection(recipe.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <ButtonAction className="self-end" disabled={selectedRecipesCount === 0}>
        Registrar comidas
        {selectedRecipesCount > 0 && <span> ({selectedRecipesCount})</span>}
      </ButtonAction>
    </form>
  );
}

export default RecipeSelectionForm;
