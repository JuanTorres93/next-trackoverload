import Link from 'next/link';
import { HiPlus } from 'react-icons/hi2';

function ButtonNew({
  children,
  href,
  className,
  ...props
}: {
  children?: React.ReactNode;
  href?: string;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  // NOTE: group class allows to target child elements on parent hover
  const buttonStyle = `p-3 text-base font-medium text-primary transition border-2 border-primary rounded-md group hover:cursor-pointer hover:bg-primary hover:text-neutral-50 disabled:text-zinc-400 disabled:border-zinc-400 disabled:hover:bg-transparent disabled:cursor-not-allowed ${className}`;

  const buttonContent = (
    <>
      <HiPlus className="inline mb-1 mr-2 transition-transform duration-500 stroke-1 group-hover:rotate-90 group-disabled:group-hover:rotate-0" />
      {children || 'Nuevo'}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${buttonStyle} inline-block`}>
        {buttonContent}
      </Link>
    );
  }

  return (
    <button className={buttonStyle} {...props}>
      {buttonContent}
    </button>
  );
}

export default ButtonNew;
