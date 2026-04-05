import { useEffect, useState } from "react";

import { HiMagnifyingGlass } from "react-icons/hi2";

import SearchInput from "@/app/_ui/SearchInput";
import ButtonNew from "@/app/_ui/buttons/ButtonNew";
import { showErrorToast } from "@/app/_ui/showErrorToast";
import { RecipeDTO } from "@/application-layer/dtos/RecipeDTO";

import RecipesGrid from "./RecipesGrid";
import { getAllRecipesForLoggedInUser } from "./actions";
import { useRecipeSearch } from "./useRecipeSearch";

function SelectRecipeForm({
  addMealsRequest,
  onSuccess,
}: {
  addMealsRequest: (recipesIds: string[]) => Promise<void>;
  onSuccess?: () => void;
}) {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [selectedRecipesIds, setSelectedRecipesIds] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isAddingMeals, setIsAddingMeals] = useState<boolean>(false);
  const { query, setQuery, filteredRecipes } = useRecipeSearch(recipes);

  const numberOfSelectedRecipes = selectedRecipesIds.length;
  const invalidForm =
    numberOfSelectedRecipes === 0 || isFetching || isAddingMeals;

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsFetching(true);

      try {
        const recipes = await getAllRecipesForLoggedInUser();

        setRecipes(recipes);
      } catch {
        showErrorToast("Error al cargar las recetas.");
      } finally {
        setIsFetching(false);
      }
    };

    fetchRecipes();
  }, []);

  async function handleCreateMeals() {
    setIsAddingMeals(true);

    try {
      await addMealsRequest(selectedRecipesIds);

      onSuccess?.();
    } catch {
      showErrorToast("Error al añadir las comidas.");
    } finally {
      setIsAddingMeals(false);
    }
  }

  const addButtonLabel =
    numberOfSelectedRecipes > 0
      ? `Añadir comidas (${numberOfSelectedRecipes})`
      : "Añadir comidas";

  return (
    <div className="flex flex-col w-[min(80dvw,48rem)] max-h-[85dvh] max-bp-add-multiple-meals-modal:w-[90dvw]">
      {/* Header — right-padded to avoid overlapping the Modal's close button */}
      <div className="flex items-center justify-between gap-4 pb-5 pr-12 px-7 pt-7 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-text">Tus recetas</h2>

          <p className="text-sm text-text-minor-emphasis mt-0.5">
            {isFetching
              ? "Cargando..."
              : `${recipes.length} receta${recipes.length !== 1 ? "s" : ""}`}
          </p>
        </div>

        <ButtonNew
          disabled={invalidForm}
          isLoading={isAddingMeals}
          onClick={handleCreateMeals}
          className="shrink-0"
        >
          {addButtonLabel}
        </ButtonNew>
      </div>

      {/* Search */}
      <div className="pb-5 px-7 shrink-0">
        <SearchInput
          className="w-full"
          placeholder="Buscar receta..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="h-px mx-7 bg-border/30 shrink-0" />

      <RecipeListContent
        isAddingMeals={isAddingMeals}
        isFetching={isFetching}
        filteredRecipes={filteredRecipes}
        query={query}
        setSelectedRecipesIds={setSelectedRecipesIds}
        selectedRecipesIds={selectedRecipesIds}
      />
    </div>
  );
}

function RecipeListContent({
  isAddingMeals,
  isFetching,
  filteredRecipes,
  query,
  setSelectedRecipesIds,
  selectedRecipesIds,
}: {
  isAddingMeals: boolean;
  isFetching: boolean;
  filteredRecipes: RecipeDTO[];
  query: string;
  setSelectedRecipesIds: React.Dispatch<React.SetStateAction<string[]>>;
  selectedRecipesIds: string[];
}) {
  function handleClickRecipe(recipeId: string) {
    if (selectedRecipesIds.includes(recipeId)) {
      setSelectedRecipesIds((prev) => prev.filter((id) => id !== recipeId));
    } else {
      setSelectedRecipesIds((prev) => [...prev, recipeId]);
    }
  }

  return (
    <div className="flex-1 min-h-0 py-5 overflow-y-auto px-7">
      {isAddingMeals && (
        <p className="py-8 text-sm text-center text-text-minor-emphasis">
          Añadiendo comidas...
        </p>
      )}

      {!isAddingMeals && isFetching && (
        <p className="py-8 text-sm text-center text-text-minor-emphasis">
          Cargando recetas...
        </p>
      )}

      {!isAddingMeals && !isFetching && filteredRecipes.length === 0 && (
        <div className="flex flex-col items-center gap-2 py-12 text-text-minor-emphasis">
          <HiMagnifyingGlass className="text-3xl opacity-30" />

          <p className="text-sm">
            {query ? `Sin resultados para "${query}"` : "No hay recetas"}
          </p>
        </div>
      )}

      {!isAddingMeals && !isFetching && filteredRecipes.length > 0 && (
        <RecipesGrid
          asLink={false}
          recipes={filteredRecipes}
          onClick={handleClickRecipe}
          selectedRecipesIds={selectedRecipesIds}
        />
      )}
    </div>
  );
}

export default SelectRecipeForm;
