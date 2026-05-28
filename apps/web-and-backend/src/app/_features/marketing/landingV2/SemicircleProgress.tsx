export function SemiCircleProgress({
  value,
  max,
  unit,
  icon,
}: {
  value: number;
  max: number;
  unit?: string;
  icon?: React.ReactNode;
}) {
  const percentage = value / max;

  const radius = 90;
  const semiCircumference = Math.PI * radius;
  const strokeDashoffset = semiCircumference - semiCircumference * percentage;

  return (
    <div className="relative w-42 h-21 rounded-xl">
      <svg viewBox="0 0 220 140" className="absolute inset-0 w-full h-full">
        {/* Background */}
        <path
          d="M20 110 A90 90 0 0 1 200 110"
          fill="none"
          stroke="#ffffff"
          strokeWidth="18"
          strokeLinecap="round"
        />

        {/* Progress */}
        <path
          d="M20 110 A90 90 0 0 1 200 110"
          fill="none"
          stroke="#111827"
          strokeWidth="18"
          strokeLinecap="round"
          strokeDasharray={semiCircumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pt-4 text-white">
        {icon && icon}

        <p className="font-bold text-center ">
          {value}

          {unit && <span className="text-[10px]"> {unit}</span>}

          <span className="block text-[10px] font-medium">of {max}</span>
        </p>
      </div>
    </div>
  );
}
