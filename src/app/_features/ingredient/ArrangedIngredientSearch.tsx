import IngredientSearch from './IngredientSearch';

function ArrangedIngredientSearch({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4 max-bp-ingredient-search:grid max-bp-ingredient-search:grid-cols-[1fr_min-content]">
      <IngredientSearch.SearchTermInput
        className="w-full max-w-120 max-bp-ingredient-search:col-span-2"
        disabled={isLoading}
      />

      <IngredientSearch.SearchButton disabled={isLoading} />

      <div className="max-bp-ingredient-search:justify-self-end">
        <IngredientSearch.BarcodeSearch disabled={isLoading} />
      </div>
    </div>
  );
}

export default ArrangedIngredientSearch;
