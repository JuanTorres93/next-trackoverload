import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { useEffect, useState } from 'react';
import RecipesGrid from './RecipesGrid';
import SectionHeading from '@/app/_ui/typography/SectionHeading';
import Spinner from '@/app/_ui/Spinner';

function SelectRecipeModal() {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <SectionHeading>Tus recetas</SectionHeading>
      {isLoading && <Spinner className="mx-auto" />}
      {!isLoading && <RecipesGrid asLink={false} recipes={recipes} />}
    </div>
  );
}

export default SelectRecipeModal;
