import { twMerge } from "tailwind-merge";

import CopyrightNote from "./CopyrightNote";
import FooterCopy from "./FooterCopy";
import FooterLinks from "./FooterLinks";

function Footer({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <footer
      className={twMerge(
        "flex flex-col bg-text mt-15 text-white font-secondary",
        className,
      )}
      {...rest}
    >
      <div className={twMerge("mx-auto w-full max-w-400 py-10", className)}>
        <div className="flex justify-between">
          <FooterCopy />

          <FooterLinks />
        </div>
      </div>

      <CopyrightNote />
    </footer>
  );
}

export default Footer;
