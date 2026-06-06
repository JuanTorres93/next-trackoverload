import { twMerge } from "tailwind-merge";

import Input from "./Input";
import Label from "./Label";

function FormLabelInput({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  const id = props.id;

  return (
    <div className={twMerge("flex flex-col gap-1.5", className)} {...rest}>
      <Label htmlFor={id}>{label}</Label>

      <Input type="text" id={id} {...rest} />
    </div>
  );
}

export default FormLabelInput;
