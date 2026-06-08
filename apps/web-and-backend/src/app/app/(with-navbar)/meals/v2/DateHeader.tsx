import { twMerge } from "tailwind-merge";

import AppSectionTitle from "@/app/_ui/typography/AppSectionTitle";
import AppSubsectionTitle from "@/app/_ui/typography/AppSubsectionTitle";
import { formatDate } from "@/app/_utils/format/formatDate";

function DateHeader({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const todayFormatted = formatDate(new Date());

  return (
    <div className={twMerge("", className)} {...rest}>
      <AppSubsectionTitle className="pb-1.5">Hoy</AppSubsectionTitle>

      <AppSectionTitle className="pb-5.5">{todayFormatted}</AppSectionTitle>
    </div>
  );
}

export default DateHeader;
