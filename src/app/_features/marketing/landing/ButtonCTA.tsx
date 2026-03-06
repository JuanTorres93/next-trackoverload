import ButtonPrimary from '@/app/_ui/ButtonPrimary';

type ButtonCTAProps = React.ComponentProps<typeof ButtonPrimary>;

function ButtonCTA({ children, className, ...rest }: ButtonCTAProps) {
  return (
    <ButtonPrimary
      className={`bg-primary text-text-light hover:bg-primary-light hover:border-primary-light ${className ?? ''}`}
      {...rest}
    >
      {children}
    </ButtonPrimary>
  );
}

export default ButtonCTA;
