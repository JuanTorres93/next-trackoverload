import { formatToInteger } from '../_utils/format/formatToInteger';

function NutritionalInfoValue({
  number,
  label,
  styleNumber,
  styleLabel,
}: {
  number: number;
  label: string;
  styleNumber?: string;
  styleLabel?: string;
}) {
  const formattedNumber = formatToInteger(number);
  return (
    <div className="flex flex-col items-center">
      <span className={`font-medium ${styleNumber}`}>{formattedNumber}</span>
      <span className={`text-sm text-zinc-600 mt-[-5px] ${styleLabel}`}>
        {label}
      </span>
    </div>
  );
}

export default NutritionalInfoValue;
