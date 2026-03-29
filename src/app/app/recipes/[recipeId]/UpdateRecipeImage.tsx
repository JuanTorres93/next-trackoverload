'use client';
import { updateRecipeImage } from '@/app/_features/recipe/actions';
import LoadingOverlay from '@/app/_features/common/LoadingOverlay';
import { AppClientImageProcessor } from '@/interface-adapters/app/services/AppClientImageProcessor';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { HiCamera } from 'react-icons/hi';

function UpdateRecipeImage({ recipe }: { recipe: RecipeDTO }) {
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function handleImageUpload(imageFile: File) {
    setIsLoading(true);
    try {
      const compressed = await AppClientImageProcessor.compressToMaxMB(imageFile);
      await updateRecipeImage(recipe.id, compressed);
    } catch {
      showErrorToast('Error al subir la imagen. Por favor, inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {isLoading && <LoadingOverlay />}

      <Image
        src={recipe.imageUrl || '/recipe-no-picture.webp'}
        alt={recipe.name}
        fill
        className="object-cover object-center"
        priority
      />

      {/* Compact pill — top-left, above gradient */}
      <div className="absolute top-3 left-3 z-20">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isLoading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-medium hover:bg-black/70 backdrop-blur-sm transition-colors cursor-pointer select-none disabled:opacity-50"
        >
          <HiCamera className="text-sm" />
          Cambiar foto
        </button>

        <input
          ref={inputRef}
          type="file"
          className="sr-only"
          data-testid="edit-recipe-image-button"
          name="new-recipe-image"
          accept="image/*"
          multiple={false}
          disabled={isLoading}
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            handleImageUpload(files[0]);
          }}
        />
      </div>
    </>
  );
}

export default UpdateRecipeImage;
