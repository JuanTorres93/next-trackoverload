import TextSmall from '@/app/_ui/typography/TextSmall';
import { prependOnDigitNumberWithZero } from './utils/prependOnDigitNumberWithZero';

function DateTitle({
  day,
  month,
  year,
  ...props
}: {
  day: number;
  month: number;
  year: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;
  return (
    <TextSmall
      className={`text-text-minor-emphasis ${className ?? ''}`}
      {...rest}
    >
      <h3>
        {`${prependOnDigitNumberWithZero(
          day,
        )}/${prependOnDigitNumberWithZero(month)}/${year}`}
      </h3>
    </TextSmall>
  );
}

export default DateTitle;
