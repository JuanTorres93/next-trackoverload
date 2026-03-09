import ButtonPrimary from './ButtonPrimary';

type ButtonDangerProps = React.ComponentProps<typeof ButtonPrimary>;

function ButtonDanger({ children, className, ...props }: ButtonDangerProps) {
  return (
    <ButtonPrimary
      className={`flex items-center gap-2 border-error! text-error! hover:bg-error! hover:text-text-light! hover:border-error! disabled:border-text-minor-emphasis! disabled:hover:bg-transparent! disabled:text-text-minor-emphasis! ${className}`}
      {...props}
    >
      {children}
    </ButtonPrimary>
  );
}

export default ButtonDanger;
