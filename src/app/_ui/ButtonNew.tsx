import { HiPlus } from 'react-icons/hi2';
import ButtonPrimary from './ButtonPrimary';
import SpinnerMini from './SpinnerMini';

function ButtonNew({
  children,
  href,
  isLoading = false,
  ...props
}: {
  children?: React.ReactNode;
  href?: string;
  isLoading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const { className, disabled, ...rest } = props;

  const isDisabled = disabled || isLoading;

  // NOTE: group class allows to target child elements on parent hover
  const buttonStyle = `group ${className}`;

  const buttonContent = (
    <div className="flex items-center justify-center gap-2">
      {!isLoading && (
        <HiPlus className="inline transition-transform duration-500 stroke-1 group-hover:rotate-90 group-disabled:group-hover:rotate-0" />
      )}
      {isLoading && <SpinnerMini className="inline" />}

      {children}
    </div>
  );

  return (
    <ButtonPrimary
      className={buttonStyle}
      href={href || undefined}
      disabled={isDisabled}
      {...rest}
    >
      {buttonContent}
    </ButtonPrimary>
  );
}

export default ButtonNew;
