'use client';

import RecipesGrid from '@/app/_features/recipe/RecipesGrid';
import ButtonNew from '@/app/_ui/ButtonNew';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { useState } from 'react';

function RecipesDisplay({ recipes }: { recipes: RecipeDTO[] }) {
  const [isNavigating, setIsNavigating] = useState(false);

  function handleNavigate() {
    setIsNavigating(true);
  }

  return (
    <>
      <ButtonNew
        href="/app/recipes/new"
        className="mb-4"
        onClick={handleNavigate}
        isLoading={isNavigating}
      >
        Nueva Receta
      </ButtonNew>

      {recipes.length === 0 ? (
        <p className="text-center text-text-minor-emphasis">No hay recetas</p>
      ) : (
        <RecipesGrid data-testid="recipes-container" recipes={recipes} />
      )}
    </>
  );
}

export default RecipesDisplay;
