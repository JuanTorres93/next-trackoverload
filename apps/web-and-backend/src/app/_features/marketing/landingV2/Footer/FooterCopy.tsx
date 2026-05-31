import { twMerge } from "tailwind-merge";

import Logo from "@/app/_ui/Logo";
import TextEnormous from "@/app/_ui/typography/TextEnormous";
import TextSmall from "@/app/_ui/typography/TextSmall";

function FooterCopy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex flex-col gap-4", className)} {...rest}>
      <div className="flex items-center gap-2">
        <Logo size={36} />

        <TextEnormous as="span" className="font-medium">
          Cimientos
        </TextEnormous>
      </div>

      <TextSmall as="p" className="max-w-102">
        A simple fitness foundation system for men who want to build a better
        body and a more confident life without the overwhelm.
      </TextSmall>
    </div>
  );
}

export default FooterCopy;
