import { twMerge } from "tailwind-merge";

import AppHeader from "@/app/_ui/typography/AppHeader";

function WeightProgress({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <AppHeader>Progreso de peso</AppHeader>
    </div>
  );
}

export default WeightProgress;
