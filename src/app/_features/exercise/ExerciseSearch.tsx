"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";

import WorkoutTemplateLine from "@/app/_features/workouttemplate/WorkoutTemplateLine";
import { useOutsideClick } from "@/app/_hooks/useOutsideClick";
import { JSENDResponse } from "@/app/_types/JSEND";
import Input from "@/app/_ui/Input";
import Spinner from "@/app/_ui/Spinner";
import ButtonSearch from "@/app/_ui/buttons/ButtonSearch";
import { showErrorToast } from "@/app/_ui/showErrorToast";
import { ExerciseFinderResult } from "@/domain/services/ExerciseFinder.port";

import Exercise from "./Exercise";

const ExerciseSearchContext = createContext<ContextType | null>(null);

function SearchTermInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, disabled, ...rest } = props;
  const { searchTerm, setSearchTerm, handleShowResults, isLoading } =
    useExerciseSearchContext();

  return (
    <div className={className} {...rest}>
      <Input
        value={searchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setSearchTerm(e.target.value);
          handleShowResults();
        }}
        disabled={isLoading || disabled}
        onClick={handleShowResults}
        placeholder="Buscar ejercicios..."
      />
    </div>
  );
}

function SearchButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { disabled, ...rest } = props;
  const { searchTerm, isLoading, searchExercises } = useExerciseSearchContext();

  return (
    <ButtonSearch
      onClick={() => searchExercises(searchTerm)}
      disabled={isLoading || disabled}
      data-testid="search-exercise-button"
      {...rest}
    />
  );
}

function FoundExercisesList({
  className,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
}) {
  const {
    showResults,
    foundExercises,
    isLoading,
    isFetchingMore,
    hasMoreResults,
    isSelected,
    toggleSelection,
    fetchNextPage,
  } = useExerciseSearchContext();

  const fetchNextPageRef = useRef(fetchNextPage);
  fetchNextPageRef.current = fetchNextPage;

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) fetchNextPageRef.current();
    });

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [showResults, foundExercises.length]);

  if (isLoading) {
    return (
      <div className={containerClassName}>
        <div className="flex justify-center my-4">
          <Spinner />
        </div>
      </div>
    );
  }

  if (!showResults || foundExercises.length === 0) return null;

  return (
    <div className={containerClassName}>
      <div
        className={`overflow-y-scroll overflow-x-hidden py-2 pl-2 pr-4 max-h-57 ${className}`}
      >
        <div data-testid="exercise-list" className="flex flex-col space-y-2">
          {foundExercises.map((result) => (
            <Exercise
              key={result.externalRef.externalId}
              exercise={{
                ...result.exercise,
                id: `search-${result.externalRef.externalId}`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }}
              isSelected={isSelected(result.externalRef.externalId)}
              onClick={() => toggleSelection(result)}
            />
          ))}
        </div>

        {hasMoreResults && <div ref={sentinelRef} aria-hidden="true" />}

        {isFetchingMore && (
          <div className="flex justify-center py-2">
            <Spinner />
          </div>
        )}
      </div>
    </div>
  );
}

function SelectedExercisesList({
  className,
  containerClassName,
}: {
  className?: string;
  containerClassName?: string;
}) {
  const { selectedExercises, updateSets, removeExercise } =
    useExerciseSearchContext();

  if (selectedExercises.length === 0) return null;

  return (
    <div className={containerClassName}>
      <div
        data-testid="selected-exercise-list"
        className={`flex flex-col gap-4 ${className}`}
      >
        {selectedExercises.map(({ exerciseFinderResult, sets }) => (
          <WorkoutTemplateLine
            key={exerciseFinderResult.externalRef.externalId}
            workoutTemplateLine={{
              id: `local-${exerciseFinderResult.externalRef.externalId}`,
              templateId: "local",
              exerciseId: exerciseFinderResult.externalRef.externalId,
              sets,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }}
            exerciseName={exerciseFinderResult.exercise.name}
            onSetsChange={(newSets) =>
              updateSets(exerciseFinderResult.externalRef.externalId, newSets)
            }
            onRemove={() =>
              removeExercise(exerciseFinderResult.externalRef.externalId)
            }
          />
        ))}
      </div>
    </div>
  );
}

const DEFAULT_SETS = 3;

function ExerciseSearch({
  children,
  defaultSets = DEFAULT_SETS,
  onExerciseSelection,
}: {
  children: React.ReactNode;
  defaultSets?: number;
  onExerciseSelection?: (exercises: SelectedExerciseEntry[]) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [foundExercises, setFoundExercises] = useState<ExerciseFinderResult[]>(
    [],
  );
  const [selectedExercises, setSelectedExercises] = useState<
    SelectedExerciseEntry[]
  >([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMoreResults, setHasMoreResults] = useState(false);

  const currentPageRef = useRef(1);
  const searchTermRef = useRef(searchTerm);
  searchTermRef.current = searchTerm;

  const onExerciseSelectionRef = useRef(onExerciseSelection);
  onExerciseSelectionRef.current = onExerciseSelection;

  const outsideClickRef = useOutsideClick<HTMLDivElement>(handleHideResults);

  useEffect(() => {
    onExerciseSelectionRef.current?.(selectedExercises);
  }, [selectedExercises]);

  function handleShowResults() {
    setShowResults(true);
  }

  function handleHideResults() {
    setShowResults(false);
  }

  function isSelected(externalId: string): boolean {
    return selectedExercises.some(
      (e) => e.exerciseFinderResult.externalRef.externalId === externalId,
    );
  }

  async function searchExercises(term: string): Promise<void> {
    if (!term.trim()) {
      setFoundExercises([]);
      return;
    }

    setIsLoading(true);
    currentPageRef.current = 1;

    try {
      const results = await fetchExercisesPage(term, 1);

      if (results.length === 0) {
        showErrorToast(`No se encontraron ejercicios para "${term}"`);
        setHasMoreResults(false);
        return;
      }

      setFoundExercises(results);
      setHasMoreResults(true);
    } catch {
      setFoundExercises([]);
      setHasMoreResults(false);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchNextPage(): Promise<void> {
    if (!hasMoreResults || isLoading || isFetchingMore) return;

    const term = searchTermRef.current;
    if (!term.trim()) return;

    const nextPage = currentPageRef.current + 1;
    setIsFetchingMore(true);

    try {
      const results = await fetchExercisesPage(term, nextPage);

      if (results.length === 0) {
        setHasMoreResults(false);
        return;
      }

      setFoundExercises((prev) => [...prev, ...results]);
      currentPageRef.current = nextPage;
    } catch {
      setHasMoreResults(false);
    } finally {
      setIsFetchingMore(false);
    }
  }

  function toggleSelection(result: ExerciseFinderResult): void {
    const externalId = result.externalRef.externalId;

    setSelectedExercises((prev) =>
      isSelected(externalId)
        ? prev.filter(
            (e) => e.exerciseFinderResult.externalRef.externalId !== externalId,
          )
        : [...prev, { exerciseFinderResult: result, sets: defaultSets }],
    );
  }

  function updateSets(externalId: string, sets: number): void {
    setSelectedExercises((prev) =>
      prev.map((e) =>
        e.exerciseFinderResult.externalRef.externalId === externalId
          ? { ...e, sets }
          : e,
      ),
    );
  }

  function removeExercise(externalId: string): void {
    setSelectedExercises((prev) =>
      prev.filter(
        (e) => e.exerciseFinderResult.externalRef.externalId !== externalId,
      ),
    );
  }

  const contextValue: ContextType = {
    searchTerm,
    setSearchTerm,
    foundExercises,
    showResults,
    isLoading,
    isFetchingMore,
    hasMoreResults,
    selectedExercises,
    isSelected,
    handleShowResults,
    handleHideResults,
    searchExercises,
    fetchNextPage,
    toggleSelection,
    updateSets,
    removeExercise,
  };

  return (
    <ExerciseSearchContext.Provider value={contextValue}>
      <div ref={outsideClickRef}>{children}</div>
    </ExerciseSearchContext.Provider>
  );
}

async function fetchExercisesPage(
  term: string,
  page: number,
): Promise<ExerciseFinderResult[]> {
  const response = await fetch(
    `/api/exercise/fuzzy/${encodeURIComponent(term)}?page=${page}`,
  );
  const json: JSENDResponse<ExerciseFinderResult[]> = await response.json();

  if (json.status !== "success" || !Array.isArray(json.data)) return [];

  return json.data;
}

export type SelectedExerciseEntry = {
  exerciseFinderResult: ExerciseFinderResult;
  sets: number;
};

type ContextType = {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  foundExercises: ExerciseFinderResult[];
  showResults: boolean;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMoreResults: boolean;
  selectedExercises: SelectedExerciseEntry[];
  isSelected: (externalId: string) => boolean;
  handleShowResults: () => void;
  handleHideResults: () => void;
  searchExercises: (term: string) => Promise<void>;
  fetchNextPage: () => Promise<void>;
  toggleSelection: (result: ExerciseFinderResult) => void;
  updateSets: (externalId: string, sets: number) => void;
  removeExercise: (externalId: string) => void;
};

function useExerciseSearchContext(): ContextType {
  const ctx = useContext(ExerciseSearchContext);
  if (!ctx)
    throw new Error(
      "useExerciseSearchContext must be used within ExerciseSearch",
    );
  return ctx;
}

ExerciseSearch.SearchTermInput = SearchTermInput;
ExerciseSearch.SearchButton = SearchButton;
ExerciseSearch.FoundExercisesList = FoundExercisesList;
ExerciseSearch.SelectedExercisesList = SelectedExercisesList;

export default ExerciseSearch;
