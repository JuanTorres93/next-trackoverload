function NutritionalInfoValue({
  number,
  label,
}: {
  number: number;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center">
      <span className="font-medium">{number}</span>
      <span className="text-sm text-zinc-600 mt-[-5px]">{label}</span>
    </div>
  );
}

export default NutritionalInfoValue;
