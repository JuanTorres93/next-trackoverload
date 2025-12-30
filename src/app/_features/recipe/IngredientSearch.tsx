'use client';
import Input from '@/app/_ui/Input';
import VerticalList from '@/app/_ui/VerticalList';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { useOutsideClick } from '@/app/hooks/useOutsideClick';
import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import { IngredientLineDTO } from '@/application-layer/dtos/IngredientLineDTO';
import { useState } from 'react';
import IngredientItemMini from '../ingredient/IngredientItemMini';
import IngredientLineItem from '../ingredient/IngredientLineItem';
import { createInMemoryRecipeIngredientLine } from './utils';

function IngredientSearch({
  onSelectFoundIngredient,
}: {
  onSelectFoundIngredient?: (
    ingredient: IngredientDTO,
    isSelected: boolean
  ) => void;
}) {
  const [showList, setShowList] = useState(false);
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [foundIngredients, setFoundIngredients] = useState<IngredientDTO[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<
    Set<string>
  >(new Set());
  const listRef = useOutsideClick<HTMLDivElement>(handleHideList);

  async function fetchIngredients(term: string = ''): Promise<void> {
    // Use case is used behind the scenes in the API route. It can't be called directly from the client.
    if (!term.trim()) {
      setFoundIngredients([]);
      return;
    }
    const fetchedIngredients = await fetch(`/api/ingredient/fuzzy/${term}`);

    try {
      const data = await fetchedIngredients.json();
      setFoundIngredients(data);
    } catch {
      setFoundIngredients([]);
    }
  }

  // const debouncedFetchIngredients = useDebounce(fetchIngredients, 200);

  // Fetch ingredients when search term changes
  // IMPORTANT: Do not use with current OpenFoodFacts API due to rate limiting issues.
  //useEffect(() => {
  //  // debouncedFetchIngredients(ingredientSearchTerm);
  //}, [ingredientSearchTerm, debouncedFetchIngredients]);

  function selectIngredient(ingredient: IngredientDTO) {
    const wasSelected = selectedIngredientIds.has(ingredient.id);

    setSelectedIngredientIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(ingredient.id)) {
        newSet.delete(ingredient.id);
      } else {
        newSet.add(ingredient.id);
      }
      return newSet;
    });

    if (onSelectFoundIngredient) {
      onSelectFoundIngredient(ingredient, !wasSelected);
    }
  }

  function isSelected(ingredientId: string) {
    return selectedIngredientIds.has(ingredientId);
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
      {showList && foundIngredients.length > 0 && ingredientSearchTerm && (
        <VerticalList
          data-testid="ingredient-list"
          ref={listRef}
          className="mx-auto max-w-80"
        >
          {foundIngredients.map((ingredient) => (
            <IngredientItemMini
              key={ingredient.id}
              ingredient={ingredient}
              isSelected={isSelected(ingredient.id)}
              onClick={() => selectIngredient(ingredient)}
            />
          ))}
        </VerticalList>
      )}
    </div>
  );
}

function IngredientList({
  ingredientLines,
  setIngredientLines,
  showIngredientLabel = true,
}: {
  ingredientLines: IngredientLineDTO[];
  setIngredientLines: React.Dispatch<React.SetStateAction<IngredientLineDTO[]>>;
  showIngredientLabel?: boolean;
}) {
  function handleIngredientLineQuantityChange(ingredientLineId: string) {
    return (newQuantity: number) => {
      const ingredientLine = ingredientLines.find(
        (il) => il.id === ingredientLineId
      );
      if (!ingredientLine) return;

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

      setIngredientLines((prev) =>
        prev.map((il) =>
          il.id === ingredientLineId
            ? { ...il, quantityInGrams, calories, protein }
            : il
        )
      );
    };
  }

  function handleIngredientLineRemove(ingredientLineId: string) {
    setIngredientLines((prev) =>
      prev.filter((il) => il.id !== ingredientLineId)
    );
  }

  return (
    <div data-testid="ingredient-line-list" className="flex flex-col gap-4">
      {showIngredientLabel && (
        <>
          {ingredientLines.length ? ingredientLines.length : ''} Ingrediente
          {ingredientLines.length === 1 ? '' : 's'}
        </>
      )}
      {ingredientLines.map((ingredientLine) => {
        return (
          <IngredientLineItem
            key={ingredientLine.id}
            ingredientLine={ingredientLine}
            onQuantityChange={handleIngredientLineQuantityChange(
              ingredientLine.id
            )}
            onRemove={() => handleIngredientLineRemove(ingredientLine.id)}
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
// Can be used like this, where ingredient and isSelected are provided by IngredientSearch component and setIngredientLines is from the parent component:

//     <IngredientSearch
//       onSelectFoundIngredient={(ingredient, isSelected) =>
//         handleIngredientSelection(
//           ingredient,
//           isSelected,
//           setIngredientLines
//         )
//       }
//     />
export function handleIngredientSelection(
  ingredient: IngredientDTO,
  isSelected: boolean,
  setIngredientLines: React.Dispatch<React.SetStateAction<IngredientLineDTO[]>>
) {
  if (isSelected) {
    const newIngredientLine: IngredientLineDTO =
      createInMemoryRecipeIngredientLine(ingredient);

    setIngredientLines((prev) => [...prev, newIngredientLine]);
  } else {
    setIngredientLines((prev) =>
      prev.filter((il) => il.ingredient.id !== ingredient.id)
    );
  }
}
