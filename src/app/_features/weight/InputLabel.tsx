import { twMerge } from 'tailwind-merge';

function InputLabel({
  children,
  icon,
  ...props
}: {
  children: React.ReactNode;
  icon?: React.ReactNode;
} & React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { className, ...rest } = props;

  return (
    <label
      className={twMerge(
        'text-xl font-semibold text-primary flex items-center gap-2',
        className,
      )}
      {...rest}
    >
      {icon && <span className="text-text/60">{icon}</span>}
      {children}
    </label>
  );
}

export default InputLabel;
