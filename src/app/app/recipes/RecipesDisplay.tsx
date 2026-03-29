'use client';

import RecipesGrid from '@/app/_features/recipe/RecipesGrid';
import ButtonNew from '@/app/_ui/buttons/ButtonNew';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { useState } from 'react';
import { HiBookOpen } from 'react-icons/hi';

function RecipesDisplay({ recipes }: { recipes: RecipeDTO[] }) {
  const [isNavigating, setIsNavigating] = useState(false);

  function handleNavigate() {
    setIsNavigating(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 max-bp-navbar-mobile:flex-col max-bp-navbar-mobile:items-start">
        <div>
          <h1 className="text-2xl font-bold text-text">Mis Recetas</h1>
          <p className="text-sm text-text-minor-emphasis">
            {recipes.length} receta{recipes.length !== 1 ? 's' : ''}
          </p>
        </div>
        <ButtonNew
          href="/app/recipes/new"
          onClick={handleNavigate}
          isLoading={isNavigating}
        >
          Nueva Receta
        </ButtonNew>
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-20 text-text-minor-emphasis">
          <HiBookOpen className="text-5xl opacity-30" />
          <div className="text-center">
            <p className="font-semibold">No hay recetas</p>
            <p className="mt-1 text-sm opacity-60">
              Crea tu primera receta para empezar
            </p>
          </div>
        </div>
      ) : (
        <RecipesGrid data-testid="recipes-container" recipes={recipes} />
      )}
    </div>
  );
}

export default RecipesDisplay;
