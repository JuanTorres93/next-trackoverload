import IngredientSearch from "./IngredientSearch";

function ArrangedIngredientSearch({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <IngredientSearch.SearchTermInput
        className="flex-1 min-w-0 py-1.5"
        disabled={isLoading}
      />

      {/* Barcode scanner */}
      <IngredientSearch.BarcodeSearch disabled={isLoading} />
    </div>
  );
}

export default ArrangedIngredientSearch;
