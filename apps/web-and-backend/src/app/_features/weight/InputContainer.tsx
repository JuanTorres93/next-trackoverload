import { twMerge } from 'tailwind-merge';

function InputContainer({
  children,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  return (
    <div
      className={twMerge(
        'grid gap-2 max-bp-navbar-mobile:text-2xl grid-cols-1 items-center content-start text-3xl',
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default InputContainer;
