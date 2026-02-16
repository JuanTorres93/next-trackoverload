import NutritionalInfoValue from '@/app/_ui/NutritionalInfoValue';
import TextSmall from '@/app/_ui/typography/TextSmall';

function CaloriesAndProtein({
  calories,
  protein,
  ...props
}: {
  calories: number;
  protein: number;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <TextSmall
      className={`grid grid-cols-2 p-2 text-center bg-surface-dark ${className}`}
      {...rest}
    >
      <NutritionalInfoValue
        lightText={true}
        number={calories}
        label="Calorías"
      />

      <NutritionalInfoValue
        lightText={true}
        number={protein}
        label="Proteínas"
      />
    </TextSmall>
  );
}

export default CaloriesAndProtein;
