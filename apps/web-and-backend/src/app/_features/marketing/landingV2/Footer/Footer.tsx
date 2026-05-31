import { twMerge } from "tailwind-merge";

import CopyrightNote from "./CopyrightNote";
import FooterCopy from "./FooterCopy";
import FooterLinks from "./FooterLinks";

function Footer({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <footer
      className={twMerge(
        "flex flex-col px-6 bg-text mt-15 text-white",
        className,
      )}
      {...rest}
    >
      <div className={twMerge("mx-auto w-full max-w-400 py-10", className)}>
        <div className="flex justify-between max-bp-landing-footer-small:grid max-bp-landing-footer-small:grid-cols-[40%_1fr] max-bp-landing-footer-smallest:grid-cols-1 max-bp-landing-footer-smallest:text-center max-bp-landing-footer-smallest:gap-10">
          <FooterCopy />

          <FooterLinks className="max-bp-landing-footer-small:justify-self-end max-bp-landing-footer-smallest:justify-self-center" />
        </div>
      </div>

      <CopyrightNote />
    </footer>
  );
}

export default Footer;
