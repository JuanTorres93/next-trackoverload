import { MealDTO } from '@/application-layer/dtos/MealDTO';
import Image from 'next/image';

function MealReminder({ meal }: { meal: MealDTO }) {
  const defaultImageUrl = '/recipe-no-picture.png';

  return (
    <div className="grid grid-cols-[5rem_1fr] bg-surface-card shadow-sm p-2 rounded-xl overflow-hidden items-center gap-4 max-bp-navbar-mobile:grid-cols-[4rem_1fr]">
      <div className="relative overflow-hidden rounded-md shadow-xm aspect-square">
        <Image
          src={meal.imageUrl || defaultImageUrl}
          alt={meal.name}
          fill
          className="object-cover"
        />
      </div>

      <p className="w-full text-lg font-medium max-bp-navbar-mobile:text-base">
        {meal.name}
      </p>
    </div>
  );
}

export default MealReminder;
