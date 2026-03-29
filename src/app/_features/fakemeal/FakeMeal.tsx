import { FakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';
import ButtonX from '@/app/_ui/buttons/ButtonX';
import { removeFakeMealFromDay } from './actions';
import { useState } from 'react';
import LoadingOverlay from '../common/LoadingOverlay';
import { formatToInteger } from '@/app/_utils/format/formatToInteger';

function FakeMeal({
  fakeMeal,
  dayId,
  ...props
}: {
  fakeMeal: FakeMealDTO;
  dayId: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  const [isLoading, setIsLoading] = useState(false);

  async function handleRemoveFakeMeal() {
    setIsLoading(true);
    try {
      await removeFakeMealFromDay(dayId, fakeMeal.id);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div
      className={`relative flex items-center gap-3 px-4 py-2.5 bg-surface-card ${className ?? ''}`}
      {...rest}
    >
      {isLoading && <LoadingOverlay />}

      {/* Lightning bolt icon for quick entries */}
      <div className="w-9 h-9 rounded-full bg-surface-light flex items-center justify-center shrink-0 text-text-minor-emphasis text-base">
        ⚡
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-text truncate">
          {fakeMeal.name}
        </p>
        <p className="text-xs text-text-minor-emphasis">
          {formatToInteger(fakeMeal.calories)} kcal ·{' '}
          {formatToInteger(fakeMeal.protein)} g prot
        </p>
      </div>

      <ButtonX data-testid="remove-fake-meal" onClick={handleRemoveFakeMeal} />
    </div>
  );
}

export default FakeMeal;
