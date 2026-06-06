import { twMerge } from "tailwind-merge";

function Label({
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  const { className, ...rest } =
    props as React.LabelHTMLAttributes<HTMLLabelElement>;

  return (
    <label className={twMerge("font-medium text-[14px]", className)} {...rest}>
      {children}
    </label>
  );
}

export default Label;
