'use client';

import { renameRecipe } from '@/app/_features/recipe/actions';
import { useDebounce } from '@/app/_hooks/useDebounce';

function UpdateRecipeTitle({
  originalTitle,
  recipeId,
  ...props
}: {
  originalTitle: string;
  recipeId: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;

  const debouncedRename = useDebounce((newTitle: string) => {
    renameRecipe(recipeId, newTitle);
  }, 800);

  function handleTitleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newTitle = event.target.value;

    if (newTitle.trim() === '' || newTitle === originalTitle || !newTitle) {
      return;
    }

    debouncedRename(newTitle);
  }

  return (
    <textarea
      className={`text-4xl pr-6 font-medium ${className}`}
      defaultValue={originalTitle}
      onChange={handleTitleChange}
      {...rest}
    />
  );
}

export default UpdateRecipeTitle;
