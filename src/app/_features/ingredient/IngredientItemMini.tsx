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
  return (
    <div
      className={`grid p-2 rounded-xl grid-cols-[40px_1fr_min-content] bg-surface-card  gap-8 items-center hover:bg-surface-light cursor-pointer transition 
        ${isSelected ? 'bg-surface-light text-text-minor-emphasis' : ''}`}
      {...props}
    >
      <div className="relative overflow-hidden rounded-md h-14 aspect-square">
        <Image
          fill
          src={ingredient.imageUrl || '/ingredient-no-picture.png'}
          alt="Ingredient Image"
          placeholder="blur"
          blurDataURL={blurDataURL}
          className={`object-cover transition ${
            isSelected ? 'grayscale-75' : ''
          }`}
        />
      </div>
      <span className="font-semibold">{ingredient.name}</span>
    </div>
  );
}

export default IngredientItemMini;
