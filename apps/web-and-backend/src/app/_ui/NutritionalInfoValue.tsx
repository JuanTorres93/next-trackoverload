import { formatToInteger } from '../_utils/format/formatToInteger';
import TextSmall from './typography/TextSmall';

function NutritionalInfoValue({
  number,
  label,
  styleNumber,
  styleLabel,
  className,
  lightText = false,
}: {
  number: number;
  label: string;
  styleNumber?: string;
  styleLabel?: string;
  className?: string;
  lightText?: boolean;
}) {
  const formattedNumber = formatToInteger(number);

  const textColorClass = lightText ? 'text-text-light' : 'text-text';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <span className={`font-medium ${styleNumber} ${textColorClass}`}>
        {formattedNumber}
      </span>
      <TextSmall>
        <span className={`mt-0.5 ${styleLabel} ${textColorClass}`}>
          {label}
        </span>
      </TextSmall>
    </div>
  );
}

export default NutritionalInfoValue;
