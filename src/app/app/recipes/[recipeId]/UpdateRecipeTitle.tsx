'use client';

import { renameRecipe } from '@/app/_features/recipe/actions';
import { useDebounce } from '@/app/_hooks/useDebounce';

function UpdateRecipeTitle({
  originalTitle,
  recipeId,
}: {
  originalTitle: string;
  recipeId: string;
}) {
  const debouncedRename = useDebounce((newTitle: string) => {
    renameRecipe(recipeId, newTitle);
  }, 800);

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const newTitle = event.target.value;

    if (newTitle.trim() === '' || newTitle === originalTitle || !newTitle) {
      return;
    }

    debouncedRename(newTitle);
  }

  return (
    <input
      type="text"
      className="self-center text-5xl font-bold text-center"
      defaultValue={originalTitle}
      onChange={handleTitleChange}
    />
  );
}

export default UpdateRecipeTitle;
