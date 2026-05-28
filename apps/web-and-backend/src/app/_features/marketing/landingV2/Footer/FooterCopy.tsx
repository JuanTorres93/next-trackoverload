import { twMerge } from "tailwind-merge";

import Logo from "@/app/_ui/Logo";

function FooterCopy({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div className={twMerge("flex flex-col gap-4", className)} {...rest}>
      <div className="flex items-center gap-2">
        <Logo size={36} />

        <span className="text-2xl font-medium">Cimientos</span>
      </div>

      <p className="text-sm max-w-102">
        A simple fitness foundation system for men who want to build a better
        body and a more confident life without the overwhelm.
      </p>
    </div>
  );
}

export default FooterCopy;
