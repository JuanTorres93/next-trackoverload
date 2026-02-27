import ButtonNew from '@/app/_ui/ButtonNew';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import SectionHeading from '@/app/_ui/typography/SectionHeading';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RecipesGrid from './RecipesGrid';

// TODO Add ability to filter (and sort) recipes

function SelectRecipeModal({
  addMealsRequest,
  onCloseModal,
}: {
  addMealsRequest: (recipesIds: string[]) => Promise<void>;
  onCloseModal?: () => void;
}) {
  const router = useRouter();
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [selectedRecipesIds, setSelectedRecipesIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const numberOfSelectedRecipes = selectedRecipesIds.length;
  const invalidForm = numberOfSelectedRecipes === 0 || isLoading;

  function handleClickRecipe(recipeId: string) {
    if (selectedRecipesIds.includes(recipeId)) {
      setSelectedRecipesIds((prev) => prev.filter((id) => id !== recipeId));
    } else {
      setSelectedRecipesIds((prev) => [...prev, recipeId]);
    }
  }

  useEffect(() => {
    const fetchRecipes = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/recipe/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data: RecipeDTO[] = await response.json();
        setRecipes(data);
      } catch {
        showErrorToast('Error al cargar las recetas.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  async function handleCreateMeals() {
    setIsLoading(true);

    try {
      await addMealsRequest(selectedRecipesIds);

      router.refresh();
    } catch {
      showErrorToast('Error al añadir las comidas.');
    } finally {
      setIsLoading(false);
      onCloseModal?.();
    }
  }

  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <div className="flex ">
        <SectionHeading>Tus recetas</SectionHeading>
        <ButtonNew
          className="ml-14 max-h-13"
          disabled={invalidForm}
          isLoading={isLoading}
          onClick={handleCreateMeals}
        >
          Añadir comidas
        </ButtonNew>
      </div>

      {isLoading && <span>Añadiendo comidas</span>}

      {!isLoading && (
        <RecipesGrid
          asLink={false}
          recipes={recipes}
          onClick={handleClickRecipe}
          selectedRecipesIds={selectedRecipesIds}
        />
      )}
    </div>
  );
}

export default SelectRecipeModal;
