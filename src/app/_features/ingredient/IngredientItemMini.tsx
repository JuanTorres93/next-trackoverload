import { formatToInteger } from '@/app/_utils/format/formatToInteger';
import { IngredientDTO } from '@/application-layer/dtos/IngredientDTO';
import Image from 'next/image';

const blurDataURL =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    `
    <svg xmlns='http://www.w3.org/2000/svg' width='8' height='8'>
      <rect width='100%' height='100%' fill='#e5e5e5'/>
    </svg>
  `,
  ).toString('base64');

function IngredientItemMini({
  ingredient,
  isSelected = false,
  ...props
}: {
  ingredient: IngredientDTO;
  isSelected?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  const calories = formatToInteger(ingredient.nutritionalInfoPer100g.calories);
  const protein = formatToInteger(ingredient.nutritionalInfoPer100g.protein);

  return (
    <div
      className={`grid p-2 rounded-xl max-w-75 grid-cols-[3.5rem_1fr_min-content] bg-surface-card gap-4 items-center hover:bg-surface-light cursor-pointer transition 
        ${isSelected ? 'bg-surface-light text-text-minor-emphasis' : ''}`}
      {...props}
    >
      <div className="relative overflow-hidden rounded-md aspect-square">
        <Image
          fill
          src={ingredient.imageUrl || '/ingredient-no-picture.webp'}
          alt="Ingredient Image"
          placeholder="blur"
          blurDataURL={blurDataURL}
          className={`object-cover transition ${
            isSelected ? 'grayscale-75' : ''
          }`}
        />
      </div>

      <span className="font-semibold">{ingredient.name}</span>

      <div className="flex flex-col items-end gap-1 min-w-[70px]">
        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-text-minor-emphasis">
            {calories}
          </span>
          <span className="text-xs text-text-minor-emphasis">kcal</span>
        </div>

        <div className="flex items-center gap-1">
          <span className="text-sm font-medium text-primary">{protein}g</span>
          <span className="text-xs text-text-minor-emphasis">prot</span>
        </div>
      </div>
    </div>
  );
}

export default IngredientItemMini;
