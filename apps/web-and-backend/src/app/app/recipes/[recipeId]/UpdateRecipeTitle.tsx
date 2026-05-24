"use client";

import { showErrorToast } from "@/app/_ui/showErrorToast";

import { renameRecipe } from "../../../_features/recipe/actions";
import { useDebounce } from "../../../_hooks/useDebounce";

function UpdateRecipeTitle({
  originalTitle,
  recipeId,
  ...props
}: {
  originalTitle: string;
  recipeId: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;

  const debouncedRename = useDebounce(async (newTitle: string) => {
    const jsend = await renameRecipe(recipeId, newTitle);

    if (jsend.status !== "success") {
      showErrorToast(
        jsend.data?.message ||
          "Error al renombrar la receta. Por favor, inténtalo de nuevo.",
      );
      return;
    }
  }, 800);

  function handleTitleChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const newTitle = event.target.value;

    if (newTitle.trim() === "" || newTitle === originalTitle || !newTitle) {
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
