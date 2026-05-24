import Image from "next/image";

import ImagePicker from "@/app/_ui/ImagePicker";
import ButtonNew from "@/app/_ui/buttons/ButtonNew";
import { formatToInteger } from "@/app/_utils/format/formatToInteger";

import FormTitleTextArea from "../../common/FormTitleInput";
import LoadingOverlay from "../../common/LoadingOverlay";
import { NewRecipeFormState } from "./NewRecipeForm";

function RecipePreviewCard({
  isLoading,
  hasIngredients,
  setField,
  formState,
  invalidForm,
}: {
  isLoading: boolean;
  hasIngredients: boolean;
  setField: (
    fieldName: keyof NewRecipeFormState,
    value: NewRecipeFormState[keyof NewRecipeFormState],
  ) => void;
  formState: NewRecipeFormState;
  invalidForm: boolean;
}) {
  const totalCalories = formatToInteger(
    formState.ingredientLinesWithExternalRefs.reduce(
      (sum, il) => sum + il.ingredientLine.calories,
      0,
    ),
  );
  const totalProtein = formatToInteger(
    formState.ingredientLinesWithExternalRefs.reduce(
      (sum, il) => sum + il.ingredientLine.protein,
      0,
    ),
  );

  const imagePreviewUrl = formState.imageFile
    ? URL.createObjectURL(formState.imageFile)
    : "/recipe-no-picture.webp";

  function handleImageSelection(files: File[]) {
    if (files.length > 0) setField("imageFile", files[0]);
  }

  return (
    <aside className="sticky w-64 shrink-0 top-6 max-bp-new-recipe-page:w-full max-bp-new-recipe-page:static max-bp-new-recipe-page:order-first">
      <div className="relative overflow-hidden border shadow-sm rounded-2xl border-border/60 bg-surface-card">
        {isLoading && <LoadingOverlay className="z-20 rounded-2xl" />}

        {/* Recipe image */}
        <div className="relative h-44 bg-surface-light">
          <Image
            src={imagePreviewUrl}
            alt="Imagen de la receta"
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-t from-overlay/60 via-transparent to-transparent" />

          <div className="absolute z-10 bottom-3 left-3 right-3">
            <ImagePicker
              compact
              onFiles={handleImageSelection}
              maxSizeMB={200}
              accept="image/jpeg,image/png,image/webp"
            />
          </div>
        </div>

        {/* Recipe name */}
        <div className="px-4 pt-3 pb-2 border-b border-border/30">
          <FormTitleTextArea
            data-testid="recipe-name-input"
            value={formState.name}
            disabled={isLoading}
            onChange={(e) => setField("name", e.target.value)}
            placeholder="Nombre de la receta"
            autoFocus
            required
          />
        </div>

        {/* Macro totals */}
        {hasIngredients ? (
          <div className="flex items-center px-4 py-3 border-b bg-surface-light border-border/30">
            <MacroStat value={totalCalories} label="calorías totales" />

            <div className="w-px h-6 mx-2 bg-border/40" />

            <MacroStat value={totalProtein} label="proteínas totales" />
          </div>
        ) : (
          <div className="px-4 py-3 text-xs italic border-b text-text-minor-emphasis/60 border-border/30">
            Añade ingredientes para ver las macros
          </div>
        )}

        {/* Submit */}
        <div className="px-4 py-3">
          <ButtonNew
            className="justify-center w-full"
            disabled={invalidForm}
            isLoading={isLoading}
          >
            Crear receta
          </ButtonNew>
        </div>
      </div>
    </aside>
  );
}

function MacroStat({
  value,
  label,
}: {
  value: string | number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center flex-1">
      <span className="text-lg font-bold leading-none text-text">{value}</span>
      <span className="text-xs text-text-minor-emphasis mt-0.5">{label}</span>
    </div>
  );
}

export default RecipePreviewCard;
