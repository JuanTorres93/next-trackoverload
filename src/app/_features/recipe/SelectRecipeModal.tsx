import ButtonNew from '@/app/_ui/ButtonNew';
import Spinner from '@/app/_ui/Spinner';
import SectionHeading from '@/app/_ui/typography/SectionHeading';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import RecipesGrid from './RecipesGrid';

function SelectRecipeModal({
  dayId,
  onCloseModal,
}: {
  dayId: string;
  onCloseModal?: () => void;
}) {
  const router = useRouter();
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

    const addMealPromises = [];
    try {
      for (const recipeId of selectedRecipesIds) {
        const response = fetch('/api/day/addMeal', {
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

        addMealPromises.push(response);
      }

      await Promise.all(addMealPromises);

      router.refresh();
    } catch (error) {
      // TODO Toast error
      console.error('Error adding meals to day:', error);
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
