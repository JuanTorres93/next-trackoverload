'use client';
import ButtonEditImage from '@/app/_ui/ButtonEditImage';
import { RecipeDTO } from '@/application-layer/dtos/RecipeDTO';
import Image from 'next/image';
import { updateRecipeImage } from '@/app/_features/recipe/actions';

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
        onImageUpload={(imageFile) => updateRecipeImage(recipe.id, imageFile)}
      />
    </div>
  );
}

export default UpdateRecipeImage;
