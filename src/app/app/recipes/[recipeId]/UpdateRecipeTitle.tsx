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
      className={`w-full text-3xl font-bold text-white outline-none resize-none bg-transparent placeholder:text-white/50 leading-tight drop-shadow-md max-bp-recipe-page-second:text-2xl ${className}`}
      defaultValue={originalTitle}
      onChange={handleTitleChange}
      rows={2}
      spellCheck={false}
      {...rest}
    />
  );
}

export default UpdateRecipeTitle;
