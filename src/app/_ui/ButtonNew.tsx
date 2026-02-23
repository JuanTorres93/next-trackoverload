import { HiPlus } from 'react-icons/hi2';
import ButtonPrimary from './ButtonPrimary';

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
  const buttonStyle = `group ${className}`;

  const buttonContent = (
    <>
      <HiPlus className="inline mb-1 mr-2 transition-transform duration-500 stroke-1 group-hover:rotate-90 group-disabled:group-hover:rotate-0" />
      {children || 'Nuevo'}
    </>
  );

  return (
    <ButtonPrimary className={buttonStyle} href={href || undefined} {...props}>
      {buttonContent}
    </ButtonPrimary>
  );
}

export default ButtonNew;
