import { HiSearch } from 'react-icons/hi';
import IngredientSearch from './IngredientSearch';

function ArrangedIngredientSearch({ isLoading }: { isLoading: boolean }) {
  return (
    <div className="flex items-center gap-2">
      {/* Unified search bar: icon + input in one pill */}
      <div className="flex items-center flex-1 gap-2 px-3 transition-all border rounded-xl border-border bg-input-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
        <HiSearch className="text-lg text-text-minor-emphasis shrink-0" />

        <IngredientSearch.SearchTermInput
          className="flex-1 min-w-0 py-1.5"
          inputContainerClassName="border-0 bg-transparent rounded-none min-w-0 px-0 py-0 shadow-none"
          disabled={isLoading}
        />
      </div>

      {/* Search action button */}
      <IngredientSearch.SearchButton disabled={isLoading} />

      {/* Barcode scanner */}
      <IngredientSearch.BarcodeSearch disabled={isLoading} />
    </div>
  );
}

export default ArrangedIngredientSearch;
