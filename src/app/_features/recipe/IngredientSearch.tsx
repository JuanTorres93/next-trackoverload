'use client';
import { useEffect, useState } from 'react';
import Input from '@/app/_ui/Input';
import VerticalList from '@/app/_ui/VerticalList';
import IngredientItemMini from '../ingredient/IngredientItemMini';
import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import { useDebounce } from '@/app/hooks/useDebounce';

function IngredientSearch({
  onSelectFoundIngredient,
}: {
  onSelectFoundIngredient?: (
    ingredient: IngredientDTO,
    isSelected: boolean
  ) => void;
}) {
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [foundIngredients, setFoundIngredients] = useState<IngredientDTO[]>([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState<
    Set<string>
  >(new Set());

  // IMPORTANT NOTE: Don't use this function directly to avoid excessive calls. Use debounced version below instead.
  async function fetchIngredients(term: string = ''): Promise<void> {
    const fetchedIngredients = await fetch(`/api/ingredient/fuzzy/${term}`);

    try {
      const data = await fetchedIngredients.json();
      setFoundIngredients(data);
    } catch {
      setFoundIngredients([]);
    }
  }

  const debouncedFetchIngredients = useDebounce(fetchIngredients, 200);

  // Fetch ingredients when search term changes
  useEffect(() => {
    debouncedFetchIngredients(ingredientSearchTerm);
  }, [ingredientSearchTerm, debouncedFetchIngredients]);

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

  return (
    <div>
      <Input
        value={ingredientSearchTerm}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setIngredientSearchTerm(e.target.value)
        }
        placeholder="Buscar ingredientes..."
      />

      {foundIngredients.length > 0 && ingredientSearchTerm && (
        <VerticalList className="mx-auto max-w-80">
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

export default IngredientSearch;
