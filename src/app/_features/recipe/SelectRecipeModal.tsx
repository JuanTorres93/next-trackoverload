import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { useEffect, useState } from 'react';
import RecipesGrid from './RecipesGrid';
import SectionHeading from '@/app/_ui/typography/SectionHeading';
import Spinner from '@/app/_ui/Spinner';
import ButtonNew from '@/app/_ui/ButtonNew';

function SelectRecipeModal({ dayId }: { dayId: string }) {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [selectedRecipesIds, setSelectedRecipesIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  async function handleCreateMeals() {
    setIsLoading(true);

    // TODO hacer en paralelo las peticiones
    try {
      for (const recipeId of selectedRecipesIds) {
        const response = await fetch('/api/day/addMeal', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            dayId,
            userId: 'dev-user', // TODO get user id from session
            recipeId,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to add meal to day');
        }
      }

      // Optionally, you can add some success feedback here
    } catch (error) {
      console.error('Error adding meals to day:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // TODO NEXT Close modal on success
  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <div className="flex ">
        <SectionHeading>Tus recetas</SectionHeading>
        <ButtonNew
          className="ml-14 max-h-13"
          disabled={invalidForm}
          onClick={handleCreateMeals}
        >
          Añadir comidas
        </ButtonNew>
      </div>

      {isLoading && <Spinner className="mx-auto" />}

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
