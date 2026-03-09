import ButtonPrimary from './ButtonPrimary';

type ButtonSecondaryProps = React.ComponentProps<typeof ButtonPrimary>;

function ButtonSecondary({
  children,
  className,
  ...props
}: ButtonSecondaryProps) {
  return (
    <ButtonPrimary
      className={`border-border! text-text-minor-emphasis! hover:bg-text-minor-emphasis! hover:text-text-light! hover:border-text-minor-emphasis! disabled:border-text-minor-emphasis! disabled:hover:bg-transparent! disabled:text-text-minor-emphasis! ${className}`}
      {...props}
    >
      {children}
    </ButtonPrimary>
  );
}

export default ButtonSecondary;
