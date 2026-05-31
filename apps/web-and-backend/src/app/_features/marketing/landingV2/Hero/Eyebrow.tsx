import { twMerge } from "tailwind-merge";

import TextSmall from "@/app/_ui/typography/TextSmall";

function Eyebrow({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <TextSmall
      as="h3"
      className={twMerge(
        `uppercase inline-block text-primary py-2.75 px-5 w-fit rounded-full bg-primary-lightest`,
        className,
      )}
      {...rest}
    >
      Nutrition first fitness for men who want clarity, not pressure.
    </TextSmall>
  );
}

export default Eyebrow;
