import { HiSearch } from "react-icons/hi";

import ArrangedIngredientSearch from "../../ingredient/ArrangedIngredientSearch";
import IngredientSearch from "../../ingredient/IngredientSearch";

function IngredientsPanel({
  isLoading,
  hasIngredients,
}: {
  isLoading: boolean;
  hasIngredients: boolean;
}) {
  return (
    <div className="flex flex-col flex-1 min-w-0 gap-5">
      <ArrangedIngredientSearch isLoading={isLoading} />

      <IngredientSearch.FoundIngredientsList />

      {hasIngredients && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border/30" />

          <p className="text-xs font-semibold tracking-wide uppercase text-text-minor-emphasis">
            Ingredientes añadidos
          </p>
          <div className="flex-1 h-px bg-border/30" />
        </div>
      )}

      {!hasIngredients && (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-text-minor-emphasis/50">
          <HiSearch className="text-4xl" />

          <div className="text-center">
            <p className="text-sm font-semibold">Sin ingredientes todavía</p>

            <p className="mt-1 text-xs">
              Busca arriba y selecciona los ingredientes de tu receta
            </p>
          </div>
        </div>
      )}

      <IngredientSearch.SelectedIngredientsList
        showIngredientLabel={false}
        hideEmptyState
      />
    </div>
  );
}

export default IngredientsPanel;
