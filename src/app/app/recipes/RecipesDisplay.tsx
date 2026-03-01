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
    <div className="flex flex-col gap-6 max-bp-navbar-mobile:items-center max-bp-navbar-mobile:w-full">
      <ButtonNew
        href="/app/recipes/new"
        onClick={handleNavigate}
        isLoading={isNavigating}
      >
        Nueva Receta
      </ButtonNew>

      {recipes.length === 0 ? (
        <p className="text-center text-text-minor-emphasis">No hay recetas</p>
      ) : (
        <RecipesGrid
          className="justify-center w-full"
          data-testid="recipes-container"
          recipes={recipes}
        />
      )}
    </div>
  );
}

export default RecipesDisplay;
