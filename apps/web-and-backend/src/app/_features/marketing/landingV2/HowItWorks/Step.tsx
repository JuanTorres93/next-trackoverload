import { twMerge } from "tailwind-merge";

import TextEnormous from "@/app/_ui/typography/TextEnormous";
import TextLessHuge from "@/app/_ui/typography/TextLessHuge";
import TextRegular from "@/app/_ui/typography/TextRegular";

// TODO IMPORTANT: Finish styling when design is done
function Step({
  step,
  ...props
}: { step: StepItemType } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        "bg-primary-lightest py-10 px-7.5 rounded-3xl flex flex-col gap-6",
        className,
      )}
      {...rest}
    >
      <TextLessHuge
        as="span"
        className="self-start p-3 text-white rounded-2xl bg-primary-light font-secondary"
      >
        {step.numberString}
      </TextLessHuge>

      <div></div>

      <TextEnormous as="h3" className="font-medium font-secondary">
        {step.title}
      </TextEnormous>

      <TextRegular as="p" className={`text-text-minor-emphasis`}>
        {step.description}
      </TextRegular>
    </div>
  );
}

export type StepItemType = {
  numberString: string;
  title: string;
  description: string;
};

export default Step;
