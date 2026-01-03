'use client';
import Input from '@/app/_ui/Input';
import VerticalList from '@/app/_ui/VerticalList';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { useOutsideClick } from '@/app/hooks/useOutsideClick';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import { useState } from 'react';
import IngredientItemMini from '../ingredient/IngredientItemMini';
import IngredientLineItem from '../ingredient/IngredientLineItem';
import { createInMemoryRecipeIngredientLine } from './utils';

function IngredientSearch({
  onSelectFoundIngredient,
}: {
  onSelectFoundIngredient?: (
    ingredientFinderResult: IngredientFinderResult,
    isSelected: boolean
  ) => void;
}) {
  const [showList, setShowList] = useState(false);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [foundIngredientsResults, setFoundIngredientsResults] = useState<
    IngredientFinderResult[]
  >([]);
  const [selectedExternalIngredientIds, setSelectedExternalIngredientIds] =
    useState<Set<string>>(new Set());
  const listRef = useOutsideClick<HTMLDivElement>(handleHideList);

  async function fetchIngredients(term: string = ''): Promise<void> {
    // Use case is used behind the scenes in the API route. It can't be called directly from the client.
    if (!term.trim()) {
      setFoundIngredientsResults([]);
      return;
    }
    const fetchedIngredientsResult: Response = await fetch(
      `/api/ingredient/fuzzy/${term}`
    );

    try {
      const data: IngredientFinderResult[] =
        await fetchedIngredientsResult.json();

      setFoundIngredientsResults(data);
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

  function isSelected(externalIngredientId: string) {
    return selectedExternalIngredientIds.has(externalIngredientId);
  }

  function handleShowList() {
    if (!showList) setShowList(true);
  }

  function handleHideList() {
    if (showList) setShowList(false);
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Search bar */}
      <Input
        value={ingredientSearchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setIngredientSearchTerm(e.target.value);
          handleShowList();
        }}
        onClick={handleShowList}
        placeholder="Buscar ingredientes..."
      />

      {/* TODO design a nice button */}
      <button
        onClick={() => fetchIngredients(ingredientSearchTerm)}
        data-testid="search-ingredient-button"
      >
        Buscar
      </button>

      {/* Found results */}
      {showList &&
        foundIngredientsResults.length > 0 &&
        ingredientSearchTerm && (
          <VerticalList
            data-testid="ingredient-list"
            ref={listRef}
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
    </div>
  );
}

function IngredientList({
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
    </div>
  );
}

IngredientSearch.IngredientList = IngredientList;

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
