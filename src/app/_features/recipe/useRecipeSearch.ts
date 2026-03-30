import Fuse from 'fuse.js';
import { useMemo, useState } from 'react';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';

export function useRecipeSearch(recipes: RecipeDTO[]) {
  const [query, setQuery] = useState('');

  const fuse = useMemo(
    () =>
      new Fuse(recipes, {
        keys: ['name'],
        threshold: 0.4,
        includeScore: true,
      }),
    [recipes],
  );

  const filteredRecipes = useMemo(() => {
    if (!query.trim()) return recipes;

    return fuse.search(query).map((result) => result.item);
  }, [fuse, query, recipes]);

  return { query, setQuery, filteredRecipes };
}
