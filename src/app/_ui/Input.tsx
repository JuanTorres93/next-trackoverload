import TextRegular from './typography/TextRegular';

function Input({
  containerClassName,
  children,
  ...props
}: {
  containerClassName?: string;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, disabled, ...rest } = props;

  return (
    <TextRegular
      className={`flex items-center justify-start border border-border py-1 px-4 rounded-lg outline-none ${disabled && 'bg-surface-dark/10 text-text-minor-emphasis border-border/30'} ${containerClassName}`}
    >
      <input
        className={`outline-none w-full ${className}`}
        disabled={disabled}
        {...rest}
      />
      {children}
    </TextRegular>
  );
}

export default Input;
