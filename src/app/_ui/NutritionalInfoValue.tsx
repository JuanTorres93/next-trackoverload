import { formatToInteger } from '../_utils/format/formatToInteger';

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
      <span className={`text-sm mt-0.5 ${styleLabel} ${textColorClass}`}>
        {label}
      </span>
    </div>
  );
}

export default NutritionalInfoValue;
