import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { useEffect, useState } from 'react';
import RecipesGrid from './RecipesGrid';
import SectionHeading from '@/app/_ui/typography/SectionHeading';

function SelectRecipeModal() {
  const [recipes, setRecipes] = useState<RecipeDTO[]>([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch('/api/recipe/getAll');
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }

        const data: RecipeDTO[] = await response.json();
        setRecipes(data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="max-w-200 max-h-160 overflow-y-scroll w-[80dvw] p-4">
      <SectionHeading>Tus recetas</SectionHeading>
      <RecipesGrid recipes={recipes} />
    </div>
  );
}

export default SelectRecipeModal;
