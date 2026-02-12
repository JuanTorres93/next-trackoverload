import { FakeMealDTO } from '@/application-layer/dtos/FakeMealDTO';

function FakeMeal({
  fakeMeal,
  dayId,
  ...props
}: {
  fakeMeal: FakeMealDTO;
  dayId: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  // TODO dayId will be used to remove fake meal from day

  return (
    <div {...props}>
      <h3>{fakeMeal.name}</h3>
      <p>Calorías: {fakeMeal.calories}</p>
      <p>Proteinas: {fakeMeal.protein}g</p>
    </div>
  );
}

export default FakeMeal;
