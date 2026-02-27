import TextRegular from './typography/TextRegular';

function Input({
  containerClassName = '',
  children,
  ...props
}: {
  containerClassName?: string;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, disabled, ...rest } = props;

  const disabledStyle =
    'bg-input-background-disabled! text-text-minor-emphasis! border-border/30!';

  return (
    <TextRegular
      className={`flex items-center justify-start border border-border py-1 px-4 rounded-lg bg-input-background text-input-text ${disabled ? disabledStyle : ''} ${containerClassName}`}
    >
      <input
        className={`outline-none w-full disabled:cursor-not-allowed disabled:text-text-minor-emphasis! ${className ?? ''}`}
        disabled={disabled}
        {...rest}
      />
      {children}
    </TextRegular>
  );
}

export default Input;
