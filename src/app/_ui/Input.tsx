import TextRegular from './typography/TextRegular';

function Input({
  containerClassName,
  children,
  ...props
}: {
  containerClassName?: string;
  children?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <TextRegular
      className={`flex items-center justify-start border border-border py-1 px-4 rounded-lg outline-none ${containerClassName}`}
    >
      <input className={`outline-none w-full ${className}`} {...rest} />
      {children}
    </TextRegular>
  );
}

export default Input;
