import { twMerge } from "tailwind-merge";

import TextEnormous from "./TextEnormous";
import TextSmall from "./TextSmall";

function PageTitle({
  title,
  subtitle,
  ...props
}: {
  title: string;
  subtitle?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("", className)} {...rest}>
      <TextEnormous as="h1" className="font-bold text-text">
        {title}
      </TextEnormous>

      {subtitle && (
        <TextSmall as="p" className="text-text-minor-emphasis">
          {subtitle}
        </TextSmall>
      )}
    </div>
  );
}

export default PageTitle;
