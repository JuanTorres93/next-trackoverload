'use client';
import ButtonEditImage from '@/app/_ui/ButtonEditImage';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import Image from 'next/image';
import { updateRecipeImage } from '@/app/_features/recipe/actions';
import { AppClientImageProcessor } from '@/interface-adapters/app/services/AppClientImageProcessor';

function UpdateRecipeImage({
  recipe,
  className,
  ...props
}: { recipe: RecipeDTO } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`relative ${className}`} {...props}>
      <Image
        src={recipe.imageUrl || '/recipe-no-picture.png'}
        alt={recipe.name}
        width={300}
        height={200}
        className="rounded-2xl"
      />

      <ButtonEditImage
        className="absolute bottom-2 right-2"
        onImageUpload={async (imageFile) => {
          const compressedImageFile =
            await AppClientImageProcessor.compressToMaxMB(imageFile);

          updateRecipeImage(recipe.id, compressedImageFile);
        }}
      />
    </div>
  );
}

export default UpdateRecipeImage;
