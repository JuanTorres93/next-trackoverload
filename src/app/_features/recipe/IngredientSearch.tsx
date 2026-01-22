'use client';
import ButtonSearch from '@/app/_ui/ButtonSearch';
import Input from '@/app/_ui/Input';
import Spinner from '@/app/_ui/Spinner';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { useOutsideClick } from '@/app/hooks/useOutsideClick';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import { createContext, useContext, useState } from 'react';
import IngredientItemMini from '../ingredient/IngredientItemMini';
import IngredientLineItem from '../ingredient/IngredientLineItem';
import { createInMemoryRecipeIngredientLine } from './utils';


type IngredientSearchContextType = {
  showFoundIngredients: boolean;
  ingredientSearchTerm: string;
  setIngredientSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  foundIngredientsResults: IngredientFinderResult[];
  setFoundIngredientsResults: React.Dispatch<
    React.SetStateAction<IngredientFinderResult[]>
  >;
  selectedExternalIngredientIds: Set<string>;
  setSelectedExternalIngredientIds: React.Dispatch<
    React.SetStateAction<Set<string>>
  >;
  handleShowList: () => void;
  handleHideList: () => void;
  fetchIngredients: (term?: string) => Promise<void>;
  isSelected: (externalIngredientId: string) => boolean;
  isLoading: boolean;
};

const IngredientSearchContext =
  createContext<IngredientSearchContextType | null>(null);

function useIngredientSearchContext() {
  const value = useContext(IngredientSearchContext);

  if (value === undefined || value === null) {
    throw new Error(
      'useIngredientSearch must be used within a IngredientSearchProvider',
    );
  }

  return value;
}

function IngredientSearch({ children }: { children: React.ReactNode }) {
  const [showFoundIngredients, setShowList] = useState(false);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [foundIngredientsResults, setFoundIngredientsResults] = useState<
    IngredientFinderResult[]
  >([]);
  const [selectedExternalIngredientIds, setSelectedExternalIngredientIds] =
    useState<Set<string>>(new Set());
  const outsideClickRef = useOutsideClick<HTMLDivElement>(handleHideList);
  const [isLoading, setIsLoading] = useState(false);

  function handleShowList() {
    if (!showFoundIngredients) setShowList(true);
  }

  function handleHideList() {
    if (showFoundIngredients) setShowList(false);
  }

  async function fetchIngredients(term: string = ''): Promise<void> {
    // Use case is used behind the scenes in the API route. It can't be called directly from the client.
    if (!term.trim()) {
      setFoundIngredientsResults([]);
      return;
    }
    setIsLoading(true);

    const fetchedIngredientsResult: Response = await fetch(
      `/api/ingredient/fuzzy/${term}`,
    );

    try {
      const data: IngredientFinderResult[] =
        await fetchedIngredientsResult.json();

      setFoundIngredientsResults(data);
      setIsLoading(false);
    } catch {
      setFoundIngredientsResults([]);
    }
  }


  function isSelected(externalIngredientId: string) {
    return selectedExternalIngredientIds.has(externalIngredientId);
  }

  const contextValue = {
    showFoundIngredients,
    ingredientSearchTerm,
    setIngredientSearchTerm,
    foundIngredientsResults,
    setFoundIngredientsResults,
    selectedExternalIngredientIds,
    setSelectedExternalIngredientIds,
    handleShowList,
    handleHideList,
    fetchIngredients,
    isSelected,
    isLoading,
  };

  return (
    <IngredientSearchContext.Provider value={contextValue}>
      <div ref={outsideClickRef}>{children}</div>
    </IngredientSearchContext.Provider>
  );
}

function Search({className}: {className?: string}) {
  const {
    handleShowList,
    ingredientSearchTerm,
    setIngredientSearchTerm,
    fetchIngredients,
    isLoading,
  } = useIngredientSearchContext();

  return (
    <div className={`grid grid-cols-[1fr_min-content] gap-4  ${className}`}>
      <Input
        value={ingredientSearchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setIngredientSearchTerm(e.target.value);
          handleShowList();
        }}
        disabled={isLoading}
        onClick={handleShowList}
        placeholder="Buscar ingredientes..."
      />

      <ButtonSearch
        onClick={() => fetchIngredients(ingredientSearchTerm)}
        disabled={isLoading}
        data-testid="search-ingredient-button"
      />
    </div>
  );
}

function FoundIngredientsList({
  onSelectFoundIngredient,
  className,
  containerClassName,
}: {
  onSelectFoundIngredient?: (
    ingredientFinderResult: IngredientFinderResult,
    isSelected: boolean,
  ) => void;
  className?: string;
  containerClassName?: string;
}) {
  const {
    showFoundIngredients,
    ingredientSearchTerm,
    foundIngredientsResults,
    isSelected,
    selectedExternalIngredientIds,
    setSelectedExternalIngredientIds,
    isLoading,
  } = useIngredientSearchContext();

  function selectIngredientFinderResult(
    ingredientFinderResult: IngredientFinderResult,
  ) {
    const wasSelected = selectedExternalIngredientIds.has(
      ingredientFinderResult.externalRef.externalId,
    );

    setSelectedExternalIngredientIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ingredientFinderResult.externalRef.externalId)) {
        newSet.delete(ingredientFinderResult.externalRef.externalId);
      } else {
        newSet.add(ingredientFinderResult.externalRef.externalId);
      }
      return newSet;
    });

    if (onSelectFoundIngredient) {
      onSelectFoundIngredient(ingredientFinderResult, !wasSelected);
    }
  }

  return (
    <div className={containerClassName}>
      {isLoading && (
        <div className="flex justify-center my-4">
          <Spinner />
        </div>
      )}

      {!isLoading &&
        showFoundIngredients &&
        foundIngredientsResults.length > 0 &&
        ingredientSearchTerm && (
          <div
            data-testid="ingredient-list"
            className={`flex flex-col space-y-2 overflow-y-scroll overflow-x-hidden py-2 pl-2 pr-4 max-h-57 ${className}`}
          >
            {foundIngredientsResults.map((foundIngredient) => {
              const fakeIngredient = {
                ...foundIngredient.ingredient,
                id: `fake-id-${foundIngredient.externalRef.externalId}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };

              return (
                <IngredientItemMini
                  key={foundIngredient.externalRef.externalId}
                  ingredient={fakeIngredient}
                  isSelected={isSelected(
                    foundIngredient.externalRef.externalId,
                  )}
                  onClick={() => selectIngredientFinderResult(foundIngredient)}
                />
              );
            })}
          </div>
        )}
    </div>
  );
}

function SelectedIngredientsList({
  ingredientLinesWithExternalRefs,
  setIngredientLinesWithExternalRefs,
  className,
  containerClassName,
  showIngredientLabel = true,
}: {
  ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[];
  setIngredientLinesWithExternalRefs: React.Dispatch<
    React.SetStateAction<IngredientLineWithExternalRef[]>
  >;
  className?: string;
  containerClassName?: string;
  showIngredientLabel?: boolean;
}) {
  function handleIngredientLineQuantityChange(ingredientLineId: string) {
    return (newQuantity: number) => {
      const ingredientLineWithExternalRef =
        ingredientLinesWithExternalRefs.find(
          (ingLineWithExternalRef) =>
            ingLineWithExternalRef.ingredientLine.id === ingredientLineId,
        );

      if (!ingredientLineWithExternalRef) return;

      const ingredientLine = ingredientLineWithExternalRef.ingredientLine;

      const quantityInGrams = newQuantity;
      const calories = formatToInteger(
        (ingredientLine.ingredient.nutritionalInfoPer100g.calories *
          quantityInGrams) /
          100,
      );
      const protein = formatToInteger(
        (ingredientLine.ingredient.nutritionalInfoPer100g.protein *
          quantityInGrams) /
          100,
      );

      const updatedIngredientLine: IngredientLineDTO = {
        ...ingredientLine,
        quantityInGrams,
        calories,
        protein,
      };

      setIngredientLinesWithExternalRefs((prev) =>
        prev.map((ingLineWithExternalRef) =>
          ingLineWithExternalRef.ingredientLine.id === ingredientLineId
            ? {
                ...ingLineWithExternalRef,
                ingredientLine: updatedIngredientLine,
              }
            : ingLineWithExternalRef,
        ),
      );
    };
  }

  function handleIngredientLineRemove(ingredientLineId: string) {
    setIngredientLinesWithExternalRefs((prev) =>
      prev.filter(
        (ingLineWithExternalRef) =>
          ingLineWithExternalRef.ingredientLine.id !== ingredientLineId,
      ),
    );
  }

  return (
    <div className={`${containerClassName}`}>
      {showIngredientLabel && (
        <span className="block mb-6 text-center text-zinc-700">
          {ingredientLinesWithExternalRefs.length
            ? ingredientLinesWithExternalRefs.length
            : ''}{' '}
          ingrediente
          {ingredientLinesWithExternalRefs.length === 1 ? '' : 's'}
        </span>
      )}

      <div
        data-testid="ingredient-line-list"
        className={`grid auto-rows-min gap-4 max-h-150 overflow-y-scroll ${className}`}
      >
        {ingredientLinesWithExternalRefs.map(
          (ingredientLineWithExternalRef) => {
            return (
              <IngredientLineItem
                key={ingredientLineWithExternalRef.ingredientLine.id}
                ingredientLine={ingredientLineWithExternalRef.ingredientLine}
                onQuantityChange={handleIngredientLineQuantityChange(
                  ingredientLineWithExternalRef.ingredientLine.id,
                )}
                onRemove={() =>
                  handleIngredientLineRemove(
                    ingredientLineWithExternalRef.ingredientLine.id,
                  )
                }
              />
            );
          },
        )}
      </div>

      {ingredientLinesWithExternalRefs.length === 0 && (
        <div className="text-sm">No hay ingredientes seleccionados.</div>
      )}
    </div>
  );
}

IngredientSearch.Search = Search;
IngredientSearch.FoundIngredientsList = FoundIngredientsList;
IngredientSearch.SelectedIngredientsList = SelectedIngredientsList;

export default IngredientSearch;

// Export the most common handler to be used in NewRecipeForm
// NOTE: it requires the setIngredientLines state setter to be passed from the parent component
export type IngredientLineWithExternalRef = {
  ingredientLine: IngredientLineDTO;
  ingredientExternalRef: IngredientFinderResult['externalRef'];
};

export function handleIngredientSelection(
  ingredientFinderResult: IngredientFinderResult,
  isSelected: boolean,
  setIngredientLinesInfo: React.Dispatch<
    React.SetStateAction<IngredientLineWithExternalRef[]>
  >,
) {
  if (isSelected) {
    const {
      ingredientLine: newIngredientLine,
      ingredientExternalRef,
    }: {
      ingredientLine: IngredientLineDTO;
      ingredientExternalRef: IngredientFinderResult['externalRef'];
    } = createInMemoryRecipeIngredientLine(ingredientFinderResult);

    const ingredientLineInfo: IngredientLineWithExternalRef = {
      ingredientLine: newIngredientLine,
      ingredientExternalRef: ingredientExternalRef,
    };

    setIngredientLinesInfo((prev) => [...prev, ingredientLineInfo]);
  } else {
    setIngredientLinesInfo((prev) =>
      prev.filter(
        (ingLineInfo) =>
          !ingLineInfo.ingredientLine.ingredient.id.endsWith(
            ingredientFinderResult.externalRef.externalId,
          ),
      ),
    );
  }
}
