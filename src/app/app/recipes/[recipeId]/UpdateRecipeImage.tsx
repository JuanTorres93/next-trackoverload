'use client';
import ButtonEditImage from '@/app/_ui/ButtonEditImage';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import Image from 'next/image';
import { updateRecipeImage } from '@/app/_features/recipe/actions';
import { AppClientImageProcessor } from '@/interface-adapters/app/services/AppClientImageProcessor';
import { useState } from 'react';
import { showErrorToast } from '@/app/_ui/showErrorToast';
import LoadingOverlay from '@/app/_features/common/LoadingOverlay';

function UpdateRecipeImage({
  recipe,
  className,
  ...props
}: { recipe: RecipeDTO } & React.HTMLAttributes<HTMLDivElement>) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleImageUpload(imageFile: File) {
    setIsLoading(true);

    try {
      const compressedImageFile =
        await AppClientImageProcessor.compressToMaxMB(imageFile);

      await updateRecipeImage(recipe.id, compressedImageFile);
    } catch {
      showErrorToast(
        'Error al subir la imagen. Por favor, inténtalo de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={`relative ${className}`} {...props}>
      {isLoading && <LoadingOverlay />}

      <Image
        src={recipe.imageUrl || '/recipe-no-picture.png'}
        alt={recipe.name}
        width={300}
        height={200}
        className="rounded-2xl"
      />

      <ButtonEditImage
        className="absolute bottom-2 right-2"
        onImageUpload={handleImageUpload}
        disabled={isLoading}
      />
    </div>
  );
}

export default UpdateRecipeImage;
