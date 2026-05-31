import { getTranslations } from "next-intl/server";
import { twMerge } from "tailwind-merge";

import TextEnormous from "@/app/_ui/typography/TextEnormous";
import TextLessHuge from "@/app/_ui/typography/TextLessHuge";
import TextRegular from "@/app/_ui/typography/TextRegular";

async function Step({
  step,
  ...props
}: { step: StepItemType } & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const t = await getTranslations("");

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
        {t(step.titleTranslationKey)}
      </TextEnormous>

      <TextRegular as="p" className={`text-text-minor-emphasis`}>
        {t(step.descriptionTranslationKey)}
      </TextRegular>
    </div>
  );
}

export type StepItemType = {
  numberString: string;
  titleTranslationKey: string;
  descriptionTranslationKey: string;
};

export default Step;
