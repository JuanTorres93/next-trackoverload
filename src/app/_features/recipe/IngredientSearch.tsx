'use client';
import Input from '@/app/_ui/Input';
import VerticalList from '@/app/_ui/VerticalList';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { useOutsideClick } from '@/app/hooks/useOutsideClick';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import { createContext, useContext, useState } from 'react';
import IngredientItemMini from '../ingredient/IngredientItemMini';
import IngredientLineItem from '../ingredient/IngredientLineItem';
import { createInMemoryRecipeIngredientLine } from './utils';
import ButtonSearch from '@/app/_ui/ButtonSearch';

//TODO NEXT: Estados de carga

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
      'useIngredientSearch must be used within a IngredientSearchProvider'
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
      `/api/ingredient/fuzzy/${term}`
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

  // const debouncedFetchIngredients = useDebounce(fetchIngredients, 200);

  // Fetch ingredients when search term changes
  // IMPORTANT: Do not use with current OpenFoodFacts API due to rate limiting issues.
  //useEffect(() => {
  //  // debouncedFetchIngredients(ingredientSearchTerm);
  //}, [ingredientSearchTerm, debouncedFetchIngredients]);

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

function Search() {
  const {
    handleShowList,
    ingredientSearchTerm,
    setIngredientSearchTerm,
    fetchIngredients,
  } = useIngredientSearchContext();

  return (
    <div className="flex gap-4">
      <Input
        value={ingredientSearchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setIngredientSearchTerm(e.target.value);
          handleShowList();
        }}
        onClick={handleShowList}
        placeholder="Buscar ingredientes..."
      />

      <ButtonSearch
        onClick={() => fetchIngredients(ingredientSearchTerm)}
        data-testid="search-ingredient-button"
      />
    </div>
  );
}

function FoundIngredientsList({
  onSelectFoundIngredient,
}: {
  onSelectFoundIngredient?: (
    ingredientFinderResult: IngredientFinderResult,
    isSelected: boolean
  ) => void;
}) {
  const {
    showFoundIngredients,
    ingredientSearchTerm,
    foundIngredientsResults,
    isSelected,
    selectedExternalIngredientIds,
    setSelectedExternalIngredientIds,
  } = useIngredientSearchContext();

  function selectIngredientFinderResult(
    ingredientFinderResult: IngredientFinderResult
  ) {
    const wasSelected = selectedExternalIngredientIds.has(
      ingredientFinderResult.externalRef.externalId
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
    <>
      {showFoundIngredients &&
        foundIngredientsResults.length > 0 &&
        ingredientSearchTerm && (
          <VerticalList
            data-testid="ingredient-list"
            className="mx-auto max-w-80"
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
                    foundIngredient.externalRef.externalId
                  )}
                  onClick={() => selectIngredientFinderResult(foundIngredient)}
                />
              );
            })}
          </VerticalList>
        )}
    </>
  );
}

function SelectedIngredientsList({
  ingredientLinesWithExternalRefs,
  setIngredientLinesWithExternalRefs,
  showIngredientLabel = true,
}: {
  ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[];
  setIngredientLinesWithExternalRefs: React.Dispatch<
    React.SetStateAction<IngredientLineWithExternalRef[]>
  >;
  showIngredientLabel?: boolean;
}) {
  function handleIngredientLineQuantityChange(ingredientLineId: string) {
    return (newQuantity: number) => {
      const ingredientLineWithExternalRef =
        ingredientLinesWithExternalRefs.find(
          (ingLineWithExternalRef) =>
            ingLineWithExternalRef.ingredientLine.id === ingredientLineId
        );

      if (!ingredientLineWithExternalRef) return;

      const ingredientLine = ingredientLineWithExternalRef.ingredientLine;

      const quantityInGrams = newQuantity;
      const calories = formatToInteger(
        (ingredientLine.ingredient.nutritionalInfoPer100g.calories *
          quantityInGrams) /
          100
      );
      const protein = formatToInteger(
        (ingredientLine.ingredient.nutritionalInfoPer100g.protein *
          quantityInGrams) /
          100
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
            : ingLineWithExternalRef
        )
      );
    };
  }

  function handleIngredientLineRemove(ingredientLineId: string) {
    setIngredientLinesWithExternalRefs((prev) =>
      prev.filter(
        (ingLineWithExternalRef) =>
          ingLineWithExternalRef.ingredientLine.id !== ingredientLineId
      )
    );
  }

  return (
    <div data-testid="ingredient-line-list" className="flex flex-col gap-4">
      {showIngredientLabel && (
        <>
          {ingredientLinesWithExternalRefs.length
            ? ingredientLinesWithExternalRefs.length
            : ''}{' '}
          Ingrediente
          {ingredientLinesWithExternalRefs.length === 1 ? '' : 's'}
        </>
      )}

      {ingredientLinesWithExternalRefs.map((ingredientLineWithExternalRef) => {
        return (
          <IngredientLineItem
            key={ingredientLineWithExternalRef.ingredientLine.id}
            ingredientLine={ingredientLineWithExternalRef.ingredientLine}
            onQuantityChange={handleIngredientLineQuantityChange(
              ingredientLineWithExternalRef.ingredientLine.id
            )}
            onRemove={() =>
              handleIngredientLineRemove(
                ingredientLineWithExternalRef.ingredientLine.id
              )
            }
          />
        );
      })}

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
  >
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
            ingredientFinderResult.externalRef.externalId
          )
      )
    );
  }
}
