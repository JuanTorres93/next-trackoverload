import ButtonNew from '@/app/_ui/ButtonNew';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import SectionHeading from '@/app/_ui/typography/SectionHeading';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import RecipesGrid from './RecipesGrid';
import { JSENDResponse } from '@/app/_types/JSEND';
import { InfrastructureError } from '@/domain/common/errors';

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
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [isAddingMeals, setIsAddingMeals] = useState<boolean>(false);

  const numberOfSelectedRecipes = selectedRecipesIds.length;
  const invalidForm =
    numberOfSelectedRecipes === 0 || isLoading || isFetching || isAddingMeals;

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
      setIsFetching(true);

      try {
        const response = await fetch('/api/recipe/getAll');

        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const jsendResponse: JSENDResponse<RecipeDTO[]> = await response.json();

        if (
          jsendResponse.status === 'fail' ||
          jsendResponse.status === 'error'
        ) {
          throw new InfrastructureError();
        }

        const recipes: RecipeDTO[] = jsendResponse.data;

        setRecipes(recipes);
      } catch {
        showErrorToast('Error al cargar las recetas.');
      } finally {
        setIsLoading(false);
        setIsFetching(false);
      }
    };

    fetchRecipes();
  }, []);

  async function handleCreateMeals() {
    setIsLoading(true);
    setIsAddingMeals(true);

    try {
      await addMealsRequest(selectedRecipesIds);

      router.refresh();
    } catch {
      showErrorToast('Error al añadir las comidas.');
    } finally {
      setIsLoading(false);
      setIsAddingMeals(false);
      onCloseModal?.();
    }
  }

  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <div className="flex items-center justify-between gap-2 mb-8">
        <SectionHeading className="p-0! m-0! max-bp-add-multiple-meals-modal:text-3xl!">
          Tus recetas
        </SectionHeading>

        <ButtonNew
          className="max-h-13 max-bp-add-multiple-meals-modal:text-sm!
          max-bp-add-multiple-meals-modal:px-2!
          max-bp-add-multiple-meals-modal:py-2!
          "
          disabled={invalidForm}
          isLoading={isLoading}
          onClick={handleCreateMeals}
        >
          <span className="inline max-bp-add-multiple-meals-modal:hidden">
            Añadir comidas
          </span>
          <span className="hidden max-bp-add-multiple-meals-modal:inline">
            Añadir
          </span>
        </ButtonNew>
      </div>

      {isLoading && isAddingMeals && <span>Añadiendo comidas</span>}

      {isLoading && isFetching && <span>Cargando recetas</span>}

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
