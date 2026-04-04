"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { JSENDResponse } from "@/app/_types/JSEND";
import Input from "@/app/_ui/Input";
import Spinner from "@/app/_ui/Spinner";
import ButtonSearch from "@/app/_ui/buttons/ButtonSearch";
import { showErrorToast } from "@/app/_ui/showErrorToast";
import TextSmall from "@/app/_ui/typography/TextSmall";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";
import { IngredientLineDTO } from "@/application-layer/dtos/IngredientLineDTO";
import { IngredientFinderResult } from "@/domain/services/IngredientFinder.port";

import { createInMemoryRecipeIngredientLine } from "../recipe/utils";
import IngredientItemMini from "./IngredientItemMini";
import IngredientLineItem from "./IngredientLineItem";
import BarcodeScanner from "./ZXingBarcodeScanner";

const IngredientSearchContext =
  createContext<IngredientSearchContextType | null>(null);

function SearchTermInput({
  inputContainerClassName,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  inputContainerClassName?: string;
}) {
  const { disabled, className, ...rest } = props;

  const {
    handleShowList,
    ingredientSearchTerm,
    setIngredientSearchTerm,
    isLoading,
  } = useIngredientSearchContext();

  return (
    <div className={`${className}`} {...rest}>
      <Input
        containerClassName={inputContainerClassName}
        value={ingredientSearchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setIngredientSearchTerm(e.target.value);
          handleShowList();
        }}
        disabled={isLoading || disabled}
        onClick={handleShowList}
        placeholder="Buscar ingredientes..."
      />
    </div>
  );
}

function SearchButton({
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, ...rest } = props;

  const { ingredientSearchTerm, isLoading, searchIngredients } =
    useIngredientSearchContext();

  return (
    <ButtonSearch
      onClick={() => searchIngredients(ingredientSearchTerm)}
      disabled={isLoading || disabled}
      data-testid="search-ingredient-button"
      {...rest}
    />
  );
}

function BarcodeSearch({ disabled = false }: { disabled?: boolean }) {
  const { setResultsFromBarcode, setIsLoading, handleShowList } =
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

        if (
          jsendResponse.status === "fail" ||
          jsendResponse.status === "error"
        ) {
          showErrorToast(
            "No se encontraron ingredientes para el código de barras escaneado.",
          );
          return;
        }

        setResultsFromBarcode(jsendResponse.data);
        handleShowList();
      } catch {
        setResultsFromBarcode([]);
      } finally {
        setIsLoading(false);
      }
    }
  }

  async function onScanError() {
    setResultsFromBarcode([]);
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
    isFetchingMore,
    hasMoreResults,
    fetchNextPage,
    toggleIngredientSelection,
  } = useIngredientSearchContext();

  const fetchNextPageRef = useRef(fetchNextPage);
  fetchNextPageRef.current = fetchNextPage;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchNextPageRef.current();
      }
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
    // Re-run whenever the list content changes so the observer targets the latest sentinel
  }, [showFoundIngredients, foundIngredientsResults.length]);

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
          // Scroll container: holds items, sentinel and pagination spinner
          <div
            className={`overflow-y-scroll overflow-x-hidden py-2 pl-2 pr-4 max-h-57 ${className}`}
          >
            {/* Items list — sentinel is its sibling so it is not counted as a child */}
            <div
              data-testid="ingredient-list"
              className="flex flex-col space-y-2"
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
                    onClick={() =>
                      selectIngredientFinderResult(foundIngredient)
                    }
                  />
                );
              })}
            </div>

            {/* Sentinel: triggers fetchNextPage when scrolled into view */}
            {hasMoreResults && <div ref={sentinelRef} aria-hidden="true" />}

            {/* Pagination spinner: list stays visible while fetching more */}
            {isFetchingMore && (
              <div className="flex justify-center py-2">
                <Spinner />
              </div>
            )}
          </div>
        )}
    </div>
  );
}

function SelectedIngredientsList({
  className,
  containerClassName,
  showIngredientLabel = true,
  hideEmptyState = false,
}: {
  className?: string;
  containerClassName?: string;
  showIngredientLabel?: boolean;
  hideEmptyState?: boolean;
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
          {numberOfSelectedIngredients ? numberOfSelectedIngredients : ""}{" "}
          ingrediente
          {numberOfSelectedIngredients === 1 ? "" : "s"}
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

      {ingredientLinesWithExternalRefs.length === 0 && !hideEmptyState && (
        <TextSmall>No hay ingredientes seleccionados.</TextSmall>
      )}
    </div>
  );
}

function useIngredientSearchContext() {
  const value = useContext(IngredientSearchContext);

  if (value === undefined || value === null) {
    throw new Error(
      "useIngredientSearch must be used within a IngredientSearchProvider",
    );
  }

  return value;
}

type IngredientSearchContextType = {
  showFoundIngredients: boolean;
  ingredientSearchTerm: string;
  setIngredientSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  foundIngredientsResults: IngredientFinderResult[];
  selectedExternalIngredientIds: string[];
  handleShowList: () => void;
  handleHideList: () => void;
  isSelected: (externalIngredientId: string) => boolean;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  hasMoreResults: boolean;
  isFetchingMore: boolean;
  searchIngredients: (term: string) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  setResultsFromBarcode: (results: IngredientFinderResult[]) => void;
  toggleIngredientSelection: (externalIngredientId: string) => void;
  ingredientLinesWithExternalRefs: IngredientLineWithExternalRef[];
  handleIngredientLineQuantityChange: (
    ingredientLineId: string,
  ) => (newQuantity: number) => void;
  handleIngredientLineRemove: (ingredientLineId: string) => void;
};

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
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState("");
  const [foundIngredientsResults, setFoundIngredientsResults] = useState<
    IngredientFinderResult[]
  >([]);
  const [selectedExternalIngredientIds, setSelectedExternalIngredientIds] =
    useState<string[]>([]);
  const [selectedIngredientLines, setSelectedIngredientLines] = useState<
    IngredientLineWithExternalRef[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  const currentSearchPageRef = useRef(1);
  const ingredientSearchTermRef = useRef(ingredientSearchTerm);
  ingredientSearchTermRef.current = ingredientSearchTerm;

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

  async function searchIngredients(term: string): Promise<void> {
    if (!term.trim()) {
      setFoundIngredientsResults([]);
      return;
    }

    setIsLoading(true);
    currentSearchPageRef.current = 1;

    try {
      const results = await fetchIngredientsPage(term, 1);

      if (results.length === 0) {
        showErrorToast(
          `No se encontraron ingredientes para el término de búsqueda ${term}`,
        );
        setHasMoreResults(false);
        return;
      }

      setFoundIngredientsResults(results);
      setHasMoreResults(true);
    } catch {
      setFoundIngredientsResults([]);
      setHasMoreResults(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchNextPage(): Promise<void> {
    if (!hasMoreResults || isLoading || isFetchingMore) return;

    const term = ingredientSearchTermRef.current;
    if (!term.trim()) return;

    const nextPage = currentSearchPageRef.current + 1;
    setIsFetchingMore(true);

    try {
      const results = await fetchIngredientsPage(term, nextPage);

      if (results.length === 0) {
        setHasMoreResults(false);
        return;
      }

      setFoundIngredientsResults((prev) => [...prev, ...results]);
      currentSearchPageRef.current = nextPage;
    } catch {
      setHasMoreResults(false);
    } finally {
      setIsFetchingMore(false);
    }
  }

  function setResultsFromBarcode(results: IngredientFinderResult[]): void {
    currentSearchPageRef.current = 1;
    setHasMoreResults(false);
    setFoundIngredientsResults(results);
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
    const ingredientLineToRemove = selectedIngredientLines.find(
      (ingLineWithExternalRef) =>
        ingLineWithExternalRef.ingredientLine.id === ingredientLineId,
    );

    if (!ingredientLineToRemove) return;

    // Deselect the ingredient in the search results, line removal is handled in the effect
    setSelectedExternalIngredientIds((prev) =>
      prev.filter(
        (id) => id !== ingredientLineToRemove.ingredientExternalRef.externalId,
      ),
    );
  }

  const contextValue = {
    showFoundIngredients,
    ingredientSearchTerm,
    setIngredientSearchTerm,
    foundIngredientsResults,
    selectedExternalIngredientIds,
    handleShowList,
    handleHideList,
    isSelected,
    isLoading,
    setIsLoading,
    hasMoreResults,
    isFetchingMore,
    searchIngredients,
    fetchNextPage,
    setResultsFromBarcode,
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

export type IngredientLineWithExternalRef = {
  ingredientLine: IngredientLineDTO;
  ingredientExternalRef: IngredientFinderResult["externalRef"];
};

export function ingredientFinderResultToIngredientLineWithExternalRef(
  ingredientFinderResult: IngredientFinderResult,
): IngredientLineWithExternalRef {
  const {
    ingredientLine: newIngredientLine,
    ingredientExternalRef,
  }: {
    ingredientLine: IngredientLineDTO;
    ingredientExternalRef: IngredientFinderResult["externalRef"];
  } = createInMemoryRecipeIngredientLine(ingredientFinderResult);

  return {
    ingredientLine: newIngredientLine,
    ingredientExternalRef: ingredientExternalRef,
  };
}

async function fetchIngredientsPage(
  term: string,
  page: number,
): Promise<IngredientFinderResult[]> {
  const response = await fetch(
    `/api/ingredient/fuzzy/${encodeURIComponent(term)}?page=${page}`,
  );
  const jsendResponse: JSENDResponse<IngredientFinderResult[]> =
    await response.json();

  if (
    jsendResponse.status === "fail" ||
    jsendResponse.status === "error" ||
    !Array.isArray(jsendResponse.data)
  ) {
    return [];
  }

  return jsendResponse.data;
}

IngredientSearch.SearchTermInput = SearchTermInput;
IngredientSearch.SearchButton = SearchButton;
IngredientSearch.FoundIngredientsList = FoundIngredientsList;
IngredientSearch.SelectedIngredientsList = SelectedIngredientsList;
IngredientSearch.BarcodeSearch = BarcodeSearch;

export default IngredientSearch;
