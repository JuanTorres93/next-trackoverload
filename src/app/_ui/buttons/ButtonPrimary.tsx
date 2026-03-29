import { twMerge } from 'tailwind-merge';

import Link from 'next/link';
import TextRegular from '../typography/TextRegular';

function ButtonPrimary({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, disabled, ...restProps } = props;

  // Separate disabled style because Link doesn't support the disabled attribute
  const disabledStyle =
    'text-text-minor-emphasis! border-text-minor-emphasis hover:bg-transparent cursor-not-allowed';

  const buttonStyle = twMerge(
    `px-4 py-2 text-sm font-semibold text-primary transition-all border border-primary rounded-xl hover:cursor-pointer hover:bg-primary hover:text-text-light`,
    disabled ? disabledStyle : '',
    className,
  );

  if (href) {
    return (
      <TextRegular>
        <Link
          href={href}
          className={twMerge(buttonStyle, 'inline-block')}
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
