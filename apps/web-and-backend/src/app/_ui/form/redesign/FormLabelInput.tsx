import { twMerge } from "tailwind-merge";

import Label from "../../user-input/Label";

function FormLabelInput({
  label,
  children,
  ...props
}: {
  label: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  const { className, ...rest } = props;

  const id = props.id;

  return (
    <div className={twMerge("flex flex-col gap-1.5", className)} {...rest}>
      <Label htmlFor={id}>{label}</Label>

      {children}
    </div>
  );
}

export default FormLabelInput;
