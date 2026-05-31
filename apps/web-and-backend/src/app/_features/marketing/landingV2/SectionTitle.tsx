import { twMerge } from "tailwind-merge";

import TextLarge from "@/app/_ui/typography/TextLarge";
import TextLessHuge from "@/app/_ui/typography/TextLessHuge";

function SectionTitle({
  title,
  subtitle,
  ...props
}: {
  title: string;
  subtitle?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        `flex gap-4 ${subtitle ? "justify-between" : "justify-center"}`,
        className,
      )}
      {...rest}
    >
      <TextLessHuge
        as="h2"
        className={`font-medium font-secondary ${subtitle ? "max-w-[33%]" : "max-w-[60%]"}`}
      >
        {title}
      </TextLessHuge>

      {subtitle && (
        <TextLarge as="p" className={`max-w-[45%] text-text-minor-emphasis`}>
          {subtitle}
        </TextLarge>
      )}
    </div>
  );
}

export default SectionTitle;
