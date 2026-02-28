'use client';
import { useOutsideClick } from '@/app/_hooks/useOutsideClick';
import ButtonSearch from '@/app/_ui/ButtonSearch';
import Input from '@/app/_ui/Input';
import Spinner from '@/app/_ui/Spinner';
import TextSmall from '@/app/_ui/typography/TextSmall';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { IngredientFinderResult } from '@/domain/services/IngredientFinder.port';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { createInMemoryRecipeIngredientLine } from '../recipe/utils';
import IngredientItemMini from './IngredientItemMini';
import IngredientLineItem from './IngredientLineItem';
import BarcodeScanner from './ZXingBarcodeScanner';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import { JSENDResponse } from '@/app/_types/JSEND';

type IngredientSearchContextType = {
  showFoundIngredients: boolean;
  ingredientSearchTerm: string;
  setIngredientSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  foundIngredientsResults: IngredientFinderResult[];
  setFoundIngredientsResults: React.Dispatch<
    React.SetStateAction<IngredientFinderResult[]>
  >;
  selectedExternalIngredientIds: string[];
  handleShowList: () => void;
  handleHideList: () => void;
  isSelected: (externalIngredientId: string) => boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  toggleIngredientSelection: (externalIngredientId: string) => void;
  ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[];
  handleIngredientLineQuantityChange: (
    ingredientLineId: string,
  ) => (newQuantity: number) => void;
  handleIngredientLineRemove: (ingredientLineId: string) => void;
};

const IngredientSearchContext =
  createContext<IngredientSearchContextType | null>(null);

function IngredientSearch({
  children,
  onIngredientSelection,
}: {
  children: React.ReactNode;
  onIngredientSelection?: (
    ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[],
  ) => void;
}) {
  const [showFoundIngredients, setShowList] = useState(false);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [foundIngredientsResults, setFoundIngredientsResults] = useState<
    IngredientFinderResult[]
  >([]);
  const [selectedExternalIngredientIds, setSelectedExternalIngredientIds] =
    useState<string[]>([]);

  const [selectedIngredientLines, setSelectedIngredientLines] = useState<
    IngredientLineWithExternalRef[]
  >([]);

  const [isLoading, setIsLoading] = useState(false);

  // Keep a stable ref to the callback so effects never depend on its identity
  const onIngredientSelectionRef = useRef(onIngredientSelection);
  onIngredientSelectionRef.current = onIngredientSelection;

  const outsideClickRef = useOutsideClick<HTMLDivElement>(handleHideList);

  useEffect(() => {
    setSelectedIngredientLines((prev) => {
      const alreadyCreatedLines: IngredientLineWithExternalRef[] = prev.filter(
        (line) =>
          selectedExternalIngredientIds.includes(
            line.ingredientExternalRef.externalId,
          ),
      );

      const externalIdsForExistingLines = new Set<string>(
        alreadyCreatedLines.map(
          (line) => line.ingredientExternalRef.externalId,
        ),
      );

      const linesFromNewFoundIngredients = foundIngredientsResults
        .filter((foundIngredient) => {
          const externalId = foundIngredient.externalRef.externalId;

          const isIngredientSelected =
            selectedExternalIngredientIds.includes(externalId);
          const ingredientHasLineCreated =
            externalIdsForExistingLines.has(externalId);

          return isIngredientSelected && !ingredientHasLineCreated;
        })
        .map(ingredientFinderResultToIngredientLineWithExternalRef);

      return [...alreadyCreatedLines, ...linesFromNewFoundIngredients];
    });
  }, [selectedExternalIngredientIds, foundIngredientsResults]);

  useEffect(() => {
    onIngredientSelectionRef.current?.(selectedIngredientLines);
  }, [selectedIngredientLines]);

  function handleShowList() {
    if (!showFoundIngredients) setShowList(true);
  }

  function handleHideList() {
    if (showFoundIngredients) setShowList(false);
  }

  function isSelected(externalIngredientId: string) {
    return selectedExternalIngredientIds.includes(externalIngredientId);
  }

  function toggleIngredientSelection(externalIngredientId: string) {
    if (isSelected(externalIngredientId)) {
      setSelectedExternalIngredientIds((prev) =>
        prev.filter((id) => id !== externalIngredientId),
      );
    } else {
      setSelectedExternalIngredientIds((prev) => [
        ...prev,
        externalIngredientId,
      ]);
    }
  }

  function handleIngredientLineQuantityChange(ingredientLineId: string) {
    return (newQuantity: number) => {
      const ingredientLineWithExternalRef = selectedIngredientLines.find(
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

      setSelectedIngredientLines((prev) =>
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
    setSelectedIngredientLines((prev) =>
      prev.filter(
        (ingLineWithExternalRef) =>
          ingLineWithExternalRef.ingredientLine.id !== ingredientLineId,
      ),
    );
  }

  const contextValue = {
    showFoundIngredients,
    ingredientSearchTerm,
    setIngredientSearchTerm,
    foundIngredientsResults,
    setFoundIngredientsResults,
    selectedExternalIngredientIds,
    handleShowList,
    handleHideList,
    isSelected,
    isLoading,
    setIsLoading,
    toggleIngredientSelection,
    ingredientLinesWithExternalRefs: selectedIngredientLines,
    handleIngredientLineQuantityChange,
    handleIngredientLineRemove,
  };

  return (
    <IngredientSearchContext.Provider value={contextValue}>
      <div ref={outsideClickRef}>{children}</div>
    </IngredientSearchContext.Provider>
  );
}

function Search({
  className,
  disabled = false,
}: {
  className?: string;
  disabled?: boolean;
}) {
  const {
    handleShowList,
    ingredientSearchTerm,
    setIngredientSearchTerm,
    setFoundIngredientsResults,
    isLoading,
    setIsLoading,
  } = useIngredientSearchContext();

  async function fetchIngredients(term: string = ''): Promise<void> {
    if (!term.trim()) {
      setFoundIngredientsResults([]);
      return;
    }

    setIsLoading(true);

    try {
      const response: Response = await fetch(`/api/ingredient/fuzzy/${term}`);

      const jsendResponse: JSENDResponse<IngredientFinderResult[]> =
        await response.json();

      if (
        jsendResponse.status === 'fail' ||
        jsendResponse.status === 'error' ||
        jsendResponse.data.length === 0
      ) {
        showErrorToast(
          `No se encontraron ingredientes para el término de búsqueda ${term}`,
        );

        return;
      }

      const foundIngredientsResults = jsendResponse.data;

      setFoundIngredientsResults(foundIngredientsResults);
    } catch {
      setFoundIngredientsResults([]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`grid grid-cols-[1fr_min-content] gap-4  ${className}`}>
      <Input
        value={ingredientSearchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setIngredientSearchTerm(e.target.value);
          handleShowList();
        }}
        disabled={isLoading || disabled}
        onClick={handleShowList}
        placeholder="Buscar ingredientes..."
      />

      <ButtonSearch
        onClick={() => fetchIngredients(ingredientSearchTerm)}
        disabled={isLoading || disabled}
        data-testid="search-ingredient-button"
      />
    </div>
  );
}

function BarcodeSearch({ disabled = false }: { disabled?: boolean }) {
  const { setFoundIngredientsResults, setIsLoading, handleShowList } =
    useIngredientSearchContext();

  async function onScanResult(result: string | null) {
    if (result) {
      setIsLoading(true);

      try {
        const response: Response = await fetch(
          `/api/ingredient/barcode/${result}`,
        );

        const jsendResponse: JSENDResponse<IngredientFinderResult[]> =
          await response.json();

        // TODO Arreglar: ahora mismo se muestra varias veces el toast
        if (
          jsendResponse.status === 'fail' ||
          jsendResponse.status === 'error'
        ) {
          showErrorToast(
            'No se encontraron ingredientes para el código de barras escaneado.',
          );
          return;
        }

        const foundIngredientsResults = jsendResponse.data;

        setFoundIngredientsResults(foundIngredientsResults);
        handleShowList();
      } catch {
        setFoundIngredientsResults([]);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function onScanError() {
    setFoundIngredientsResults([]);
  }

  return (
    <div>
      <BarcodeScanner onScanResult={onScanResult} onScanError={onScanError}>
        <BarcodeScanner.ZXing disabled={disabled} />
      </BarcodeScanner>
    </div>
  );
}

function FoundIngredientsList({
  className,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
}) {
  const {
    showFoundIngredients,
    foundIngredientsResults,
    isSelected,
    isLoading,
    toggleIngredientSelection,
  } = useIngredientSearchContext();

  function selectIngredientFinderResult(
    ingredientFinderResult: IngredientFinderResult,
  ) {
    toggleIngredientSelection(ingredientFinderResult.externalRef.externalId);
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
        foundIngredientsResults.length > 0 && (
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
  className,
  containerClassName,
  showIngredientLabel = true,
}: {
  className?: string;
  containerClassName?: string;
  showIngredientLabel?: boolean;
}) {
  const {
    ingredientLinesWithExternalRefs,
    handleIngredientLineQuantityChange,
    handleIngredientLineRemove,
  } = useIngredientSearchContext();

  const numberOfSelectedIngredients = ingredientLinesWithExternalRefs.length;

  return (
    <div className={`${containerClassName}`}>
      {showIngredientLabel && numberOfSelectedIngredients > 0 && (
        <span className="block mb-6 text-center">
          {numberOfSelectedIngredients ? numberOfSelectedIngredients : ''}{' '}
          ingrediente
          {numberOfSelectedIngredients === 1 ? '' : 's'}
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
        <TextSmall>No hay ingredientes seleccionados.</TextSmall>
      )}
    </div>
  );
}

IngredientSearch.Search = Search;
IngredientSearch.FoundIngredientsList = FoundIngredientsList;
IngredientSearch.SelectedIngredientsList = SelectedIngredientsList;
IngredientSearch.BarcodeSearch = BarcodeSearch;

function useIngredientSearchContext() {
  const value = useContext(IngredientSearchContext);

  if (value === undefined || value === null) {
    throw new Error(
      'useIngredientSearch must be used within a IngredientSearchProvider',
    );
  }

  return value;
}

export default IngredientSearch;

export type IngredientLineWithExternalRef = {
  ingredientLine: IngredientLineDTO;
  ingredientExternalRef: IngredientFinderResult['externalRef'];
};

export function ingredientFinderResultToIngredientLineWithExternalRef(
  ingredientFinderResult: IngredientFinderResult,
): IngredientLineWithExternalRef {
  const {
    ingredientLine: newIngredientLine,
    ingredientExternalRef,
  }: {
    ingredientLine: IngredientLineDTO;
    ingredientExternalRef: IngredientFinderResult['externalRef'];
  } = createInMemoryRecipeIngredientLine(ingredientFinderResult);

  return {
    ingredientLine: newIngredientLine,
    ingredientExternalRef: ingredientExternalRef,
  };
}
