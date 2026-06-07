import { LuLockKeyhole } from "react-icons/lu";
import { twMerge } from "tailwind-merge";

import BaseInputWithIcon from "./BaseInputWithIcon";

function PasswordInput({
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;

  return (
    <BaseInputWithIcon
      className={twMerge("", className)}
      icon={<LuLockKeyhole className="" size={20} />}
      {...rest}
    />
  );
}

export default PasswordInput;
