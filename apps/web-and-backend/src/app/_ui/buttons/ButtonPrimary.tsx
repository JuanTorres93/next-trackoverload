import Link from "next/link";

import { twMerge } from "tailwind-merge";

import TextLarge from "../typography/TextLarge";

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
    `inline-flex items-center justify-center px-4 py-3.5 leading-none font-semibold text-primary transition transition-all border border-primary rounded-lg hover:cursor-pointer hover:bg-primary hover:text-text-light max-bp-change-font:py-3`,
    className,
    disabled ? disabledStyle : "",
  );

  if (href) {
    return (
      <TextLarge
        as={Link}
        href={href}
        className={buttonStyle}
        onClick={
          restProps.onClick as unknown as React.MouseEventHandler<HTMLAnchorElement>
        }
      >
        {children}
      </TextLarge>
    );
  }
  return (
    <TextLarge
      as="button"
      className={buttonStyle}
      disabled={disabled}
      {...restProps}
    >
      {children}
    </TextLarge>
  );
}

export default ButtonPrimary;
