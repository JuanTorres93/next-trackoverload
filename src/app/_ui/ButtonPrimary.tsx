import Link from 'next/link';
import TextRegular from './typography/TextRegular';

function ButtonPrimary({
  children,
  href,
  ...props
}: {
  children?: React.ReactNode;
  href?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, ...restProps } = props;

  const buttonStyle = `p-3 font-medium text-primary transition border-2 border-primary rounded-md  hover:cursor-pointer hover:bg-primary hover:text-text-light disabled:text-text-minor-emphasis disabled:border-text-minor-emphasis disabled:hover:bg-transparent disabled:cursor-not-allowed ${className}`;

  if (href) {
    return (
      <TextRegular>
        <Link href={href} className={`${buttonStyle} inline-block`}>
          {children}
        </Link>
      </TextRegular>
    );
  }
  return (
    <button className={buttonStyle} {...restProps}>
      {children}
    </button>
  );
}

export default ButtonPrimary;
