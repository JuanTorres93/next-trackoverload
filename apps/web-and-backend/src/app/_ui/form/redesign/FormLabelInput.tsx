import { twMerge } from "tailwind-merge";

import Label from "../../user-input/Label";

function FormLabelInput({
  label,
  children,
  htmlFor,
  ...props
}: {
  label: string;
  children: React.ReactNode;
  htmlFor?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const id = htmlFor || props.id;

  return (
    <div
      className={twMerge("flex flex-col gap-1.5 w-full", className)}
      {...rest}
    >
      <Label htmlFor={id}>{label}</Label>

      {children}
    </div>
  );
}

export default FormLabelInput;
