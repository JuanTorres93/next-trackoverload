"use client";

import { useContext, useState } from "react";
import { createContext } from "react";

import { RecipeDTO } from "shared";
import { twMerge } from "tailwind-merge";

import ButtonAction from "@/app/_ui/buttons/ButtonAction";
import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";
import AppSubsectionTitle from "@/app/_ui/typography/AppSubsectionTitle";

import { useDaySelector } from "../../meal/redesign/DaySelector";
import MealSelectionList from "../../meal/redesign/MealSelectionList";
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

  const { toggleRecipeSelection, isRecipeSelected, selectedRecipesCount } =
    useRecipeSelection();
  const { getFormattedRangeString, daysCount } = useDaySelector();

  return (
    <form
      className={twMerge(
        "grid grid-cols-1 grid-rows-[min-content_1fr_min-content] gap-5.5 h-full",
        className,
      )}
      {...rest}
    >
      <section>
        <AppSubsectionTitle className="pb-1.5">
          {daysCount} día{daysCount > 1 && "s"} seleccionado
          {daysCount > 1 && "s"}
        </AppSubsectionTitle>

        <AppSectionTitle className="pb-0">
          {getFormattedRangeString()}
        </AppSectionTitle>
      </section>

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
          <MealSelectionList>
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
          </MealSelectionList>
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

const RecipeSelectionContext = createContext<{
  selectedRecipesIds: string[];
  setSelectedRecipesIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleRecipeSelection: (recipeId: string) => void;
  isRecipeSelected: (recipeId: string) => boolean;
  selectedRecipesCount: number;
}>({
  selectedRecipesIds: [],
  setSelectedRecipesIds: () => {},
  toggleRecipeSelection: () => {},
  isRecipeSelected: () => false,
  selectedRecipesCount: 0,
});

export function RecipeSelectionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <RecipeSelectionContext.Provider
      value={{
        selectedRecipesIds,
        toggleRecipeSelection,
        selectedRecipesCount,
        setSelectedRecipesIds,
        isRecipeSelected,
      }}
    >
      {children}
    </RecipeSelectionContext.Provider>
  );
}

export function useRecipeSelection() {
  const context = useContext(RecipeSelectionContext);

  if (!context) {
    throw new Error(
      "useRecipeSelection must be used within a RecipeSelectionProvider",
    );
  }

  return context;
}
