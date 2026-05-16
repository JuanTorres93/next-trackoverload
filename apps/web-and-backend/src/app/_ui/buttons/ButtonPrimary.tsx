import Link from "next/link";

import { twMerge } from "tailwind-merge";

import TextRegular from "../typography/TextRegular";

function ButtonPrimary({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, disabled, ...restProps } = props;

  // Separate disabled style because Link doesn't support the disabled attribute.
  // Applied AFTER className so it always wins regardless of variant overrides.
  const disabledStyle =
    "opacity-50 cursor-not-allowed hover:cursor-not-allowed hover:bg-transparent hover:border-current hover:text-current";

  const buttonStyle = twMerge(
    `px-4 py-2 text-sm font-semibold text-primary transition-all border border-primary rounded-xl hover:cursor-pointer hover:bg-primary hover:text-text-light`,
    className,
    disabled ? disabledStyle : "",
  );

  if (href) {
    return (
      <TextRegular>
        <Link
          href={href}
          className={twMerge(buttonStyle, "inline-block")}
          onClick={
            restProps.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
          }
        >
          {children}
        </Link>
      </TextRegular>
    );
  }
  return (
    <button className={buttonStyle} disabled={disabled} {...restProps}>
      {children}
    </button>
  );
}

export default ButtonPrimary;
